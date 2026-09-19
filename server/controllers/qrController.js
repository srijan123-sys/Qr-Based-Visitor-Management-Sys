// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  📱 QR Controller — Generate, Scan/Redirect, Dashboard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { nanoid }      = require('nanoid');
const UAParser        = require('ua-parser-js');
const QRCode          = require('../models/QRCode');
const ScanAnalytics   = require('../models/ScanAnalytics');
const logger          = require('../utils/logger');

// ────────────────────────────────────────────────
//  POST /api/qr/generate
//  Creates a new dynamic QR code entry
// ────────────────────────────────────────────────
const generateQR = async (req, res) => {
  try {
    const { targetUrl, title, qrType } = req.body;

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Target URL is required',
      });
    }

    // Generate a short unique ID (8 characters)
    const qrId = nanoid(8);

    // Build the dynamic scan URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const scanUrl = `${baseUrl}/api/qr/scan/${qrId}`;

    // Create QR record in MongoDB
    const qrCode = await QRCode.create({
      qrId,
      targetUrl,
      title: title || 'Untitled QR',
      qrType: qrType || 'url',
      scanUrl,
      createdBy: req.user._id,
    });

    // ── Presentation Logs ──
    logger.qrGenerated(qrId, targetUrl);
    logger.dbSave('QRCodes', qrCode._id);
    logger.request('POST', '/api/qr/generate', 201);

    res.status(201).json({
      success: true,
      message: 'Dynamic QR code created successfully',
      data: {
        _id:        qrCode._id,
        qrId:       qrCode.qrId,
        targetUrl:  qrCode.targetUrl,
        title:      qrCode.title,
        qrType:     qrCode.qrType,
        scanUrl:    qrCode.scanUrl,
        totalScans: qrCode.totalScans,
        isActive:   qrCode.isActive,
        createdAt:  qrCode.createdAt,
      },
    });
  } catch (err) {
    logger.error('QR GENERATE', err);
    res.status(500).json({ success: false, message: 'Failed to generate QR code' });
  }
};

// ────────────────────────────────────────────────
//  GET /api/qr/scan/:qrId
//  The REDIRECT endpoint — logs scan FIRST, then redirects
// ────────────────────────────────────────────────
const scanQR = async (req, res) => {
  try {
    const { qrId } = req.params;

    // Find the QR code
    const qrCode = await QRCode.findOne({ qrId });

    if (!qrCode) {
      logger.error('QR SCAN', { message: `QR ID not found: ${qrId}` });
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
      });
    }

    if (!qrCode.isActive) {
      return res.status(410).json({
        success: false,
        message: 'This QR code has been deactivated',
      });
    }

    // ── Parse User-Agent ──
    const rawUA  = req.headers['user-agent'] || 'Unknown';
    const parser = new UAParser(rawUA);
    const result = parser.getResult();

    const deviceInfo = {
      browser:  result.browser.name  ? `${result.browser.name} ${result.browser.version || ''}`.trim() : 'Unknown',
      os:       result.os.name       ? `${result.os.name} ${result.os.version || ''}`.trim()           : 'Unknown',
      platform: result.device.type   || 'Desktop',
    };

    // ── Get IP Address ──
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
                    || req.connection?.remoteAddress
                    || req.socket?.remoteAddress
                    || '0.0.0.0';

    // ── STEP 1: Log scan data to database FIRST ──
    const scanEntry = await ScanAnalytics.create({
      qrCode:    qrCode._id,
      qrId:      qrCode.qrId,
      scannedAt: new Date(),
      userAgent: rawUA,
      device:    deviceInfo,
      ipAddress: ipAddress,
      referrer:  req.headers.referer || req.headers.referrer || 'Direct',
    });

    // ── STEP 2: Increment scan count on QR record ──
    qrCode.totalScans += 1;
    await qrCode.save();

    // ── STEP 3: MASSIVE terminal log ──
    logger.qrScanned(qrId, qrCode.targetUrl, rawUA, ipAddress);
    logger.dbSave('ScanAnalytics', scanEntry._id);

    // ── STEP 4: Redirect to the actual target URL ──
    return res.redirect(302, qrCode.targetUrl);
  } catch (err) {
    logger.error('QR SCAN / REDIRECT', err);
    res.status(500).json({ success: false, message: 'Scan processing failed' });
  }
};

// ────────────────────────────────────────────────
//  GET /api/qr/dashboard
//  Fetches all QR codes for the authenticated user
// ────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    // Fetch QRs owned by current user, newest first
    const qrCodes = await QRCode.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    logger.dashboardFetch(qrCodes.length);
    logger.request('GET', '/api/qr/dashboard', 200);

    res.status(200).json({
      success: true,
      count: qrCodes.length,
      data: qrCodes,
    });
  } catch (err) {
    logger.error('DASHBOARD', err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

// ────────────────────────────────────────────────
//  PUT /api/qr/update/:qrId
//  Update the target URL (dynamic QR — same image, new destination)
// ────────────────────────────────────────────────
const updateQR = async (req, res) => {
  try {
    const { qrId } = req.params;
    const { targetUrl, title, isActive } = req.body;

    const qrCode = await QRCode.findOne({ qrId, createdBy: req.user._id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found or not owned by you',
      });
    }

    // Update fields if provided
    if (targetUrl !== undefined) qrCode.targetUrl = targetUrl;
    if (title     !== undefined) qrCode.title     = title;
    if (isActive  !== undefined) qrCode.isActive  = isActive;

    await qrCode.save();

    logger.info(`QR ${qrId} updated → target: ${qrCode.targetUrl}`);
    logger.dbSave('QRCodes', qrCode._id);
    logger.request('PUT', `/api/qr/update/${qrId}`, 200);

    res.status(200).json({
      success: true,
      message: 'QR code updated successfully',
      data: qrCode,
    });
  } catch (err) {
    logger.error('QR UPDATE', err);
    res.status(500).json({ success: false, message: 'Failed to update QR code' });
  }
};

// ────────────────────────────────────────────────
//  DELETE /api/qr/delete/:qrId
//  Delete QR code and its scan analytics
// ────────────────────────────────────────────────
const deleteQR = async (req, res) => {
  try {
    const { qrId } = req.params;

    const qrCode = await QRCode.findOne({ qrId, createdBy: req.user._id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found or not owned by you',
      });
    }

    // Delete associated scan analytics
    await ScanAnalytics.deleteMany({ qrCode: qrCode._id });

    // Delete the QR code itself
    await QRCode.deleteOne({ _id: qrCode._id });

    logger.info(`QR ${qrId} DELETED along with all scan records`);
    logger.request('DELETE', `/api/qr/delete/${qrId}`, 200);

    res.status(200).json({
      success: true,
      message: 'QR code and associated analytics deleted',
    });
  } catch (err) {
    logger.error('QR DELETE', err);
    res.status(500).json({ success: false, message: 'Failed to delete QR code' });
  }
};

// ────────────────────────────────────────────────
//  GET /api/qr/analytics/:qrId
//  Detailed scan analytics for a specific QR
// ────────────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const { qrId } = req.params;

    // Verify ownership
    const qrCode = await QRCode.findOne({ qrId, createdBy: req.user._id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found or not owned by you',
      });
    }

    const scans = await ScanAnalytics.find({ qrCode: qrCode._id })
      .sort({ scannedAt: -1 })
      .lean();

    logger.request('GET', `/api/qr/analytics/${qrId}`, 200);

    res.status(200).json({
      success: true,
      qrId:       qrCode.qrId,
      title:      qrCode.title,
      targetUrl:  qrCode.targetUrl,
      totalScans: qrCode.totalScans,
      scans,
    });
  } catch (err) {
    logger.error('QR ANALYTICS', err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

module.exports = {
  generateQR,
  scanQR,
  getDashboard,
  updateQR,
  deleteQR,
  getAnalytics,
};
