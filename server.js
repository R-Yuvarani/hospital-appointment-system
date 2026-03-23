// server.js
// This is the ENTRY POINT of our application
// Run this file with: node server.js

// Load environment variables from .env file FIRST
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');

// ─────────────────────────────────────────
// 1. Connect to MongoDB
// ─────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────
// 2. Create Express App
// ─────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────
// 3. Middleware (runs on EVERY request)
// ─────────────────────────────────────────

// Parse JSON bodies (so req.body works)
app.use(express.json());

// Parse HTML form submissions
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Session management - keeps user logged in
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours in milliseconds
  }
}));

// ─────────────────────────────────────────
// 4. API Routes
// ─────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));

// ─────────────────────────────────────────
// 5. Page Routes (serve HTML pages)
// ─────────────────────────────────────────

// All these routes send back the HTML pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/dashboard.html'));
});

app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/book.html'));
});

// Default route → homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ─────────────────────────────────────────
// 6. Start Server
// ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});
