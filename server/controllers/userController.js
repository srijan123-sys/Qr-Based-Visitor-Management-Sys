const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Fetch Users Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Prevent an admin from demoting themselves (optional safety net)
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own role from here.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    logger.custom('ADMIN', `Updated role of ${user.email} to ${role}`, '\x1b[35m');
    res.status(200).json({ success: true, message: `Role updated to ${role}`, data: user });
  } catch (error) {
    logger.error('Update Role Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Prevent an admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete yourself.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    logger.custom('ADMIN', `Deleted user ${user.email}`, '\x1b[31m');
    res.status(200).json({ success: true, message: 'User removed from system' });
  } catch (error) {
    logger.error('Delete User Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUsers, updateUserRole, deleteUser };
