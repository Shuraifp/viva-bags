import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res) => {
  const userId = req.user.Id;
  const { products, address, shippingCost, paymentMethod, totalAmount } = req.body;
  try {
    const latestOrder = await Order.find().sort({ orderNumber: -1 }).limit(1);
    const newOrderNumber = `ORD-${new Date().getFullYear()}-${latestOrder.length > 0 ? Number(latestOrder[0].orderNumber.split("-")[2]) + 1 : 1001}`;

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

      const order = {
          orderNumber: newOrderNumber,
          user: userId,
          products: products.map((product) => ({
            productId: product.productId,
            quantity: Number(product.quantity),
        })),
          address,
          totalAmount: Number(totalAmount),
          paymentMethod,
          shippingCost: Number(shippingCost),
      };
    const newOrder = await Order.create(order);
      res.status(201).json({message:'order placed'});
  } catch (error) {
    console.log(error)
      res.status(500).json({ message: "Error creating order", error });
  }
};

export const getAllOrdersForUser = async (req, res) => {
  const userId = req.user.Id;
  const { currentPage, limitPerPage } = req.query;
  try {
    const orders = await Order.find({ user: userId }).skip((currentPage - 1) * limitPerPage).limit(limitPerPage).populate("user").populate("address").populate({
      path: "products.productId",
      populate: {
        path: "category",
        select: "name",
      },
    }).sort({ createdAt: -1 })
    const totalPages = Math.ceil((await Order.find({ user: userId }).countDocuments()) / limitPerPage);
    console.log(orders)
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




export const cancelOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId);
    console.log(order)
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Order already cancelled" });

    order.status = "Cancelled";

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
    res.status(500).json({ message: "Failed to cancel order", error });
  }
};

export const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, productId } = req.query;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const productIndex = order.products.findIndex(
      (item) => item.productId._id.toString() === productId
    );
    if (productIndex === -1)
      return res.status(404).json({ message: "Product not found in the order" });

    const product = order.products[productIndex];

    order.products.splice(productIndex, 1);

    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: product.quantity },
    });

    if (order.products.length === 0) {
      order.status = "Cancelled";
    }

    await order.save();
    res.status(200).json({ message: "Item cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel item", error });
  }
};


export const updateProductStatus = async (req, res) => {
  try {
    const { orderId, productId, status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const product = order.products.find((p) => p.productId.toString() === productId);
    if (!product) return res.status(404).json({ message: "Product not found in order" });

    product.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count orders" });
  }
};

export const getAllOrders = async (req, res) => {
  const { currentPage, limitPerPage,filter } = req.query;
  try {

    const filters = {};

    if (filter && filter !== "all") {
      filters.status = filter;
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
    await order.save();
    res.status(200).json({order,message:'order status updated'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};