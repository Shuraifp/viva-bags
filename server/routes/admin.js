import { Router } from "express";
const router = Router();
import { adminLogin} from "../controllers/auth.js";
import { refreshToken, authenticateJWT, isAdmin } from "../middlewares/verifyToken.js";
import { getAllUsers, updateBlockStatus, countUsers } from "../controllers/users.js";
import { createProduct, getAllProducts, getProductById, toggleStatus , updateProduct, upload , countProducts, countSoldProducts} from "../controllers/products.js";
import { createCategory, getAllCategories, updateCategory, deleteOrRestoreCategory, countCategories } from "../controllers/categories.js";
import { createBrand, getAllBrands, updateBrand, deleteOrRestoreBrand, countBrands } from "../controllers/brands.js";
import { countOrders, getAllOrders, updateOrderStatus, updateProductStatus, getPendingReturns, updateReturnStatus } from "../controllers/order.js";
import { addCoupon, getCoupons, updateCoupon, deleteOrRestoreCoupon } from "../controllers/coupon.js";
import { addOffer, getOffers, updateOffer, deleteOrRestoreOffer, getCategoriesAndProductsList, applyOffer, removeOffer } from "../controllers/offers.js";
import { generateSalesReport,downloadReport, getSalesData, getTopProductsandCategories } from "../controllers/sales.js";


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
router.get('/products/count', isAdmin, countProducts);
router.get('/products/:id', isAdmin, getProductById);
router.patch('/products/toggleStatus/:id', isAdmin, toggleStatus);
router.put('/products/update/:id', isAdmin, upload.array('images'), updateProduct);


// Categories
router.get("/categories", isAdmin, getAllCategories);
router.post("/categories/add", isAdmin, createCategory);
router.put("/categories/update/:id", isAdmin, updateCategory);
router.get("/categories/count", isAdmin, countCategories);
router.patch("/categories/:id", isAdmin, deleteOrRestoreCategory);


// Brands
router.get("/brands", isAdmin, getAllBrands);
router.post("/brands/add", isAdmin, createBrand);
router.put("/brands/update/:id", isAdmin, updateBrand);
router.get("/brands/count", isAdmin, countBrands);
router.patch("/brands/:id", isAdmin, deleteOrRestoreBrand);


// Orders
router.get("/orders/count", isAdmin, countOrders);
router.get("/orders", isAdmin, getAllOrders);
router.patch("/orders/:id", isAdmin, updateOrderStatus);
router.patch("/orders/product/:id", isAdmin, updateProductStatus);
router.get('/orders/return-requested', isAdmin, getPendingReturns);
router.patch('/orders/return/:id', isAdmin, updateReturnStatus)
router.get('/orders/sold-products', isAdmin, countSoldProducts)


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


// Sales Report && Dashboard
router.post('/sales/report', isAdmin, generateSalesReport)
router.post('/sales/download/:format', isAdmin, downloadReport)
router.get('/chart-data', isAdmin, getSalesData)
router.get('/topSellings', isAdmin, getTopProductsandCategories)


export default router;
