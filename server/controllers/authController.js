// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔐 Auth Controller — Signup & Login
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const logger = require('../utils/logger');

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ────────────────────────────────────────────────
//  POST /api/auth/signup
// ────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ name, email, password });

    logger.authSignup(email);
    logger.dbSave('Users', user._id);
    logger.request('POST', '/api/auth/signup', 201);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    logger.error('SIGNUP', err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// ────────────────────────────────────────────────
//  POST /api/auth/login
// ────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and explicitly include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    logger.authLogin(email);
    logger.request('POST', '/api/auth/login', 200);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    logger.error('LOGIN', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

module.exports = { signup, login };
