const User = require('../models/User');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (user) {
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart
// @access  Private
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity < 1) {
      user.cart = user.cart.filter(item => item.product.toString() !== productId);
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear all items from user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.cart = [];
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
};