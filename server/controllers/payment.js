import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const makePayment = async (req, res) => {
  const { amount } = req.body;

  if ( !amount || amount <= 0 ) {
      return res.status(400).json({ message: "Invalid amount" });
    }

  const options = {
    amount: Number(amount).toFixed(0) * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };
  try {
    const order = await razorpayInstance.orders.create(options);
    console.log(order);
    res.status(200).json({
      id: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
