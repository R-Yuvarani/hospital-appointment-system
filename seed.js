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
      name: 'Alice Patient',
      email: 'patient@test.com',
      password: 'password123',
      role: 'patient',
      phone: '9876543210'
    },
    {
      name: 'Dr. Smith',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'General Physician',
      phone: '9876543211'
    },
    {
      name: 'Dr. Priya Sharma',
      email: 'priya@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Cardiologist',
      phone: '9876543212'
    },
    {
      name: 'Dr. Raj Kumar',
      email: 'raj@test.com',
      password: 'password123',
      role: 'doctor',
      specialization: 'Orthopedic Surgeon',
      phone: '9876543213'
    }
  ]);

  console.log(`✅ Created ${users.length} users`);
  console.log('\n📋 Test Login Credentials:');
  console.log('   Patient  → patient@test.com  / password123');
  console.log('   Doctor   → doctor@test.com   / password123');
  console.log('\n🚀 Now run: npm run dev');

  process.exit(0);
};

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
