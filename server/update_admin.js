const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://admin:admin123@ac-66ve7pr-shard-00-00.jqt9azh.mongodb.net:27017,ac-66ve7pr-shard-00-01.jqt9azh.mongodb.net:27017,ac-66ve7pr-shard-00-02.jqt9azh.mongodb.net:27017/qr_management?ssl=true&replicaSet=atlas-rmj7un-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  const res = await User.updateMany({ email: 'thewisdom620@gmail.com' }, { $set: { role: 'admin' } });
  console.log('Updated:', res);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
