// models/User.js
// This defines what a User looks like in our database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema = blueprint for a User document
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true // removes extra spaces
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // no two users can have the same email
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'], // only these 3 values allowed
    default: 'patient'
  },
  phone: {
    type: String,
    trim: true
  },
  // Only for doctors
  specialization: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// MIDDLEWARE: Hash password BEFORE saving to database
// This runs automatically before every .save()
userSchema.pre('save', async function (next) {
  // Only hash if password was changed
  if (!this.isModified('password')) return next();

  // bcrypt turns "mypassword123" into "$2b$10$xyz..." (unreadable)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// METHOD: Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
