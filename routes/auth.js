// routes/auth.js
// Handles: Register, Login, Logout

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ─────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Create new user (password gets hashed automatically via pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'patient',
      specialization: role === 'doctor' ? specialization : ''
    });

    // 3. Save user info in session (so they stay logged in)
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    res.status(201).json({
      message: 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// Logs in an existing user
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Check password using our model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Save to session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/logout
// Clears the session
// ─────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

// GET /api/auth/me - Check who is currently logged in
router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      user: {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole
      }
    });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
