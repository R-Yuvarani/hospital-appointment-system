// server.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));

// Page Routes
app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, 'public/pages/login.html')));
app.get('/register',  (req, res) => res.sendFile(path.join(__dirname, 'public/pages/register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/dashboard.html')));
app.get('/book',      (req, res) => res.sendFile(path.join(__dirname, 'public/pages/book.html')));
app.get('/help',      (req, res) => res.sendFile(path.join(__dirname, 'public/pages/help.html')));
app.get('/',          (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Start server only when run directly (not via Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
