import Wallet from "../models/walletModel.js";


export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.Id }).populate("transactions.orderId", "orderNumber");
    
    if(!wallet) {
      const newWallet = new Wallet({ user: req.user.Id , balance: 0 });
      await newWallet.save();
      return res.status(200).json(newWallet);
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const checkBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({ user: req.user.Id });
    
    if (!wallet) {
      wallet = new Wallet({ user: req.user.Id, balance: 0 });
      await wallet.save(); 
    }

    if (amount > wallet.balance) {
      return res.status(400).json({ message: "Insufficient balance in your wallet" });
    }

    res.status(200).json(wallet);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: error.message });
  }
};
