// routes/appointments.js
// Handles: Book, View, Update, Cancel appointments

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// All routes below require the user to be logged in
router.use(protect);

// ─────────────────────────────────────────
// GET /api/appointments
// Get appointments for current user
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let query = {};

    // Patients see their own appointments
    // Doctors see appointments where they are the doctor
    if (req.session.userRole === 'patient') {
      query.patient = req.session.userId;
    } else if (req.session.userRole === 'doctor') {
      query.doctor = req.session.userId;
    }
    // Admins see all appointments (empty query = all)

    // .populate() replaces the ID with the actual user data
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')   // get patient's name, email, phone
      .populate('doctor', 'name specialization') // get doctor's name, specialization
      .sort({ date: -1 }); // newest first

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// ─────────────────────────────────────────
// POST /api/appointments
// Book a new appointment (patients only)
// ─────────────────────────────────────────
router.post('/', authorize('patient', 'admin'), async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    // Check if that time slot is already booked
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' } // $ne means "not equal"
    });

    if (existing) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.session.userId,
      doctor: doctorId,
      date,
      timeSlot,
      reason
    });

    // Populate so we return full data
    await appointment.populate('doctor', 'name specialization');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// ─────────────────────────────────────────
// PUT /api/appointments/:id
// Reschedule an appointment
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the patient who booked it can reschedule
    if (appointment.patient.toString() !== req.session.userId.toString()
      && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can't reschedule a cancelled appointment
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot reschedule a cancelled appointment' });
    }

    const { date, timeSlot, reason } = req.body;

    // Check if new slot is available
    if (date || timeSlot) {
      const newDate = date || appointment.date;
      const newSlot = timeSlot || appointment.timeSlot;

      const conflict = await Appointment.findOne({
        doctor: appointment.doctor,
        date: newDate,
        timeSlot: newSlot,
        status: { $ne: 'cancelled' },
        _id: { $ne: appointment._id } // exclude current appointment
      });

      if (conflict) {
        return res.status(400).json({ message: 'This time slot is already booked' });
      }
    }

    // Update only the fields that were sent
    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (reason) appointment.reason = reason;

    await appointment.save();

    res.json({ message: 'Appointment updated successfully', appointment });

  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/appointments/:id
// Cancel an appointment
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership
    if (appointment.patient.toString() !== req.session.userId.toString()
      && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

// ─────────────────────────────────────────
// GET /api/appointments/doctors
// Get list of all doctors
// ─────────────────────────────────────────
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialization email phone'); // only return these fields

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// ─────────────────────────────────────────
// GET /api/appointments/slots/:doctorId/:date
// Get available time slots for a doctor on a date
// ─────────────────────────────────────────
router.get('/slots/:doctorId/:date', async (req, res) => {
  try {
    // All possible time slots
    const allSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    // Find booked slots for this doctor on this date
    const booked = await Appointment.find({
      doctor: req.params.doctorId,
      date: req.params.date,
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    const bookedSlots = booked.map(a => a.timeSlot);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots, bookedSlots });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots' });
  }
});

// ─────────────────────────────────────────
// PUT /api/appointments/:id/status
// Update appointment status (doctors/admin)
// ─────────────────────────────────────────
router.put('/:id/status', authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // return the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;
