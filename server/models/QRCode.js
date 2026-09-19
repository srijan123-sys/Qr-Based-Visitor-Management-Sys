// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  📱 QRCode Model — Dynamic QR with Short ID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
  {
    // Short unique identifier (e.g., "aB3xK9") — used in scan URL
    qrId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // The actual destination URL the QR redirects to
    targetUrl: {
      type: String,
      required: [true, 'Target URL is required'],
      trim: true,
    },

    // Human-readable title for the dashboard
    title: {
      type: String,
      default: 'Untitled QR',
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // Type of QR content
    qrType: {
      type: String,
      enum: ['url', 'text', 'vcard'],
      default: 'url',
    },

    // The full dynamic scan URL (e.g., http://localhost:5000/api/qr/scan/aB3xK9)
    scanUrl: {
      type: String,
      required: true,
    },

    // Total scan count (denormalized for fast dashboard reads)
    totalScans: {
      type: Number,
      default: 0,
    },

    // Whether this QR is active (can be "paused")
    isActive: {
      type: Boolean,
      default: true,
    },

    // Owner reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QRCode', qrCodeSchema);
