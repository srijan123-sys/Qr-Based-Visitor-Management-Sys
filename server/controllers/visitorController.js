// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Visitor Controller — controllers/visitorController.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Visitor = require('../models/Visitor');
const logger = require('../utils/logger');

// @desc    Register a new visitor (Check-in)
// @route   POST /api/visitors/checkin
// @access  Public
const registerVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, hostName, receptionQrId } = req.body;

    if (!name || !phone || !purpose || !hostName || !receptionQrId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const visitor = await Visitor.create({
      name,
      phone,
      purpose,
      hostName,
      receptionQrId
    });

    logger.custom('VISITOR', `New Check-In: ${name} (Host: ${hostName})`, '\x1b[36m');

    res.status(201).json({
      success: true,
      data: visitor,
      ...visitor.toObject()
    });
  } catch (error) {
    logger.error('Check-in Error', error);
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

// @desc    Check-out a visitor
// @route   PUT /api/visitors/checkout/:id
// @access  Private
const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    visitor.status = 'Checked Out';
    visitor.checkOutTime = Date.now();
    
    await visitor.save();

    logger.custom('VISITOR', `Checked Out: ${visitor.name}`, '\x1b[35m');

    res.status(200).json(visitor);
  } catch (error) {
    logger.error('Check-out Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerVisitor,
  getVisitors,
  checkOutVisitor
};
