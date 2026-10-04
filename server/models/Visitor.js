const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 numeric digits'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    validate: {
      validator: function (v) {
        // Allow empty (optional field) or must match proper email regex
        if (!v || v === '') return true;
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  purpose: {
    type: String,
    required: true
  },
  hostName: {
    type: String,
    required: true
  },
  // Face image captured via device camera (stored as Base64 data URI)
  faceImage: {
    type: String,
    default: ''
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
  // Tracks how checkout happened
  checkOutMethod: {
    type: String,
    enum: ['manual', 'self', 'auto'],
    default: 'manual'
  },
  receptionQrId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
