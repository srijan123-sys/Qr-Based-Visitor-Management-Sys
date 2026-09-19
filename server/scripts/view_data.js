// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Quick Script to view live MongoDB Atlas data
//  Run with: node scripts/view_data.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Visitor = require('../models/Visitor');
const User = require('../models/User');

async function showData() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔ Connected to database: qr_management\n');

    console.log('====================================');
    console.log('   COLLECTION: visitors');
    console.log('====================================');
    const visitors = await Visitor.find().lean();
    if (visitors.length === 0) {
      console.log('No visitors recorded yet.');
    } else {
      console.table(visitors.map(v => ({
        Name: v.name,
        Phone: v.phone,
        Host: v.hostName,
        Purpose: v.purpose,
        Status: v.status,
        CheckIn: new Date(v.checkInTime).toLocaleString(),
        Exit: v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : 'Active'
      })));
    }

    console.log('\n====================================');
    console.log('   COLLECTION: users (Admin Accounts)');
    console.log('====================================');
    const users = await User.find().select('-password').lean();
    console.table(users.map(u => ({
      ID: u._id.toString(),
      Name: u.name,
      Email: u.email,
      Joined: new Date(u.createdAt).toLocaleDateString()
    })));

    console.log('\nData fetch completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error fetching data:', err);
    process.exit(1);
  }
}

showData();
