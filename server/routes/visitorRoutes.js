// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Visitor Routes — routes/visitorRoutes.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors, getMyVisitors, checkOutVisitor, selfCheckOut, deleteVisitor, editVisitor } = require('../controllers/visitorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes (visitors scanning QR code — no auth needed)
router.post('/checkin', registerVisitor);
router.put('/checkout-self/:id', selfCheckOut);     // Visitor self-checkout

// Protected routes for the Admin/Receptionist Dashboard
router.get('/', protect, authorizeRoles('admin', 'receptionist'), getVisitors);
router.get('/me', protect, getMyVisitors); // For personal users to see their own visits
router.put('/checkout/:id', protect, authorizeRoles('admin', 'receptionist'), checkOutVisitor);

// Admin only routes for managing visitor log
router.delete('/:id', protect, authorizeRoles('admin'), deleteVisitor);
router.put('/:id', protect, authorizeRoles('admin'), editVisitor);

module.exports = router;
