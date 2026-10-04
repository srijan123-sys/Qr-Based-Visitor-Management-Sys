// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Visitor Routes — routes/visitorRoutes.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors, checkOutVisitor, selfCheckOut } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (visitors scanning QR code — no auth needed)
router.post('/checkin', registerVisitor);
router.put('/checkout-self/:id', selfCheckOut);     // Visitor self-checkout

// Protected routes for the Admin Dashboard
router.get('/', protect, getVisitors);
router.put('/checkout/:id', protect, checkOutVisitor);

module.exports = router;
