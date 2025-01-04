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

      if (dbProduct.stock < product.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${dbProduct.name}` 
        });
      }

    
      productUpdates.push({
        updateOne: {
          filter: { _id: product.productId },
          update: { $inc: { stock: -product.quantity } },
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
        description: `Order payment for ${newOrder.orderNumber}`,
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



//                      CANCEL ORDER


export const cancelOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled"){
      return res.status(400).json({ message: "Order already cancelled" });
    }

    
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

    order.status = "Cancelled";
    order.totalAmount = order.shippingCost;
    order.products.forEach((item) => {
      item.status = "Cancelled";
    })
    order.markModified("products");

    order.coupon.code = null;
    order.coupon.discountType = null;
    order.coupon.discountValue = 0;
    order.markModified("coupon");

    const productUpdates = order.products.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: item.quantity } },
      },
    }));
    await Product.bulkWrite(productUpdates);

    await order.save();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to cancel order", error });
  }
};

export const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, productId } = req.body;


    const order = await Order.findById(orderId).populate("products.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if(order.status === "Cancelled"){
      return res.status(400).json({ message: "Order already cancelled" });
    }
    
    const productIndex = order.products.findIndex(
      (item) => item.productId._id.toString() === productId
    );
    if (productIndex === -1){
      return res.status(404).json({ message: "Product not found in the order" });
    }

    const product = order.products[productIndex];
    product.status = "Cancelled";
    
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: product.quantity },
    });
    order.markModified("products");

    const allProductsSameStatus = order.products.every(item => item.status === product.status);
    if (allProductsSameStatus) {
      order.status = product.status; 
    }
    

    const uncancelledProducts = order.products.filter(item => item.status !== "Cancelled" && item.status !== "Returned" && item.productId._id.toString() !== productId);
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
      const { orderId, productId, reason } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }
      const allProducts = order.products.filter(item => item.status !== "Cancelled");
      const item = allProducts.find(product => product.productId.toString() === productId);
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
    order.products.forEach((item) => {
      if(item.status !== "Cancelled" && item.status !== "Returned"){
        if (status === "Cancelled" && item.status === "Delivered" ) return 
        if( item.status === "Delivered" && status === "Shipped" ) return
        if (item.status === "Shipped" && status === "Pending") return
        item.status = status;
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
    const { productId, returnStatus } = req.body;

    if (returnStatus === "None") {
      return res.status(400).json({ message: "Invalid return status" });
    }

    const order = await Order.findById(id).populate("products.productId").populate("address");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const product = order.products.find((item) => item.productId._id.toString() === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "Cancelled" || product.status === "Returned") {
      return res.status(400).json({ message: "Action not allowed on this product" });
    }

    product.returnStatus = returnStatus;
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: product.quantity },
    })

    if (returnStatus === "Completed") {
      product.status = 'Returned';

      let refundAmount = 0;

      const remainingProducts = order.products.filter(
        (item) => item.status !== "Cancelled" && item.status !== "Returned" && item.productId._id.toString() !== productId
      )

      const costOfRemainingProducts = remainingProducts.reduce((acc, item) => {
        return acc + item.price * item.quantity;
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

      const productDetails = await Product.findById(productId);
      const productName = productDetails?.name || "Unknown Product";

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
