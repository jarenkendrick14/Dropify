const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/cart - Fetches the user's cart
router.get('/', protect, getCart);

// POST /api/cart - Adds a new item to the cart
router.post('/', protect, addToCart);

// PUT /api/cart - Updates an item's quantity in the cart
router.put('/', protect, updateCartItem);

// DELETE /api/cart - Clears the entire cart (for checkout)
router.delete('/', protect, clearCart);

// DELETE /api/cart/:productId - Removes a single item from the cart
router.delete('/:productId', protect, removeFromCart);

module.exports = router;