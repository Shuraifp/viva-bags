import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_RV3WvAL2SuYG54',
  key_secret: 'o4I5y81ZSyHA3C47GQyMdqSv',
});

export const makePayment = async (req, res) => {
  const { amount} = req.body;
console.log(amount)
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
      res.status(500).json({ error: "Failed to create payment order" });
  }
}