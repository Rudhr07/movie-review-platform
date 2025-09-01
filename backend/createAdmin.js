const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/moviereview');
    
    // Check if admin already exists
  // Find by either legacy role field (if present) or isAdmin flag
  const existingAdmin = await User.findOne({ $or: [{ isAdmin: true }, { role: 'admin' }] });
    
    if (existingAdmin) {
      console.log('🎬 Admin user already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
    } else {
      // Create new admin user (let pre-save hook hash password once)
      const admin = new User({
        username: 'movieadmin',
        email: 'admin@movieplatform.com',
        password: 'AdminPass2024',
        isAdmin: true
      });
      
      await admin.save();
      console.log('🎬 Admin user created successfully!');
  console.log('Username: movieadmin');
  console.log('Password: AdminPass2024');
  console.log('Email: admin@movieplatform.com');
  console.log('NOTE: Change this password in production.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
