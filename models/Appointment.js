// models/Appointment.js
// This defines what an Appointment looks like in our database

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // ref: 'User' links this to the User model (like a foreign key)
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // stored as "YYYY-MM-DD"
    required: [true, 'Appointment date is required']
  },
  timeSlot: {
    type: String, // e.g. "09:00 AM"
    required: [true, 'Time slot is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  reason: {
    type: String,
    trim: true,
    default: 'General Consultation'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
