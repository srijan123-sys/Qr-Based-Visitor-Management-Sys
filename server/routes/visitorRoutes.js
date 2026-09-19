// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Visitor Routes — routes/visitorRoutes.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors, checkOutVisitor } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

// Public route for visitors scanning the QR code
router.post('/checkin', registerVisitor);

// Protected routes for the Admin Dashboard
router.get('/', protect, getVisitors);
router.put('/checkout/:id', protect, checkOutVisitor);

module.exports = router;
