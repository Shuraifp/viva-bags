import Wallet from "../models/walletModel.js";


export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.Id });
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