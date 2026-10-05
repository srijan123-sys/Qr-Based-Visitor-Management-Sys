const nodemailer = require('nodemailer');
const twilio = require('twilio');
const logger = require('./logger');

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Setup Twilio Client
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendCheckInNotification = async (visitor) => {
  const message = `Hello ${visitor.name},\n\nYou have successfully checked in to Sigma University. Your host is @${visitor.hostName}.\n\nHave a great visit!`;

  // 1. Send Email if provided
  if (visitor.email && process.env.EMAIL_USER) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: visitor.email,
        subject: 'QR-Pass: Checked In Successfully',
        text: message,
      });
      logger.info(`Check-in email sent to ${visitor.email}`);
    } catch (err) {
      logger.error(`Failed to send email to ${visitor.email}: ${err.message}`);
    }
  }

  // 2. Send WhatsApp if Twilio is configured
  if (visitor.phone && twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
    try {
      // In WhatsApp, the number must include the country code e.g. +91
      const formattedPhone = visitor.phone.startsWith('+') ? visitor.phone : `+91${visitor.phone}`;
      await twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${formattedPhone}`
      });
      logger.info(`Check-in WhatsApp sent to ${formattedPhone}`);
    } catch (err) {
      logger.error(`Failed to send WhatsApp to ${visitor.phone}: ${err.message}`);
    }
  }
};

const sendCheckOutNotification = async (visitor) => {
  const message = `Hello ${visitor.name},\n\nYou have successfully checked out of Sigma University.\n\nThank you for visiting!`;

  // 1. Send Email if provided
  if (visitor.email && process.env.EMAIL_USER) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: visitor.email,
        subject: 'QR-Pass: Checked Out Successfully',
        text: message,
      });
      logger.info(`Check-out email sent to ${visitor.email}`);
    } catch (err) {
      logger.error(`Failed to send email to ${visitor.email}: ${err.message}`);
    }
  }

  // 2. Send WhatsApp if Twilio is configured
  if (visitor.phone && twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
    try {
      const formattedPhone = visitor.phone.startsWith('+') ? visitor.phone : `+91${visitor.phone}`;
      await twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${formattedPhone}`
      });
      logger.info(`Check-out WhatsApp sent to ${formattedPhone}`);
    } catch (err) {
      logger.error(`Failed to send WhatsApp to ${visitor.phone}: ${err.message}`);
    }
  }
};

module.exports = {
  sendCheckInNotification,
  sendCheckOutNotification
};
