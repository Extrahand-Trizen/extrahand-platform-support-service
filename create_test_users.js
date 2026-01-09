/**
 * Create test users in MongoDB for SupportServerBackend
 * Run with: cd SupportServerBackend && node create_test_users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/extrahand-support';

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
  role: { type: String, default: 'user' },
  status: { type: String, default: 'APPROVED' },
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createTestUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'Admin123!',
        role: 'admin',
        status: 'APPROVED'
      },
      {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'User123!',
        role: 'user',
        status: 'APPROVED'
      },
      {
        name: 'Jay',
        email: 'jay@gmail.com',
        password: 'Jay123!',
        role: 'user',
        status: 'APPROVED'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        continue;
      }

      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash: passwordHash,
        role: userData.role,
        status: userData.status,
        emailVerified: true
      });

      console.log(`✅ Created user: ${user.email} (Password: ${userData.password})`);
    }

    console.log('\n✅ All test users created successfully!');
    console.log('\nYou can now login with:');
    console.log('- admin@gmail.com / Admin123!');
    console.log('- user@gmail.com / User123!');
    console.log('- jay@gmail.com / Jay123!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

createTestUsers();
