import Wallet from "../models/walletModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import PDFDocument from 'pdfkit';

export const createOrder = async (req, res) => {
  const userId = req.user.Id;
  const { products, address, coupon, shippingCost, paymentMethod, totalAmount } = req.body;
  try {
    const latestOrder = await Order.find().sort({ orderNumber: -1 }).limit(1);
    const newOrderNumber = `ORD${new Date().getFullYear()}${latestOrder.length > 0 ? Number(latestOrder[0].orderNumber.split('').splice(7).join('')) + 1 : 1001}`;

    const productUpdates = [];
    for (const product of products) {
      const dbProduct = await Product.findById(product.productId);

      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${product.productId} not found` });
      }

      const variantIndex = dbProduct.variants.findIndex(variant => variant.size === product.size);

      if (variantIndex === -1) {
        return res.status(400).json({ 
          message: `Size ${product.size} is not available for product ${dbProduct.name}` 
        });
      }

      const variant = dbProduct.variants[variantIndex];
    
      if (variant.stock < product.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for size ${product.size} of product ${dbProduct.name}` 
        });
      }

      productUpdates.push({
        updateOne: {
          filter: { _id: product.productId, "variants.size": product.size },
          update: { $inc: { "variants.$.stock": -product.quantity } },
        },
      });
    }
    
    await Product.bulkWrite(productUpdates);

    const validatedCoupon = coupon
      ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: !isNaN(Number(coupon.discountValue)) ? Number(coupon.discountValue) : 0, 
        }
      : null;

      let paymentStatus = 'Pending'; 
      if (paymentMethod === 'Wallet') {
        paymentStatus = 'Completed'; 
      } 

      const order = {
          orderNumber: newOrderNumber,
          user: userId,
          products: products.map((product) => ({
            productId: product.productId,
            price: Number(product.price),
            size: product.size,
            discount: Number(product.discount),
            quantity: Number(product.quantity),
        })),
          address,
          coupon : validatedCoupon,
          totalAmount: Number(totalAmount),
          paymentMethod,
          paymentStatus,
          shippingCost: Number(shippingCost),
      };

    const newOrder = await Order.create(order);

    if(paymentMethod === 'Wallet') {
      const wallet = await Wallet.findOne({ user: userId });
      const newBalance = wallet.balance - totalAmount;
      wallet.balance = newBalance;
      wallet.transactions.push({
        type: "Debit",
        amount: newOrder.totalAmount,
        description: `Order payment`,
        orderId: newOrder._id,
        balanceAfter: newBalance,
      });
      await wallet.save();
    }

      res.status(201).json({message:'order placed', orderId:newOrder._id});
  } catch (error) {
    console.log(error)
      res.status(500).json({ message: "Error creating order", error });
  }
};

export const getAllOrdersForUser = async (req, res) => {
  const userId = req.user.Id;
  const { currentPage, limitPerPage, activeTab } = req.query;
  const filters = { user: userId };
  if (activeTab === 'All Orders') {
    delete filters.status;
  } else if (activeTab === 'In-Progress') {
    filters.status = { $in: ['Pending', 'Shipped'] };
  } else if (activeTab === 'Completed') {
    filters.status = 'Delivered';
  } else if (activeTab === 'Cancelled') {
    filters.status = 'Cancelled';
  } else if (activeTab === 'Returned') {
    filters.status = 'Returned';
  } else if (activeTab === 'Failed to Process') {
    filters.paymentStatus = 'Failed';
  }
  console.log(filters)
  try {
    const orders = await Order.find(filters).skip((currentPage - 1) * limitPerPage).limit(limitPerPage).populate("user").populate("address").populate({
      path: "products.productId",
      populate: {
        path: "category",
        select: "name",
      },
    }).sort({ createdAt: -1 })
    
    const totalPages = Math.ceil((await Order.find(filters).countDocuments()) / limitPerPage);
    res.status(200).json({totalPages,orders});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user").populate("address").populate({
      path: "products.productId",
      select: "-__v -createdAt -updatedAt",
      populate: {
        path: "category",
        select: "name",
      },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updatePaymentStatus = async (req, res) => {
  try {
    const { id : orderId ,paymentStatus } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.paymentStatus = paymentStatus;
    await order.save();
    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const generateInvoice = async (req, res) => {
  const { orderId } = req.params;

  try {
      const order = await Order.findById(orderId).populate('products.productId');
      if (!order) {
          return res.status(404).send({ message: 'Order not found' });
      }

      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order.orderNumber}.pdf`);
          res.send(pdfData);
      });

      doc.on('error', (err) => {
          console.error('Error generating invoice:', err);
          res.status(500).send({ message: 'Error generating invoice' });
      });

      doc.fontSize(20).fillColor('#1F618D').text('VIVA BAGS', { align: 'center' })
          .moveDown(0.5).fontSize(14).fillColor('#000000')
          .text(`Invoice #${order.orderNumber}`, { align: 'center' })
          .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'center' })
          .moveDown(1);

      doc.fontSize(12).fillColor('#000000').text(`Customer: ${order.address.fullName}`)
          .text(`Email: ${order.address.email || 'N/A'}`)
          .text(`Mobile: ${order.address.mobile}`)
          .text(`Address: ${order.address.address}, ${order.address.locality}, ${order.address.state}, ${order.address.country} - ${order.address.pincode}`)
          .moveDown(1);

      const tableTop = doc.y;
      const tableLeft = 50;
      const tableWidth = 500;
      const rowHeight = 25;

      const headers = [
          { label: 'S.No', width: 40, color: '#1ABC9C' },
          { label: 'Product Name', width: 130, color: '#1ABC9C' },
          { label: 'Quantity', width: 80, color: '#1ABC9C' },
          { label: 'Price', width: 80, color: '#1ABC9C' },
          { label: 'Discount', width: 80, color: '#1ABC9C' },
          { label: 'Total', width: 90, color: '#1ABC9C' }
      ];

      const drawRow = (columns, y) => {
          let x = tableLeft;
          columns.forEach((col, index) => {
              doc.fillColor(index === 0 ? '#E8F6F3' : '#D5DBDB')
                  .rect(x, y, headers[index].width, rowHeight).fill();
              doc.fillColor('#000000').fontSize(10).text(col, x + 5, y + 8, { width: headers[index].width - 10, align: 'center' });
              x += headers[index].width;
          });
      };

      drawRow(headers.map(header => header.label), tableTop);

      let y = tableTop + rowHeight;
      order.products.forEach((product, index) => {
          const { productId, quantity, price, discount } = product;
          const total = quantity * (price - discount);
          drawRow([index + 1, productId.name, quantity, `₹${price}`, `₹${discount}`, `₹${total}`], y);
          y += rowHeight;
      });

      y += 20; 
      doc.fontSize(12).fillColor('#000000').text(`Subtotal: ₹${order.totalAmount}`, tableLeft, y, { align: 'left' });
      y += 20;
      if (order.coupon.discountValue > 0) {
          const couponDiscount = order.coupon.discountType === 'percentage'
              ? (order.totalAmount * (order.coupon.discountValue / 100))
              : order.coupon.discountValue;
          doc.text(`Coupon Discount: ₹${couponDiscount}`, tableLeft, y, { align: 'left' });
          y += 20;
      }
      doc.text(`Shipping Cost: ₹${order.shippingCost}`, tableLeft, y, { align: 'left' });
      y += 20;
      doc.text(`Total: ₹${order.totalAmount + order.shippingCost}`, tableLeft, y, { align: 'left' });
      y += 40;

      doc.fontSize(10).fillColor('#1F618D').text('Thank you for shopping with us!', { align: 'center' });

      doc.end();
  } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).send({ message: 'Error generating invoice' });
  }
};



//                      CANCEL ORDER


export const cancelOrder = async (req, res) => {
  try {
    const { id: orderId} = req.params;
    const {reason} =req.body;
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled"){
      return res.status(400).json({ message: "Order already cancelled" });
    }
    if(!reason) return res.status(404).json({ message: "reason is required"})

    
    if (order.paymentStatus === "Completed") {
      const refundAmount = order.totalAmount - order.shippingCost;

      let wallet = await Wallet.findOne({ user: order.user });
      if (!wallet) {
        wallet = new Wallet({ user: order.user, balance: 0, transactions: [] });
      }
      wallet.balance += refundAmount;
      wallet.transactions.push({
        type: "Credit",
        amount: refundAmount,
        description: "Refund for Cancelled order",
        orderId: order._id,
        balanceAfter: wallet.balance,
      });
      await wallet.save();
    }
    const uncancelledProducts = order.products.filter((product) => product.status !== "Cancelled");
    order.status = "Cancelled";
    order.cancelReason = reason;
    order.products.forEach((item) => {
      item.status = "Cancelled";
    })
    order.markModified("products");

    order.coupon.code = null;
    order.coupon.discountType = null;
    order.coupon.discountValue = 0;
    order.markModified("coupon");

    const productUpdates = [];
    for (const item of uncancelledProducts) {
      const dbProduct = await Product.findById(item.productId);

      if (dbProduct) {
        const variantIndex = dbProduct.variants.findIndex(
          (variant) => variant.size === item.size
        );

        if (variantIndex !== -1) {
          productUpdates.push({
            updateOne: {
              filter: {
                _id: item.productId,
                "variants.size": item.size,
              },
              update: {
                $inc: { "variants.$.stock": item.quantity },
              },
            },
          });
        } else {
          return res.status(400).json({
            message: `Variant size ${item.size} not found for product ${dbProduct.name}`,
          });
        }
      }
    }

    if (productUpdates.length > 0) {
      await Product.bulkWrite(productUpdates);
    }

    await order.save();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to cancel order", error });
  }
};

export const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, reason } = req.body;
    console.log(reason)


    const order = await Order.findById(orderId).populate("products.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if(order.status === "Cancelled"){
      return res.status(400).json({ message: "Order already cancelled" });
    }
    
    const productIndex = order.products.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (productIndex === -1){
      return res.status(404).json({ message: "Product not found in the order" });
    }

    const product = order.products[productIndex];
    const dbProduct = await Product.findById(product.productId);

    if (!dbProduct) {
      return res.status(404).json({ message: "Product not found in the database" });
    }

    const variantIndex = dbProduct.variants.findIndex(
      (variant) => variant.size === product.size
    );

    if (variantIndex === -1) {
      return res.status(400).json({
        message: `Size ${product.size} is not available for product ${dbProduct.name}`,
      });
    }

    dbProduct.variants[variantIndex].stock += product.quantity;
    await dbProduct.save();
    
    product.status = "Cancelled";
    product.cancelReason = reason;
    order.markModified("products");

    const allProductsSameStatus = order.products.every(item => item.status === product.status);
    if (allProductsSameStatus) {
      order.status = product.status; 
    }
    

    const uncancelledProducts = order.products.filter(item => item.status !== "Cancelled" 
      && item.status !== "Returned" 
      && item.productId._id.toString() !== product.productId);

    if (uncancelledProducts.length === 1) {
      order.status = uncancelledProducts[0].status;
    }

    if (order.paymentStatus === "Completed") {
      let refundAmount = 0;

      const currentCostOfProducts = uncancelledProducts.reduce((acc, item) => {
        const price = Number(item.price) || 0; 
        const quantity = Number(item.quantity) || 0; 
        return acc + price * quantity;
      }, 0);

      let isEligibleForCoupon = false;
      if (order.coupon.discountValue > 0) {
        const coupon = await Coupon.findOne({ code: order.coupon.code });
        if (coupon) {
          isEligibleForCoupon = currentCostOfProducts >= coupon.minimumPurchase;
          }
        }

          if(isEligibleForCoupon){
            refundAmount = product.price * product.quantity;
            order.totalAmount = currentCostOfProducts + order.shippingCost - (order.coupon.discountType === "percentage" ? currentCostOfProducts * (order.coupon.discountValue / 100) : order.coupon.discountValue);
          } else {
            refundAmount = product.price * product.quantity - (order.coupon.discountType === "percentage" ? order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue);
            order.coupon.code = null;
            order.coupon.discountType = null;
            order.coupon.discountValue = 0;
            order.markModified("coupon");

            order.totalAmount = currentCostOfProducts + order.shippingCost;
          }
      
      let wallet = await Wallet.findOne({ user: order.user });
      if (!wallet) {
        wallet = new Wallet({ user: order.user, balance: 0, transactions: [] });
      }

      wallet.balance += refundAmount;
      wallet.transactions.push({
        type: "Credit",
        amount: refundAmount,
        description: `Refund for Cancelled item - ${product.productId.name}`,
        orderId: order._id,
        balanceAfter: wallet.balance,
      });
      console.log(wallet)
      await wallet.save();
    }
    
    await order.save();
    const updatedOrder = await Order.findById(orderId).populate("user").populate("address").populate("products.productId")
    res.status(200).json({ message: "Item cancelled successfully", order: updatedOrder });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to cancel item", error });
  }
};



//                      RETURN ORDER

export const requestItemReturn = async (req, res) => {
  try {
      const { orderId, itemId, reason } = req.body;
console.log(reason)
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }
      const allProducts = order.products.filter(item => item.status !== "Cancelled");
      const item = allProducts.find(product => product._id.toString() === itemId);
      if (!item) {
          return res.status(404).json({ message: "Item not found in the order" });
      }

      item.isReturnRequested = true;
      item.returnReason = reason;
      item.returnStatus = "Pending";
      if(allProducts.every(item => item.isReturnRequested === true)) {
        order.isReturnRequested = true;
        order.returnStatus = "Pending";
      }

      await order.save();
      const updatedOrder = await Order.findById(orderId).populate("user").populate("address").populate({
        path: "products.productId",
        populate: {
          path: "category",
          select: "name",
        },
      })
    
      res.status(200).json({ message: "Return request for item submitted", order: updatedOrder });
  } catch (error) {
      res.status(400).json({ message: "Error requesting item return", error: error.message });
  }
};

export const requestOrderReturn = async (req, res) => {
  try {
      const { orderId, reason } = req.body;
      console.log(reason)

      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      order.isReturnRequested = true;
      order.returnReason = reason;
      order.returnStatus = "Pending";

      order.products.forEach((item) => {
          if(item.status === "Delivered" && item.isReturnRequested === false) {
            item.isReturnRequested = true;
            item.returnReason = reason;
            item.returnStatus = "Pending";
          }
      });

      await order.save();
      const updatedOrder = await Order.findById(orderId).populate("user").populate("address").populate({
        path: "products.productId",
        populate: {
          path: "category",
          select: "name",
        },
      })
      res.status(200).json({ message: "Return request for order submitted", order: updatedOrder });
  } catch (error) {
      res.status(400).json({ message: "Error requesting order return", error: error.message });
  }
};




//                     Admin


export const updateProductStatus = async (req, res) => {
  try {
    const { id : productId } = req.params;
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId).populate("user").populate("address").populate({
      path: "products.productId",
      select: "-__v -createdAt -updatedAt",
      populate: {
        path: "category",
        select: "name",
      },
    })
    if (!order) return res.status(404).json({ message: "Order not found" });
    const product = order.products.find(item => item.productId._id.toString() === productId)
    if (!product) return res.status(404).json({ message: "Product not found in order" });

    const currentStatus = product.status;
    const isValidUpdate = (() => {
      if(currentStatus === "Pending") {
        return status !== "Delivered" && status !== "Returned";
      }
      if (currentStatus === "Shipped") {
        return status !== "Pending" && status !== "Returned";
      }
      if (currentStatus === "Delivered") {
        return status !== "Pending" && status !== "Shipped" && status !== "Cancelled"; 
      }
      if (currentStatus === "Cancelled" || currentStatus === "Returned") {
        return false;
      }
      return true; 
    })();

    if (!isValidUpdate) {
      return res.status(400).json({ message: `Cannot change status from ${currentStatus} to ${status}` });
    }
    
    product.status = status;
    const correspondingProduct = await Product.findById(productId);
    if(status === "Delivered"){
      correspondingProduct.popularity += product.quantity;
    } else if(status === "Returned") {
      correspondingProduct.popularity -= product.quantity;
    }
    await correspondingProduct.save();
    await order.save();

    const allProductsSameStatus = order.products.every(item => item.status === product.status);
    if (allProductsSameStatus) {
      order.status = product.status; 
      if(order.status === "Delivered" && order.paymentMethod === "COD") order.paymentStatus = "Completed";
      await order.save();
    }
    const uncancelledProducts = order.products.filter(item => item.status !== "Cancelled" && item.status !== "Returned");
    if (uncancelledProducts.length >= 1){
      if(uncancelledProducts.some(item => item.status === "Pending")) {
        order.status = "Pending";
        await order.save();
      } else if(uncancelledProducts.some(item => item.status === "Shipped") && !uncancelledProducts.some(item => item.status === "Pending")) {
        order.status = "Shipped";
        await order.save();
      } else {
        order.status = "Delivered";
        if(order.paymentMethod === "COD") order.paymentStatus = "Completed";
        await order.save();
      }
    } else {
      if(order.products.some(item => item.status === "Returned")) {
        order.status = "Returned";
        await order.save();
      } else {
        order.status = "Cancelled";
        await order.save();
      }
    }

    res.status(200).json({ message: "Product status updated successfully", order });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to update product status", error });
  }
}; 


export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate("products.productId").populate("address");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const countOrders = async (req, res) => {
  try {
    const count = await Order.countDocuments({status: { $ne: "Cancelled" }});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count orders" });
  }
};

export const getAllOrders = async (req, res) => {
  const { currentPage, limitPerPage,filter, search } = req.query;
  try {

    const filters = {};

    if (filter && filter !== "all") {
      filters.status = filter;
    }

    if (search) {
      filters.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ]
    }
    const orders = await Order.find({...filters}).skip((currentPage - 1) * limitPerPage).limit(limitPerPage).populate({
      path: "user",
      select: "username",
    }).populate({
      path: "address",
      select: "-__v -createdAt -updatedAt",
    }).populate({
      path: "products.productId",
      select: "-__v -createdAt -updatedAt",
      populate: {
        path: "category",
        select: "name",
      },
    }).sort({ createdAt: -1 });
    console.log(orders)
    const totalPages = Math.ceil((await Order.find({...filters}).countDocuments()) / limitPerPage);
    res.status(200).json({totalPages,orders});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    if(status === "Returned") return
    order.products.forEach( async (item) => {
      if(item.status !== "Cancelled" && item.status !== "Returned"){
        if (status === "Cancelled" && item.status === "Delivered" ) return 
        if( item.status === "Delivered" && status === "Shipped" ) return
        if (item.status === "Shipped" && status === "Pending") return
        item.status = status;
        if(status === "Delivered"){
          const correspondingProduct = await Product.findById(item.productId);
          correspondingProduct.popularity += item.quantity;
          await correspondingProduct.save();
        }
      }
    })
    order.markModified("products");
    if(order.status === "Delivered" && order.paymentMethod === "COD") order.paymentStatus = "Completed";
    await order.save();
    res.status(200).json({order,message:'order status updated'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//       Return

export const getPendingReturns = async (req, res) => {
  try {
      const orders = await Order.find({
          $or: [
              { isReturnRequested: true, returnStatus: "Pending" },
              { products: { $elemMatch: { isReturnRequested: true, returnStatus: "Pending" } } }
          ]
      });
      res.status(200).json(orders);
  } catch (error) {
      res.status(400).json({ message: "Error fetching pending returns", error: error.message });
  }
};

export const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, returnStatus } = req.body;

    if (returnStatus === "None") {
      return res.status(400).json({ message: "Invalid return status" });
    }

    const order = await Order.findById(id).populate("products.productId").populate("address");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const product = order.products.find((item) => item._id.toString() === itemId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "Cancelled" || product.status === "Returned") {
      return res.status(400).json({ message: "Action not allowed on this product" });
    }

    product.returnStatus = returnStatus;
    const dbProduct = await Product.findById(product.productId);
    if (!dbProduct) {
      return res.status(404).json({ message: "Product not found in the database" });
    }

    const variantIndex = dbProduct.variants.findIndex(
      (variant) => variant.size === product.size
    );

    if (variantIndex !== -1) {
      if (returnStatus === "Completed") {
        dbProduct.variants[variantIndex].stock += product.quantity;
        dbProduct.markModified("variants");
        await dbProduct.save();
      }
    } else {
      return res.status(400).json({ message: `Variant size ${product.size} not found for product` });
    }

    if (returnStatus === "Completed") {
      product.status = 'Returned';

      let refundAmount = 0;

      const remainingProducts = order.products.filter(
        (item) => item.status !== "Cancelled" && item.status !== "Returned" && item._id.toString() !== itemId
      )

      const costOfRemainingProducts = remainingProducts.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
      }, 0);

      let isEligibleForCoupon = false;
      if (order.coupon.discountValue > 0) {
        const coupon = await Coupon.findOne({ code: order.coupon.code });
        if (coupon) {
          isEligibleForCoupon = costOfRemainingProducts >= coupon.minimumPurchase;
          }
        }
        if(isEligibleForCoupon){
          refundAmount = product.price * product.quantity;
          order.totalAmount = costOfRemainingProducts + order.shippingCost - (order.coupon.discountType === "percentage" ? costOfRemainingProducts * (order.coupon.discountValue / 100) : order.coupon.discountValue);
        } else {
          refundAmount = product.price * product.quantity - (order.coupon.discountType === "percentage" ? order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue);
          
          order.coupon.code = null;
          order.coupon.discountType = null;
          order.coupon.discountValue = 0;
          order.markModified("coupon");
          
          order.totalAmount = costOfRemainingProducts + order.shippingCost;
        }
      
      
      let wallet = await Wallet.findOne({ user: order.user });
      if (!wallet) {
        wallet = new Wallet({ user: order.user, balance: 0, transactions: [] });
      }

      const productName = dbProduct?.name || "Unknown Product";

      wallet.balance += refundAmount;
      wallet.transactions.push({
        type: "Credit",
        amount: refundAmount,
        description: `Refund for returned product - ${productName}`,
        orderId: order._id,
        balanceAfter: wallet.balance,
      });
      await wallet.save();
    }

    const allProducts = order.products.filter((item) => item.status === "Delivered");

    if (allProducts.every((item) => item.returnStatus === returnStatus && returnStatus !== "Completed")) {
      order.isReturnRequested = true;
      order.returnStatus = returnStatus;
    } else if (allProducts.every((item) => item.returnStatus !== "Pending")) {
      order.returnStatus = "Responded";
    }

    if (allProducts.every((item) => item.returnStatus === "Completed")) {
      order.isReturnRequested = true;
      order.returnStatus = "Completed";
      order.status = "Returned";
      order.paymentStatus = "Refunded";
    }

    order.markModified("products");
    await order.save();

    return res.status(200).json({ message: "Return status updated", order });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error updating return status", error: error.message });
  }
};
