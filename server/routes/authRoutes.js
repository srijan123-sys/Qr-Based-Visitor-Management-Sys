// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔐 Auth Routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require('express');
const router  = express.Router();

const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');

// POST /api/auth/signup  — Register new user
router.post('/signup', signup);

// POST /api/auth/login   — Authenticate & get JWT
router.post('/login', login);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
