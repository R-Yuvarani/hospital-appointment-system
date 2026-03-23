// config/db.js
// This file connects our app to MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect using the URL from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
