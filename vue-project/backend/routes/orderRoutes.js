const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer and Admin routes on the base path
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

// Admin route to update order status
router.route('/:id/status').put(protect, admin, updateOrderStatus);

// Admin route to delete an order
router.route('/:id').delete(protect, admin, deleteOrder);

module.exports = router;