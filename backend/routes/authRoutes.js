import express from 'express';
import cors from 'cors';
import { loginUser, registerUser, test, getProfile, getUserData, getAdmin, authenticate, authorize } from '../controllers/authController.js';
import { getAllUsers, updateProfile, userLogout } from '../controllers/userController.js';
import { analyzeData } from '../controllers/recommenderController.js';
import { getAllMarketers, getMarketer, registerMarketer } from '../controllers/marketerController.js';
import { getAllWholesalers, getWholeSaler, registerWholesaler } from '../controllers/wholesalerController.js';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { OrderData ,userOrders, getOrderData, getUserOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getAllTelecallerOrders, getAllUserOrders, getAllWholesalerOrders, getDefaultDashboardData } from '../controllers/adminController.js';
import { getProducts, updateProduct } from '../controllers/productController.js';
import { telecallerOrders } from '../controllers/telecallerController.js';

const router = express.Router();

//middleware

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
)


// auth
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', userLogout);
router.get('/profile', authenticate ,getProfile);
router.put('/profile', authenticate ,updateProfile)


// recommender
router.get('/getuserdata', getUserData);

router.post("/analyzeData", analyzeData);

// product
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);

// telecaller orders
router.post('/telecaller-orders', telecallerOrders);

// orders
router.post('/orders', authenticate, authorize(['user', 'wholesaler']),OrderData);
router.get("/user-orders", authenticate, authorize(['user', 'wholesaler']),userOrders);
router.get('/track/:orderId', authenticate, authorize(['user', 'wholesaler']),getOrderData);
router.get('/history/:id', authenticate, authorize(['user', 'wholesaler']),getUserOrders);
router.patch('/orders/update-status', authenticate, authorize(['admin']),updateOrderStatus);

// marketers
router.post('/marketer', authenticate, authorize(['admin']),registerMarketer);
router.get('/marketer/:id', authenticate, authorize(['marketer']),getMarketer);
router.get('/marketer/:id/wholesaler', authenticate, authorize(['marketer']),getWholeSaler);

// wholesaler
router.post('/wholesaler', authenticate, authorize(['marketer']),registerWholesaler);

// admin
router.get('/all/users', authenticate, authorize(['admin']),getAllUsers);
router.get('/all/marketers', authenticate, authorize(['admin']),getAllMarketers);
router.get('/all/wholesalers', authenticate, authorize(['admin']),getAllWholesalers);
router.get('/admin/profile', authenticate, authorize(['admin']),getAdmin);
router.get('/admin/user-orders', authenticate, authorize(['admin']),getAllUserOrders);
router.get('/admin/wholesaler-orders', authenticate, authorize(['admin']),getAllWholesalerOrders);
router.get('/admin/telecaller-orders', authenticate, authorize(['admin']),getAllTelecallerOrders);
router.get('/admin/default-analytics', authenticate, authorize(['admin']), getDefaultDashboardData );

// payment 
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;