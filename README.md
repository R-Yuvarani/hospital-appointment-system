# 🏥 MediBook — Hospital Appointment System

A beginner-friendly, full-stack web application for booking hospital appointments online.
Built with **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JavaScript**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Step-by-Step Installation](#step-by-step-installation)
5. [Running the Project](#running-the-project)
6. [How the Code Works](#how-the-code-works)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Deploying for Free](#deploying-for-free)
9. [Common Errors & Fixes](#common-errors--fixes)

---

## Project Overview

**Problem:** Patients waste hours waiting in hospitals just to book appointments manually.

**Solution:** An online platform where:
- 🧑‍⚕️ **Patients** register, browse doctors, pick a time slot, and book appointments
- 👨‍⚕️ **Doctors** view their schedule and manage appointment statuses
- 🔐 Sessions keep users securely logged in

### Features
| Feature | Description |
|---|---|
| Register / Login | Secure accounts with hashed passwords |
| Book Appointment | Pick doctor, date, and available time slot |
| Reschedule | Change date/time of existing appointment |
| Cancel | Mark appointment as cancelled |
| Dashboard | View all appointments with live status |
| Role-based access | Patients and doctors see different views |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Simple, no framework needed |
| Backend | Node.js + Express | Fast, beginner-friendly server |
| Database | MongoDB + Mongoose | Flexible, JSON-like data |
| Auth | express-session + bcryptjs | Session login, encrypted passwords |
| Deploy | Render.com (free) + MongoDB Atlas (free) | No credit card needed |

---

## Folder Structure

```
hospital-appointment-system/
│
├── server.js              ← Entry point. Run this to start the app
├── package.json           ← Lists all dependencies
├── .env                   ← Secret config (never commit this!)
├── .env.example           ← Template for .env
├── .gitignore             ← Files Git should ignore
│
├── config/
│   └── db.js              ← MongoDB connection setup
│
├── models/
│   ├── User.js            ← User schema (patient / doctor)
│   └── Appointment.js     ← Appointment schema
│
├── routes/
│   ├── auth.js            ← Register, Login, Logout APIs
│   └── appointments.js    ← Book, View, Update, Cancel APIs
│
├── middleware/
│   └── auth.js            ← Protect routes (must be logged in)
│
└── public/                ← All frontend files (served as-is)
    ├── index.html         ← Homepage
    ├── css/
    │   └── style.css      ← All styling
    ├── js/
    │   └── app.js         ← Shared JS utilities
    └── pages/
        ├── login.html     ← Login page
        ├── register.html  ← Register page
        ├── dashboard.html ← User dashboard
        └── book.html      ← Book appointment page
```

---

## Step-by-Step Installation

Follow every step in order. Do not skip any step.

---

### STEP 1 — Install Node.js

Node.js lets you run JavaScript on your computer (outside the browser).

1. Go to: https://nodejs.org
2. Download the **LTS version** (e.g. v20.x.x)
3. Run the installer. Click Next → Next → Install
4. **Verify it installed correctly:**

```bash
node --version
# Should print: v20.x.x

npm --version
# Should print: 10.x.x
```

> ⚠️ If you get "command not found", restart your terminal and try again.

---

### STEP 2 — Install MongoDB (Local)

MongoDB is the database that stores all your data.

#### Option A: Install Locally (for development)

1. Go to: https://www.mongodb.com/try/download/community
2. Select your OS → Download and install
3. Start MongoDB:

```bash
# On Mac/Linux:
mongod --dbpath ~/data/db

# On Windows (run as Administrator):
net start MongoDB
```

4. Verify MongoDB is running:

```bash
mongosh
# You should see a > prompt. Type exit to quit.
```

#### Option B: Use MongoDB Atlas (Free Cloud — Recommended for beginners)

1. Go to: https://www.mongodb.com/atlas
2. Click **Try Free** → Create account
3. Create a **Free Cluster** (M0 Sandbox)
4. Click **Connect** → **Connect your application**
5. Copy the connection string — it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hospital_db
   ```
6. Use this as your `MONGODB_URI` in the `.env` file (Step 5)

---

### STEP 3 — Install Git

Git tracks your code changes and lets you push to GitHub for deployment.

1. Go to: https://git-scm.com/downloads
2. Download and install for your OS
3. Verify:

```bash
git --version
# Should print: git version 2.x.x
```

4. Set up your identity (one-time):

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

### STEP 4 — Download the Project

```bash
# Clone from GitHub (after you push it there)
git clone https://github.com/YOUR_USERNAME/hospital-appointment-system.git

# Go into the project folder
cd hospital-appointment-system

# Install all Node.js packages listed in package.json
npm install
```

> `npm install` reads `package.json` and downloads Express, Mongoose, etc. into `node_modules/`.

---

### STEP 5 — Create Your .env File

The `.env` file holds secret configuration. It is **never** pushed to GitHub.

```bash
# Copy the template
cp .env.example .env
```

Now open `.env` in any text editor and fill it in:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hospital_db
SESSION_SECRET=change-this-to-any-long-random-string-abc123xyz
NODE_ENV=development
```

> For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string from Step 2.

---

### STEP 6 — Add Sample Data (Optional but Recommended)

Create a file called `seed.js` in the project root:

```javascript
// seed.js — Run once to add test data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

connectDB().then(async () => {
  await User.deleteMany({}); // clear existing users

  await User.create([
    { name: 'Alice Patient', email: 'patient@test.com', password: 'password123', role: 'patient', phone: '9876543210' },
    { name: 'Dr. Smith', email: 'doctor@test.com', password: 'password123', role: 'doctor', specialization: 'General Physician', phone: '9876543211' },
    { name: 'Dr. Priya', email: 'priya@test.com', password: 'password123', role: 'doctor', specialization: 'Cardiologist', phone: '9876543212' },
  ]);

  console.log('✅ Seed data inserted!');
  process.exit();
});
```

Run it once:

```bash
node seed.js
# Output: ✅ Seed data inserted!
```

---

## Running the Project

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Open your browser and go to: **http://localhost:3000**

You should see the MediBook homepage.

---

## How the Code Works

### Understanding the Request Flow

Every time a user does something (clicks a button, submits a form), this happens:

```
Browser                  Server (server.js)              Database (MongoDB)
   │                           │                               │
   │  POST /api/auth/login      │                               │
   │ ─────────────────────────► │                               │
   │                           │  User.findOne({ email })      │
   │                           │ ─────────────────────────────► │
   │                           │ ◄───────────────────────────── │
   │                           │  Check password hash          │
   │                           │  Save session                 │
   │ ◄───────────────────────── │                               │
   │  { user: { name, role } }  │                               │
```

### Key Concepts Explained

#### 1. Mongoose Schema (models/User.js)
A Schema is like a table definition. It says: "every User must have a name, email, password, and role."
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }
});
```

#### 2. Password Hashing
We never store plain passwords. bcryptjs converts "mypassword" → "$2b$10$xyz...abc" (unreadable).
```javascript
// Before saving, hash the password automatically
userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});
```

#### 3. Sessions
Sessions keep users logged in. After login, the server stores your userId in a session cookie.
```javascript
req.session.userId = user._id; // Save on login
// On next request, check: if (req.session.userId) { /* logged in */ }
```

#### 4. Middleware (middleware/auth.js)
Middleware runs before your route handler. The `protect` middleware blocks unauthenticated users.
```javascript
// Without middleware — anyone can access
app.get('/dashboard', (req, res) => { ... });

// With middleware — only logged-in users
app.get('/dashboard', protect, (req, res) => { ... });
```

#### 5. populate() — Joining Collections
MongoDB doesn't auto-join. We use `.populate()` to replace an ID with actual data.
```javascript
// Without populate: { patient: "64abc123...", doctor: "64xyz456..." }
// With populate:    { patient: { name: "Alice" }, doctor: { name: "Dr. Smith" } }
await Appointment.find().populate('patient', 'name').populate('doctor', 'name');
```

---

## API Endpoints Reference

### Auth Routes (`/api/auth`)

| Method | URL | What it does | Body required |
|--------|-----|--------------|---------------|
| POST | `/api/auth/register` | Create new account | `name, email, password, role` |
| POST | `/api/auth/login` | Login | `email, password` |
| POST | `/api/auth/logout` | Logout | None |
| GET | `/api/auth/me` | Get current user | None |

### Appointment Routes (`/api/appointments`) — All require login

| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/appointments` | Get my appointments |
| POST | `/api/appointments` | Book new appointment |
| PUT | `/api/appointments/:id` | Reschedule appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| GET | `/api/appointments/doctors` | List all doctors |
| GET | `/api/appointments/slots/:doctorId/:date` | Available slots |
| PUT | `/api/appointments/:id/status` | Update status (doctor only) |

### Testing with curl (optional)

```bash
# Register a patient
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","role":"patient"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

---

## Deploying for Free

Deploy your app so anyone in the world can access it.
We use **Render.com** (free hosting) + **MongoDB Atlas** (free database).

### STEP 1 — Push to GitHub

```bash
# Inside your project folder:
git init
git add .
git commit -m "Initial commit: Hospital Appointment System"

# Create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/hospital-appointment-system.git
git push -u origin main
```

### STEP 2 — Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/atlas → Sign up free
2. Create a **Free M0 cluster**
3. Under **Database Access** → Add a user with username + password
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all — for simplicity)
5. Click **Connect** → copy your connection string:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/hospital_db
   ```

### STEP 3 — Deploy on Render.com

1. Go to https://render.com → Sign up free (use GitHub login)
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Fill in settings:

| Setting | Value |
|---|---|
| Name | hospital-appointment-system |
| Environment | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |

5. Scroll to **Environment Variables** → Add:

```
MONGODB_URI = mongodb+srv://youruser:yourpass@cluster.mongodb.net/hospital_db
SESSION_SECRET = any-long-random-string-eg-abc123xyz789
NODE_ENV = production
PORT = 3000
```

6. Click **Create Web Service**

Render will build and deploy your app. After ~2 minutes, you'll get a URL like:
`https://hospital-appointment-system.onrender.com`

> ⚠️ Free Render apps "sleep" after 15 minutes of no traffic. The first request after sleep takes ~30 seconds to wake up. This is normal for free tier.

### STEP 4 — Re-deploy After Changes

```bash
git add .
git commit -m "Fix: updated dashboard layout"
git push
```

Render automatically re-deploys when you push to GitHub. 🎉

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Cannot find module 'express'` | `npm install` not run | Run `npm install` |
| `MongoDB connection error` | Wrong URI or MongoDB not started | Check `.env` MONGODB_URI; start `mongod` |
| `Port 3000 already in use` | Another process using port | Change PORT in `.env` to 3001 |
| `Cannot GET /dashboard` | File path wrong | Ensure `public/pages/dashboard.html` exists |
| `req.session undefined` | session middleware not set up | Check `server.js` for `app.use(session(...))` |
| Render: `Application error` | Missing env variables | Add all env vars in Render dashboard |

---

## Learning Checkpoints

After finishing this project, you should understand:

- [ ] What a REST API is and how HTTP methods (GET, POST, PUT, DELETE) work
- [ ] How Express routes and middleware work
- [ ] How MongoDB stores data as documents (JSON-like objects)
- [ ] Why we hash passwords and never store them in plain text
- [ ] How sessions keep users logged in
- [ ] How the frontend (fetch) talks to the backend (Express)
- [ ] How to deploy a Node.js app for free

---

## Next Steps to Improve This Project

Once you're comfortable, try adding:

1. **Email notifications** — Send confirmation email on booking (use Nodemailer)
2. **Admin panel** — A separate page for admins to manage all users
3. **Search & filter** — Filter appointments by date, doctor, or status
4. **JWT Authentication** — Replace sessions with JSON Web Tokens
5. **React frontend** — Rebuild the UI using React.js

---

*Built for learning full-stack web development. Feel free to fork and improve!*
