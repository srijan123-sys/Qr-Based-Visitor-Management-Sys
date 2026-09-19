// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  📊 ScanAnalytics Model — Every Scan Logged
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const mongoose = require('mongoose');

const scanAnalyticsSchema = new mongoose.Schema(
  {
    // Reference to the QR code that was scanned
    qrCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode',
      required: true,
      index: true,
    },

    // Short ID for quick lookups
    qrId: {
      type: String,
      required: true,
      index: true,
    },

    // Scan timestamp (auto from Mongoose timestamps, but explicit for analytics)
    scannedAt: {
      type: Date,
      default: Date.now,
    },

    // Raw user-agent string
    userAgent: {
      type: String,
      default: 'Unknown',
    },

    // Parsed device info (from ua-parser-js)
    device: {
      browser:  { type: String, default: 'Unknown' },
      os:       { type: String, default: 'Unknown' },
      platform: { type: String, default: 'Unknown' },
    },

    // IP address of the scanner
    ipAddress: {
      type: String,
      default: '0.0.0.0',
    },

    // Referrer URL (where the scan originated)
    referrer: {
      type: String,
      default: 'Direct',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ScanAnalytics', scanAnalyticsSchema);
