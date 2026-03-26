// seed.js
// Run this ONCE to insert test users into the database
// Command: node seed.js

require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedData = async () => {
  await connectDB();

  // Clear existing users
  await User.deleteMany({});
  console.log('🗑️  Cleared existing users');

  // Create test users
  const users = await User.create([
    {
      name: 'Hari Prasath A',
      email: 'hari09111999@gmail.com',
      password: 'password',
      role: 'patient',
      phone: '9043804079'
    },
    {
      name: 'Dr. Yuvarani R',
      email: 'yuvarani2906@gmail.com',
      password: 'password',
      role: 'doctor',
      specialization: 'General Physician',
      phone: '9876543211'
    },
    {
      name: 'Dr. Monisha',
      email: 'monisha@gmail.com',
      password: 'password',
      role: 'doctor',
      specialization: 'Cardiologist',
      phone: '9876543212'
    },
    {
      name: 'Dr. Roshan',
      email: 'roshan@gmail.com',
      password: 'password',
      role: 'doctor',
      specialization: 'Orthopedic Surgeon',
      phone: '9876543213'
    }
  ]);

  console.log(`✅ Created ${users.length} users`);
  console.log('\n📋 Test Login Credentials:');
  console.log('   Patient  → hari09111999@gmail.com  / password');
  console.log('   Doctor   → yuvarani2906@gmail.com   / password');
  console.log('\n🚀 Now run: npm run dev');

  process.exit(0);
};

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
