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

const { protect } = require('../middleware/authMiddleware');

// ── Public Route (no auth — anyone scanning a QR) ─────────
// GET /api/qr/scan/:qrId — Logs scan + Redirects
router.get('/scan/:qrId', scanQR);

// ── Protected Routes (JWT required) ───────────────────────
// POST /api/qr/generate — Create new dynamic QR
router.post('/generate', protect, generateQR);

// GET  /api/qr/dashboard — Get all QRs for authenticated user
router.get('/dashboard', protect, getDashboard);

// PUT  /api/qr/update/:qrId — Update target URL or title
router.put('/update/:qrId', protect, updateQR);

// DELETE /api/qr/delete/:qrId — Delete QR and its analytics
router.delete('/delete/:qrId', protect, deleteQR);

// GET  /api/qr/analytics/:qrId — Detailed scan logs
router.get('/analytics/:qrId', protect, getAnalytics);

module.exports = router;
