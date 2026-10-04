// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  📱 QR Routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require('express');
const router  = express.Router();

const {
  generateQR,
  scanQR,
  getDashboard,
  updateQR,
  deleteQR,
  getAnalytics,
} = require('../controllers/qrController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ── Public Route (no auth — anyone scanning a QR) ─────────
// GET /api/qr/scan/:qrId — Logs scan + Redirects
router.get('/scan/:qrId', scanQR);

// ── Protected Routes (JWT required + RBAC) ───────────────────────
// POST /api/qr/generate — Create new dynamic QR (Admin only)
router.post('/generate', protect, authorizeRoles('admin'), generateQR);

// GET  /api/qr/dashboard — Get all QRs (Admin & Receptionist)
router.get('/dashboard', protect, authorizeRoles('admin', 'receptionist'), getDashboard);

// PUT  /api/qr/update/:qrId — Update target URL or title (Admin only)
router.put('/update/:qrId', protect, authorizeRoles('admin'), updateQR);

// DELETE /api/qr/delete/:qrId — Delete QR and its analytics (Admin only)
router.delete('/delete/:qrId', protect, authorizeRoles('admin'), deleteQR);

// GET  /api/qr/analytics/:qrId — Detailed scan logs (Admin only)
router.get('/analytics/:qrId', protect, authorizeRoles('admin'), getAnalytics);

module.exports = router;
