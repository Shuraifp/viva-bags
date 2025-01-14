import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_RV3WvAL2SuYG54',
  key_secret: 'o4I5y81ZSyHA3C47GQyMdqSv',
});

export const makePayment = async (req, res) => {
  const { amount} = req.body;

  const options = {
      amount: Number(amount).toFixed(0) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, 
  };
  try {
      const order = await razorpayInstance.orders.create(options);
      console.log(order)
      res.status(200).json({
          id: order.id,
          amount: order.amount,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
}


// export const createWalletOrder = async (req, res) => {
//   const { amount, userId } = req.body;
//   try {
//     const options = {
//       amount: amount * 100, 
//       currency: 'INR',
//       receipt: `wallet_topup_${userId}_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({ success: true, order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Failed to create wallet top-up order' });
//   }
// };

// export const verifyWalletPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const crypto = require('crypto');
//   const hash = crypto
//     .createHmac('sha256', 'YOUR_RAZORPAY_SECRET')
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest('hex');

//   if (hash === razorpay_signature) {
//     // Payment verified, add money to user's wallet in your database
//     res.json({ success: true, message: 'Payment verified successfully' });
//   } else {
//     res.status(400).json({ success: false, message: 'Invalid signature' });
//   }
// };
