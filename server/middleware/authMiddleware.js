// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔒 JWT Auth Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.error('AUTH MIDDLEWARE', { message: 'No token provided — access denied' });
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'qrpass_super_secret_jwt_token_key_2026';
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      logger.error('AUTH MIDDLEWARE', { message: 'User not found for token' });
      return res.status(401).json({
        success: false,
        message: 'Not authorized — user not found',
      });
    }

    next();
  } catch (err) {
    logger.error('AUTH MIDDLEWARE', err);
    return res.status(401).json({
      success: false,
      message: 'Not authorized — token invalid or expired',
    });
  }
};

module.exports = { protect };
