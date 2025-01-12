import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js'

export const addToCart = async (req, res) => {
  const { productId, quantity, selectedSize } = req.body;
  const user = req.user.Id;
  try {
    let cart = await Cart.findOne({ user });
    
    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    const currQunty = cart.items.find(
      item => item.product.toString() === productId.toString() && item.size === selectedSize
    )?.quantity || 0;

    const product = await Product.findById(productId);
    if (product.variants.find(variant => variant.size === selectedSize).stock < currQunty + quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const productIndex = cart.items.findIndex(
      item => item.product.toString() === productId.toString() && item.size === selectedSize
    );

    if (productIndex > -1) {
      const currentQuantity = cart.items[productIndex].quantity;
      if (currentQuantity + quantity > 10) {
        return res.status(400).json({
          message: `You can only add up to 10 units of this product to your cart.`,
        });
      }
      cart.items[productIndex].quantity += quantity;
    } else {
      if (quantity > 10) {
        return res.status(400).json({
          message: `You can only add up to 10 units of this product to your cart.`,
        });
      }
      const updated = await Cart.findOneAndUpdate(
        { 
          user,
          "items.product": productId,
          "items.size": selectedSize
        },
        { $push: { items: { product: productId, quantity, size: selectedSize } } },
        { new: true }
      );
      if (updated) {
        cart = updated;
      } else {
          cart.items.push({ product: productId, quantity, size: selectedSize });
      }
    }
    
    await cart.save();
    const totalQuantity = cart.items.length > 0 ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
    res.status(200).json({ message: 'Product added to cart', quantity: totalQuantity});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



export const fetchCart = async (req, res) => {
  const user = req.user.Id;
  try {
    let cart = await Cart.findOne({ user }).populate({
      path: 'items.product',
      select: 'name  discountedPrice  images regularPrice',
      populate: {
        path: 'category',
        select: 'name',
      },
    });

    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    const { items } = cart;
    res.status(200).json(items);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching cart' });
  }
};



export const updateCart = async (req, res) => {
  const { productId, quantity, selectedSize } = req.body; 
  const user = req.user.Id;
  try {
    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    const currentItem = cart.items.find(
      item => item.product.toString() === productId.toString() && item.size === selectedSize
    );
    const currQunty = currentItem?.quantity || 0;
    if (currQunty + quantity <= 0) {
      return res.status(400).json({ message: 'Cannot reduce quantity below 1' });
    }

    const product = await Product.findById(productId);
    const selectedVariantStock = product.variants.find(variant => variant.size === selectedSize).stock;
    if (selectedVariantStock < quantity+currQunty) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    if (quantity+currQunty  > 10) {
      return res.status(400).json({
        message: `You can only add up to 10 units of this product to your cart.`,
      });
    }
    
    const productIndex = cart.items.findIndex(
      item => item.product.toString() === productId.toString() && item.size === selectedSize
    );

    if (productIndex === -1) {
        cart.items.push({ product: productId, quantity,size: selectedSize });
    } else {
        cart.items[productIndex].quantity += quantity;
    }
     
    await cart.save(); 
    const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    res.status(200).json({ message: 'Cart updated successfully', quantity: totalQuantity, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCartItem = async (req, res) => {
  const { id } = req.params;
  const user = req.user.Id;
  try {
    const cart = await Cart.findOne({ user });
  
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const productIndex = cart.items.findIndex(item => item._id.toString() === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    
    cart.items.splice(productIndex, 1); 
    await cart.save(); 
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const getCartCount = async (req, res) => {
  const user = req.user.Id;
  try{
    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = new Cart({ user, items: [] });
    }
    res.status(200).json(cart.items.length)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}



export const clearCart = async (req, res) => {
  try {
    const userId = req.user.Id; 
    const cart = await Cart.findOneAndDelete({ user: userId });
    console.log('cart cleared');
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};
