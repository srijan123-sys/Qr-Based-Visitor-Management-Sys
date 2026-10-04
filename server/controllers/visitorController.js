// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Visitor Controller — controllers/visitorController.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Visitor = require('../models/Visitor');
const logger = require('../utils/logger');

// ── Validation Helpers (Regex-based as sir suggested) ─────────
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// @desc    Register a new visitor (Check-in)
// @route   POST /api/visitors/checkin
// @access  Public
const registerVisitor = async (req, res) => {
  try {
    const { name, phone, email, purpose, hostName, receptionQrId, faceImage } = req.body;

    if (!name || !phone || !purpose || !hostName || !receptionQrId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // ── Phone Validation: exactly 10 numeric digits ───────
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ 
        message: 'Phone number must be exactly 10 numeric digits (no spaces, dashes, or country codes)' 
      });
    }

    // ── Email Validation (optional but must be valid if provided) ──
    if (email && email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address (e.g. user@example.com)' 
      });
    }

    const visitor = await Visitor.create({
      name: name.trim(),
      phone,
      email: email ? email.trim().toLowerCase() : '',
      purpose,
      hostName: hostName.trim(),
      receptionQrId,
      faceImage: faceImage || ''
    });

    logger.custom('VISITOR', `New Check-In: ${name} (Host: ${hostName})`, '\x1b[36m');
    if (faceImage) {
      logger.custom('FACE-ID', `📸 Face image captured for: ${name}`, '\x1b[35m');
    }

    res.status(201).json({
      success: true,
      data: visitor,
      ...visitor.toObject()
    });
  } catch (error) {
    logger.error('Check-in Error', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }

    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all visitors (Admin Dashboard)
// @route   GET /api/visitors
// @access  Private
const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ checkInTime: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    logger.error('Fetch Visitors Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check-out a visitor (Admin)
// @route   PUT /api/visitors/checkout/:id
// @access  Private
const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (visitor.status === 'Checked Out') {
      return res.status(400).json({ message: 'Visitor is already checked out' });
    }

    visitor.status = 'Checked Out';
    visitor.checkOutTime = Date.now();
    visitor.checkOutMethod = 'manual';
    
    await visitor.save();

    logger.custom('VISITOR', `Checked Out: ${visitor.name} (Manual)`, '\x1b[35m');

    res.status(200).json(visitor);
  } catch (error) {
    logger.error('Check-out Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Self-checkout by visitor (via QR scan page)
// @route   PUT /api/visitors/checkout-self/:id
// @access  Public
const selfCheckOut = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor record not found' });
    }

    if (visitor.status === 'Checked Out') {
      return res.status(400).json({ message: 'You have already been checked out' });
    }

    visitor.status = 'Checked Out';
    visitor.checkOutTime = Date.now();
    visitor.checkOutMethod = 'self';

    await visitor.save();

    logger.custom('VISITOR', `Self-Checkout: ${visitor.name} ✓`, '\x1b[33m');

    res.status(200).json({
      success: true,
      message: `${visitor.name}, you have been successfully checked out. Thank you for visiting!`,
      data: visitor
    });
  } catch (error) {
    logger.error('Self-Checkout Error', error);
    res.status(500).json({ message: 'Checkout failed. Please contact reception.' });
  }
};

// @desc    Auto-checkout all active visitors (called by cron at 5 PM)
// @access  Internal (server-side cron only)
const autoCheckOutAll = async () => {
  try {
    const activeVisitors = await Visitor.find({ status: 'Checked In' });

    if (activeVisitors.length === 0) {
      logger.custom('AUTO-CHECKOUT', '⏰ 5:00 PM — No active visitors to checkout', '\x1b[33m');
      return { count: 0 };
    }

    const now = new Date();
    let checkedOutCount = 0;

    for (const visitor of activeVisitors) {
      visitor.status = 'Checked Out';
      visitor.checkOutTime = now;
      visitor.checkOutMethod = 'auto';
      await visitor.save();
      checkedOutCount++;
    }

    logger.custom(
      'AUTO-CHECKOUT', 
      `⏰ 5:00 PM Office Closing — Auto-checked out ${checkedOutCount} visitor(s)`, 
      '\x1b[33m'
    );

    return { count: checkedOutCount };
  } catch (error) {
    logger.error('AUTO-CHECKOUT CRON', error);
    return { count: 0, error: error.message };
  }
};

module.exports = {
  registerVisitor,
  getVisitors,
  checkOutVisitor,
  selfCheckOut,
  autoCheckOutAll
};
