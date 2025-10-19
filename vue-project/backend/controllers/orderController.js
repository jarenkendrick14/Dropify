const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (for customers)
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({ ...item, product: item._id })),
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    const user = await User.findById(req.user._id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(`Error creating order: ${error.message}`);
    res.status(500).json({ message: 'Server Error creating order' });
  }
};

// @desc    Get all orders with search and sort
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const filter = {};

    if (req.query.search) {
      const users = await User.find({ 
        username: { $regex: req.query.search, $options: 'i' } 
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      filter.user = { $in: userIds };
    }

    let query = Order.find(filter).populate('user', 'id username');

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const orders = await query;
    res.json(orders);
  } catch (error) {
    console.error(`Error getting all orders: ${error.message}`);
    res.status(500).json({ message: 'Server Error getting all orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(`Error updating status: ${error.message}`);
    res.status(500).json({ message: 'Server Error updating order status' });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(`Error deleting order: ${error.message}`);
    res.status(500).json({ message: 'Server Error deleting order' });
  }
};

module.exports = { 
  createOrder, 
  getAllOrders, 
  updateOrderStatus,
  deleteOrder
};