// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🗄️ MongoDB Connection — config/db.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.dbConnect(conn.connection.name);
  } catch (err) {
    logger.dbError(err);
    process.exit(1);
  }
};

module.exports = connectDB;
