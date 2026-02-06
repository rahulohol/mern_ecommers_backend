// const express = require('express');
// const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder,fetchAllOrders } = require('../controller/Order');

// const router = express.Router();
// //  /orders is already added in base path
// router.post('/create', createOrder)
//       .get('/own/', fetchOrdersByUser)
//       .delete('/:id', deleteOrder)
//       .patch('/:id', updateOrder)
//       .get('/',fetchAllOrders)


// exports.router = router;




const express = require('express');
const { 
  createOrder, 
  fetchOrdersByUser, 
  deleteOrder, 
  updateOrder,
  fetchAllOrders,
  fetchOrderById,        // 🆕 New: Get single order for tracking
  addTrackingUpdate      // 🆕 New: Add tracking update
} = require('../controller/Order');

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================
// /orders is already added in base path

// Create new order
router.post('/create', createOrder);

// Get user's own orders
router.get('/own/', fetchOrdersByUser);

// Get single order by ID (for tracking page)
router.get('/:id', fetchOrderById);  // 🆕 New route

// ============================================
// ADMIN ROUTES
// Add authentication/authorization middleware as needed:
// router.patch('/:id', isAuth, isAdmin, updateOrder)
// ============================================

// Delete order (Admin)
router.delete('/:id', deleteOrder);

// Update order status (Admin) - Enhanced with tracking
router.patch('/:id', updateOrder);

// Add custom tracking update (Admin)
router.post('/:id/tracking', addTrackingUpdate);  // 🆕 New route

// Get all orders (Admin)
router.get('/', fetchAllOrders);

exports.router = router;