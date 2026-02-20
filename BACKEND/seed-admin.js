const mongoose = require('mongoose');
const config = require('./config');
const { User } = require('./Schema');

const ADMIN_EMAIL = 'admin@complaintcare.com';
const ADMIN_PASSWORD = 'Admin@123';

mongoose.connect(config.mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('Admin already exists. Use these credentials to login:');
      console.log('  Email:', ADMIN_EMAIL);
      console.log('  Password:', ADMIN_PASSWORD);
      process.exit(0);
      return;
    }
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone: '0000000000',
      userType: 'admin'
    });
    console.log('Default admin created. Login with:');
    console.log('  Email:', ADMIN_EMAIL);
    console.log('  Password:', ADMIN_PASSWORD);
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
