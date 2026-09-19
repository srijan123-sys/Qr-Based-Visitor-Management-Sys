const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  hostName: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Checked In', 'Checked Out'],
    default: 'Checked In'
  },
  receptionQrId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
