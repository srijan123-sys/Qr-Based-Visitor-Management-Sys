// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  ⚡  QR CODE MANAGEMENT SYSTEM — Express Server Entry Point
//
//  Features:
//  • Express REST API with CORS
//  • MongoDB via Mongoose
//  • JWT-based authentication
//  • Dynamic QR code generation & redirect
//  • Scan analytics logging
//  • Face capture for visitor identity
//  • Auto-checkout cron job at 5 PM (office closing)
//  • Colorful terminal output for live presentations
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const cron      = require('node-cron');
const connectDB = require('./config/db');
const logger    = require('./utils/logger');

// ── Load environment variables ────────────────────────────
dotenv.config();

// ── Initialize Express ────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────

// CORS — Allow frontend (Vite default port 5173) and any origin in dev
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies — increased limit to 50mb for face image Base64 data
app.use(express.json({ limit: '50mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Request Logger Middleware (logs every API hit) ─────────
app.use((req, res, next) => {
  // Skip logging for the scan route (it has its own massive logger)
  if (!req.path.includes('/api/qr/scan/')) {
    logger.request(req.method, req.path);
  }
  next();
});

// ── Routes ────────────────────────────────────────────────

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// QR routes
app.use('/api/qr', require('./routes/qrRoutes'));

// Visitor routes
app.use('/api/visitors', require('./routes/visitorRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QR Management System API is running',
    timestamp: new Date().toISOString(),
  });
});

const path = require('path');
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// ── SPA Fallback for Client Routing ───────────────────────
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ── 404 Handler for Unhandled API Routes ───────────────────
app.use((req, res) => {
  logger.error('404 NOT FOUND', { message: `${req.method} ${req.path}` });
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  logger.error('UNHANDLED ERROR', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ── Auto-Checkout Cron Job (5:00 PM Daily — Office Closing) ──
const { autoCheckOutAll } = require('./controllers/visitorController');

// Schedule: "0 17 * * *" = Every day at 5:00 PM server time
// If your server timezone differs from IST, adjust accordingly
cron.schedule('0 17 * * *', async () => {
  logger.custom('CRON', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '\x1b[33m');
  logger.custom('CRON', '⏰  5:00 PM — OFFICE CLOSING — Auto Checkout Triggered', '\x1b[33m');
  logger.custom('CRON', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '\x1b[33m');

  const result = await autoCheckOutAll();
  
  logger.custom('CRON', `Auto-checkout complete: ${result.count} visitor(s) checked out`, '\x1b[32m');
}, {
  timezone: 'Asia/Kolkata'  // IST timezone for 5 PM India time
});

// ── Start Server ──────────────────────────────────────────
const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  app.listen(PORT, () => {
    logger.serverStart(PORT);
    logger.custom('CRON', '⏰ Auto-checkout cron scheduled: Every day at 5:00 PM IST', '\x1b[33m');
  });
};

startServer();
