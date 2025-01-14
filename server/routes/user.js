import { Router } from "express";
const router = Router();
import { register, login, sendOtp, verifyOtp, loginUserWithGoogle, sendResetPasswordEmail,resetPassword } from "../controllers/auth.js";
import { getAllCategories, categoriesOverview } from "../controllers/categories.js";
import { getAllBrands } from "../controllers/brands.js";
import { getProductByIdForUser,getFilteredProducts, getSortedProducts, getFeaturedProducts, getFilterCounts } from "../controllers/products.js";
import { addToCart, fetchCart, updateCart, deleteCartItem, getCartCount, clearCart } from "../controllers/cart.js";
import { authenticateJWT, isUser } from "../middlewares/verifyToken.js";
import { addAddress, getAllAddresses, editAddress, deleteAddress, toggleDefault } from "../controllers/address.js";
import { createOrder, getAllOrdersForUser, getOrderById, cancelOrder, cancelOrderItem, requestItemReturn, requestOrderReturn, updatePaymentStatus, generateInvoice } from "../controllers/order.js"
import { editProfile, fetchProfile, changePassword } from "../controllers/users.js";
import { getCouponsForUser, applyCoupon, removeAppliedCoupon } from "../controllers/coupon.js";
import { makePayment } from "../controllers/payment.js";
import { addToWishlist, getWishlist, deleteWishlistItem } from "../controllers/wishlist.js";
import { getWallet, checkBalance, addMoneyToWallet } from "../controllers/wallet.js";
import { addReview, fetchReviews } from "../controllers/review.js";
import { offerForBanner } from "../controllers/offers.js";


// Auth
router.post("/auth/register",verifyOtp, register);
router.post("/auth/login", login);
router.post('/auth/send-otp', sendOtp);
router.post('/auth/refresh-token');
router.post('/auth/validate-token',authenticateJWT);
router.post('/auth/login/firebase', loginUserWithGoogle);// ..........firebase
router.post('/auth/send-resetEmail', sendResetPasswordEmail);
router.post('/auth/reset-password', resetPassword);


//Profile
router.get('/profile', isUser, fetchProfile);
router.patch('/profile', isUser, editProfile);
router.post('/forgot-password', isUser, sendOtp);
router.patch('/change-password', isUser, changePassword);


// Product
router.get('/products/sorted', getSortedProducts)
router.get('/products/featured', getFeaturedProducts)
router.get('/products/count', getFilterCounts)
router.get('/products/:id', getProductByIdForUser);
router.get('/categories/:category/products', getFilteredProducts)


// Categories
router.get("/categories", getAllCategories);
router.get('/categories/overview', categoriesOverview);


// Brands
router.get("/brands", getAllBrands);


// Cart
router.post('/cart/add', isUser, addToCart);
router.get('/cart', isUser, fetchCart);
router.put('/cart/update', isUser, updateCart);
router.delete('/cart/remove/:id', isUser, deleteCartItem);
router.get('/cart/count', isUser, getCartCount)
router.delete('/cart/clear', isUser, clearCart);


// Address
router.post('/address/add', isUser, addAddress)
router.get('/address', isUser, getAllAddresses)
router.put('/address/edit/:id', isUser, editAddress)
router.delete('/address/delete/:id', isUser, deleteAddress)
router.patch('/address/default/:id', isUser, toggleDefault)


// Order
router.post('/order/add', isUser, createOrder)
router.get('/orders', isUser, getAllOrdersForUser)
router.get('/orders/:id', isUser, getOrderById)
router.patch('/orders/cancel/:id', isUser, cancelOrder)
router.patch('/orders/cancel-item/', isUser, cancelOrderItem)
router.patch('/orders/return-item', isUser, requestItemReturn)
router.patch('/orders/return-order', isUser, requestOrderReturn)
router.patch('/orders/update-payment', isUser, updatePaymentStatus)
router.get('/orders/invoice/:orderId', isUser, generateInvoice)


// Coupons
router.get('/coupons', isUser, getCouponsForUser)
router.post('/coupons/apply', isUser, applyCoupon)
router.delete('/coupons/remove/:id', isUser, removeAppliedCoupon)


// Offers
router.get('/offers', offerForBanner)


// Payments
router.post('/razorpay/order', isUser, makePayment);


// Wishlist
router.post('/wishlist/add', isUser, addToWishlist);
router.get('/wishlist', isUser, getWishlist);
router.delete('/wishlist/remove/:id', isUser, deleteWishlistItem);


// Wallet
router.get('/wallet', isUser, getWallet);
router.post('/wallet/check', isUser, checkBalance);
router.post('/wallet/add', isUser, addMoneyToWallet);


// Review
router.post('/reviews/add', isUser, addReview);
router.get('/reviews/:id', isUser, fetchReviews);

export default router;