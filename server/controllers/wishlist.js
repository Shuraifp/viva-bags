import Wishlist from '../models/wishlistModel.js';


export const getWishlist = async (req, res) => {
  try {
    const  userId  = req.user.Id;
    const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');
    if(!wishlist){
      return res.status(404).json({ message: "Wishlist not found" });
    }
    const wishlistItems = wishlist.products.map(item => item.productId);
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const  userId  = req.user.Id
    const { productId } = req.body;
    const isExists = await Wishlist.findOne({ userId, "products.productId": productId });
    if (isExists) {
      return res.status(400).json({ message: "Product already exists in the wishlist" });
    }
    const wishlist = await Wishlist.findOneAndUpdate({ userId,"products.productId": { $ne: productId }  }, { $addToSet: { products: { productId } } }, { upsert: true, new: true });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteWishlistItem = async (req, res) => {
  try {
    const  userId  = req.user.Id
    const { id: productId } = req.params;
    const wishlist = await Wishlist.findOneAndUpdate({ userId }, { $pull: { products: { productId } } }, { upsert: true, new: true }).populate('products.productId')
    const wishlistItems = wishlist.products.map(item => item.productId);
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};