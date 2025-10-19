const User = require('../models/User');

// @desc    Get all users with search and sort
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const filter = {};
    // Add search functionality for username
    if (req.query.search) {
      filter.username = { $regex: req.query.search, $options: 'i' };
    }

    let query = User.find(filter);

    // Add sorting functionality
    if (req.query.sort) {
      const sortBy = req.query.sort;

      // Special case for case-insensitive username sorting
      if (sortBy === 'username' || sortBy === '-username') {
        query = query.collation({ locale: 'en', strength: 2 });
      }
      
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }

    const users = await query;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a user (promote/demote admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isAdmin = req.body.isAdmin;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user._id.equals(req.user._id)) {
        return res.status(400).json({ message: 'Cannot delete your own admin account' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUsers, updateUser, deleteUser };