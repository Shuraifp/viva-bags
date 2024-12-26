import { Router } from "express";
const router = Router();
import { adminLogin} from "../controllers/auth.js";
import { refreshToken, authenticateJWT, isAdmin } from "../middlewares/verifyToken.js";
import { getAllUsers, updateBlockStatus, countUsers } from "../controllers/users.js";
import { createProduct, getAllProducts, getProductById, toggleStatus , updateProduct, upload } from "../controllers/products.js";
import { createCategory, getAllCategories, updateCategory, deleteOrRestoreCategory } from "../controllers/categories.js";
import { createBrand, getAllBrands, updateBrand, deleteOrRestoreBrand } from "../controllers/brands.js";
import { countOrders, getAllOrders, updateOrderStatus, updateProductStatus } from "../controllers/order.js";
import { addCoupon, getCoupons, updateCoupon, deleteOrRestoreCoupon } from "../controllers/coupon.js";
import { addOffer, getOffers, updateOffer, deleteOrRestoreOffer, getCategoriesAndProductsList, applyOffer, removeOffer } from "../controllers/offers.js";
import { generateSalesReport,downloadReport } from "../controllers/sales.js";


// Auth
router.post("/auth/login", adminLogin);
router.post("/auth/refresh-token", refreshToken);
router.post('/auth/validate-token', authenticateJWT)


// Users
router.get("/users", isAdmin, getAllUsers);
router.patch("/users/changeStatus/:userId", isAdmin, updateBlockStatus);
router.get("/users/count", isAdmin, countUsers);


// Products
router.get('/products', isAdmin, getAllProducts);
router.post('/products', isAdmin, upload.array('images'), (req, res) => {
  console.log(req.files);
  if (req.files && req.files.length === 0) {
    return res.status(400).json({ message: "No valid files uploaded" });
  }
  createProduct(req, res);
});
router.get('/products/:id', isAdmin, getProductById);
router.patch('/products/toggleStatus/:id', isAdmin, toggleStatus);
router.put('/products/update/:id', isAdmin, upload.array('images'), (req, res) => {
  console.log(req.files);
  if (req.files && req.files.length === 0) {
    return res.status(400).json({ message: "No valid files uploaded" });
  }
  updateProduct(req,res)
});


// Categories
router.get("/categories", isAdmin, getAllCategories);
router.post("/categories/add", isAdmin, createCategory);
router.put("/categories/update/:id", isAdmin, updateCategory);
router.patch("/categories/:id", isAdmin, deleteOrRestoreCategory);


// Brands
router.get("/brands", isAdmin, getAllBrands);
router.post("/brands/add", isAdmin, createBrand);
router.put("/brands/update/:id", isAdmin, updateBrand);
router.patch("/brands/:id", isAdmin, deleteOrRestoreBrand);


// Orders
router.get("/orders/count", isAdmin, countOrders);
router.get("/orders", isAdmin, getAllOrders);
router.patch("/orders/:id", isAdmin, updateOrderStatus);
router.patch("/orders/product/:id", isAdmin, updateProductStatus);


// Coupons
router.get('/coupons', isAdmin, getCoupons)
router.post('/coupons', isAdmin, addCoupon)
router.put('/coupons/:id', isAdmin, updateCoupon)
router.patch('/coupons/:id', isAdmin, deleteOrRestoreCoupon)


// Offers
router.post('/offers', isAdmin, addOffer)
router.get('/offers', isAdmin, getOffers)
router.put('/offers/:id', isAdmin, updateOffer)
router.patch('/offers/:id', isAdmin, deleteOrRestoreOffer)
router.get('/offers/categories-and-products', isAdmin, getCategoriesAndProductsList)
router.post('/offers/apply' , isAdmin, applyOffer)
router.post('/offers/remove' , isAdmin, removeOffer)


// Sales Report
router.post('/sales/report', isAdmin, generateSalesReport)
router.post('/sales/download/:format', isAdmin, downloadReport)

export default router;


// salesData.forEach((order) => {
//   doc.text(
//     `${order.orderId}  
//      ${order.createdAt.toISOString().split('T')[0]} 
//      ${order.productDetails.length}   
//     ₹${order.productDetails.reduce((total, product) => total + product.regularPrice, 0)}  
//     ₹${order.productDetails.reduce((total, product) => total + (product.discountedPrice ? product.regularPrice - product.discountedPrice : 0), 0)
//       + (order.coupon ? order.coupon.discountType === 'percentage'? 
//          order.totalAmount * (order.coupon.discountValue / 100) : order.coupon.discountValue : 0)}  
//     ₹${order.totalAmount}`
//   );
// });