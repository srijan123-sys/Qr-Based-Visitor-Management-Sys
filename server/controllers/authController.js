// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔐 Auth Controller — Signup & Login
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');
const logger = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'qrpass_super_secret_jwt_token_key_2026';

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ────────────────────────────────────────────────
//  POST /api/auth/signup
// ────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
    // For demo purposes, we allow passing 'role' in request. In production, this should be restricted.
    const userRole = role && ['admin', 'receptionist'].includes(role) ? role : 'receptionist';
    const user = await User.create({ name, email, password, role: userRole });

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
        role:  user.role,
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
        role:  user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    logger.error('LOGIN', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ────────────────────────────────────────────────
//  POST /api/auth/forgotpassword
// ────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    // This points to the frontend React app
    const resetUrl = `${req.protocol}://${req.get('host').replace('5000', '5173')}/resetpassword/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the following link, or paste this into your browser to complete the process:
      
      ${resetUrl}
      
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
      // Print it to the terminal no matter what (Great for Demo/College Project)
      logger.custom('FORGOT PASSWORD', `\n\n======================================================\n🔑 PASSWORD RESET LINK GENERATED 🔑\nUser: ${user.email}\nLink: ${resetUrl}\n======================================================\n`, '\x1b[33m');

      // Attempt to send real email if credentials exist
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Request — QR-Pass',
          message,
        });
        return res.status(200).json({ success: true, message: 'Reset link sent to email (also in terminal)' });
      } else {
        // If no credentials, just pretend it succeeded (Demo mode)
        return res.status(200).json({ success: true, message: 'Demo Mode: Reset link printed in server terminal!' });
      }

    } catch (err) {
      // If email fails, STILL allow them to reset via the terminal link
      logger.error('EMAIL SEND FAILED', err);
      return res.status(200).json({ success: true, message: 'Email failed, but link is in terminal.' });
    }
  } catch (err) {
    logger.error('FORGOT PASSWORD', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ────────────────────────────────────────────────
//  PUT /api/auth/resetpassword/:resettoken
// ────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token or token has expired' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    logger.error('RESET PASSWORD', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };
