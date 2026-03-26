# 🏥 Hospital Appointment System

A full-stack web application for booking hospital appointments online.
Built with **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JavaScript** — deployed on **Vercel**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Local Installation](#local-installation)
5. [Running the Project](#running-the-project)
6. [How the Code Works](#how-the-code-works)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Deploying to Vercel](#deploying-to-vercel)
9. [Common Errors & Fixes](#common-errors--fixes)

---

## Project Overview

**Problem:** Patients waste hours waiting in hospitals just to book appointments manually.

**Solution:** An online platform where:
- 🧑‍⚕️ **Patients** register, browse doctors, pick a time slot, and book appointments
- 👨‍⚕️ **Doctors** review bookings and approve or reject them in real time
- 🔐 Sessions keep users securely logged in

### Features

| Feature | Description |
|---|---|
| Register / Login | Secure accounts with hashed passwords (bcrypt) |
| Book Appointment | Pick doctor, date, and available time slot |
| Doctor Approval | Doctors approve or reject pending appointments |
| Reschedule | Patients can change date/time of pending appointments |
| Cancel | Patients can cancel non-completed appointments |
| Dashboard | Role-aware view — patients see status; doctors see action buttons |
| Help Page | `/help` page with test credentials and role documentation |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Simple, no framework needed |
| Backend | Node.js + Express | Fast, beginner-friendly server |
| Database | MongoDB + Mongoose | Flexible, JSON-like data |
| Auth | express-session + bcryptjs | Session login, encrypted passwords |
| Deploy | **Vercel** (free) + MongoDB Atlas (free) | Zero config, GitHub integration |

---

## Folder Structure

```
hospital-appointment-system/
│
├── api/
│   └── index.js           ← Vercel serverless entry point
├── server.js              ← Local dev entry point
├── package.json           ← Lists all dependencies
├── vercel.json            ← Vercel routing config
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
    ├── index.html         ← Landing page
    ├── css/
    │   └── style.css      ← All styling
    ├── js/
    │   └── app.js         ← Shared JS utilities
    └── pages/
        ├── login.html     ← Login page
        ├── register.html  ← Register page
        ├── dashboard.html ← User dashboard
        ├── book.html      ← Book appointment page
        └── help.html      ← Help & test credentials
```

---

## Local Installation

Follow every step in order.

---

### STEP 1 — Install Node.js

1. Go to: https://nodejs.org
2. Download the **LTS version** (v20.x.x recommended)
3. Run the installer
4. Verify:

```bash
node --version   # v20.x.x
npm --version    # 10.x.x
```

---

### STEP 2 — Set Up MongoDB Atlas (Free Cloud DB)

Vercel is a serverless platform — it cannot run a local MongoDB. Use **MongoDB Atlas** (free forever).

1. Go to: https://www.mongodb.com/atlas → Sign up free
2. Create a **Free M0 cluster** (choose any region)
3. Under **Database Access** → Add a database user with username + password
4. Under **Network Access** → Add IP: `0.0.0.0/0` *(allows all IPs — required for Vercel)*
5. Click **Connect** → **Drivers** → Copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hospital_db?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your database user credentials.

---

### STEP 3 — Install Git

```bash
# Verify after install
git --version   # git version 2.x.x

# Set up your identity (one-time)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

### STEP 4 — Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/hospital-appointment-system.git
cd hospital-appointment-system
npm install
```

---

### STEP 5 — Create Your .env File

```bash
cp .env.example .env
```

Open `.env` and fill it in:

```env
PORT=3000
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.abc123.mongodb.net/hospital_db
SESSION_SECRET=change-this-to-any-long-random-string-abc123xyz
NODE_ENV=development
```

> ⚠️ Never commit `.env` to GitHub. It is already in `.gitignore`.

---

### STEP 6 — Seed Test Data

```bash
node seed.js
```

This creates 4 test accounts in your database:

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@test.com | password123 |
| Doctor | doctor@test.com | password123 |
| Doctor | priya@test.com | password123 |
| Doctor | raj@test.com | password123 |

> These credentials are also visible on the `/help` page of the running app.

---

## Running the Project

### Development Mode (auto-restart on file changes)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Open: **http://localhost:3000**

---

## How the Code Works

### Request Flow

```
Browser                  Express (server.js)             MongoDB Atlas
   │                           │                               │
   │  POST /api/auth/login      │                               │
   │ ─────────────────────────► │                               │
   │                           │  User.findOne({ email })      │
   │                           │ ─────────────────────────────► │
   │                           │ ◄───────────────────────────── │
   │                           │  bcrypt.compare(password)     │
   │                           │  req.session.userId = id      │
   │ ◄───────────────────────── │                               │
   │  { user: { name, role } }  │                               │
```

### Key Concepts

#### Mongoose Schema
Defines the shape of data in MongoDB (like a table schema in SQL).
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, enum: ['patient', 'doctor'] }
});
```

#### Password Hashing
Passwords are never stored as plain text. bcryptjs hashes them before saving.
```javascript
userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});
```

#### Sessions
Sessions persist login state. The session is stored in MongoDB via `connect-mongo`.
```javascript
req.session.userId = user._id;   // set on login
req.session.userRole = user.role;
// Subsequent requests: check req.session.userId to verify login
```

#### Middleware
`protect` blocks unauthenticated requests. `authorize(...roles)` restricts by role.
```javascript
// Only doctors can change appointment status
router.put('/:id/status', authorize('doctor', 'admin'), handler);
```

#### populate()
Replaces stored MongoDB ObjectIDs with the actual document data.
```javascript
// Without: { patient: "64abc...", doctor: "64xyz..." }
// With:    { patient: { name: "Alice" }, doctor: { name: "Dr. Smith" } }
await Appointment.find().populate('patient', 'name').populate('doctor', 'name');
```

---

## API Endpoints Reference

### Auth Routes (`/api/auth`)

| Method | URL | What it does | Body |
|--------|-----|--------------|------|
| POST | `/api/auth/register` | Create new account | `name, email, password, role` |
| POST | `/api/auth/login` | Login | `email, password` |
| POST | `/api/auth/logout` | Logout | — |
| GET | `/api/auth/me` | Get current logged-in user | — |

### Appointment Routes (`/api/appointments`) — Require login

| Method | URL | What it does | Who |
|--------|-----|--------------|-----|
| GET | `/api/appointments` | Get my appointments | All |
| POST | `/api/appointments` | Book new appointment | Patient |
| PUT | `/api/appointments/:id` | Reschedule | Patient |
| DELETE | `/api/appointments/:id` | Cancel | Patient |
| GET | `/api/appointments/doctors` | List all doctors | All |
| GET | `/api/appointments/slots/:doctorId/:date` | Available slots | All |
| PUT | `/api/appointments/:id/status` | Approve / Reject / Complete | **Doctor only** |

---

## Deploying to Vercel

Vercel is a serverless hosting platform — perfect for Node.js + Express apps. Deployment is free and connects directly to your GitHub repo.

> ✅ **Why Vercel over Render?**
> Vercel offers instant deploys, automatic HTTPS, zero cold-start on paid tier, a global CDN for static files, and a cleaner dashboard. For a Node.js Express app, Vercel works seamlessly with the `vercel.json` config below.

---

### STEP 1 — Prepare Your Project for Vercel

Vercel runs Node apps as serverless functions. Create an `api/` folder with an entry file:

```bash
mkdir api
```

Create `api/index.js`:

```javascript
// api/index.js — Vercel serverless entry point
const app = require('../server');
module.exports = app;
```

Update `server.js` — export the app instead of calling `app.listen` directly:

```javascript
// At the bottom of server.js, replace app.listen(...) with:
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
```

Create `vercel.json` in the project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },
    { "src": "/login",    "dest": "/api/index.js" },
    { "src": "/register", "dest": "/api/index.js" },
    { "src": "/dashboard","dest": "/api/index.js" },
    { "src": "/book",     "dest": "/api/index.js" },
    { "src": "/help",     "dest": "/api/index.js" },
    { "src": "/(.*)",     "dest": "/public/$1"    }
  ]
}
```

---

### STEP 2 — Push to GitHub

```bash
# Inside your project folder
git init
git add .
git commit -m "Initial commit: Hospital Appointment System"

# Create a new EMPTY repo at github.com (no README), then:
git remote add origin https://github.com/YOUR_USERNAME/hospital-appointment-system.git
git branch -M main
git push -u origin main
```

---

### STEP 3 — Set Up MongoDB Atlas for Production

Make sure you've already done Step 2 in the Installation section above.

**Important:** Under **Network Access** in Atlas, ensure `0.0.0.0/0` is added to the IP allowlist so Vercel's dynamic IPs can connect.

---

### STEP 4 — Deploy on Vercel

1. Go to **https://vercel.com** → Sign up free (use GitHub login for easiest setup)
2. Click **Add New** → **Project**
3. Click **Import** next to your `hospital-appointment-system` repository
4. Vercel auto-detects Node.js. Keep default settings.
5. Scroll to **Environment Variables** and add:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://youruser:yourpass@cluster.mongodb.net/hospital_db` |
   | `SESSION_SECRET` | `any-long-random-string-at-least-32-chars` |
   | `NODE_ENV` | `production` |

6. Click **Deploy**

Vercel will build and deploy in ~30 seconds. You'll get a URL like:
`https://hospital-appointment-system.vercel.app`

---

### STEP 5 — Seed Your Production Database

After deploying, run `seed.js` once pointing at your Atlas URI:

```bash
# Set the MONGODB_URI to your Atlas connection string in .env, then:
node seed.js
```

This inserts the test accounts into Atlas so you can log in on the live site.

---

### STEP 6 — Re-deploy After Changes

Every `git push` to your `main` branch triggers an automatic redeploy on Vercel. No manual steps needed.

```bash
git add .
git commit -m "Update: improved dashboard UI"
git push
# Vercel redeploys automatically in ~20 seconds ✅
```

---

### Vercel vs Render — Quick Comparison

| Feature | Vercel | Render |
|---|---|---|
| Free tier | ✅ Generous | ✅ Available |
| Cold start | ⚡ Fast (edge network) | 🐢 ~30s sleep on free tier |
| Deploy trigger | Push to GitHub | Push to GitHub |
| Static files | ✅ Global CDN | ✅ Served from server |
| Custom domains | ✅ Free | ✅ Free |
| Env variables | ✅ Dashboard UI | ✅ Dashboard UI |
| Node.js support | ✅ Serverless functions | ✅ Always-on process |

> Vercel is the recommended platform for this project because static assets are served from a global CDN and there's no sleep delay on the free tier.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Cannot find module 'express'` | `npm install` not run | Run `npm install` |
| `MongoServerError: bad auth` | Wrong Atlas username/password | Re-check MONGODB_URI in Vercel env vars |
| `MongoNetworkError: connect ECONNREFUSED` | IP not whitelisted in Atlas | Add `0.0.0.0/0` in Atlas → Network Access |
| `Port 3000 already in use` | Another process on port | Change PORT in `.env` to 3001 |
| Vercel: `404 on /dashboard` | Missing route in vercel.json | Ensure all page routes are listed in `vercel.json` routes |
| Vercel: `Function timeout` | Slow MongoDB cold connect | Add `?connectTimeoutMS=30000` to your Atlas URI |
| Sessions lost on Vercel | No persistent server between requests | Ensure `SESSION_SECRET` is set and `connect-mongo` is configured |
| `req.session undefined` | Session middleware not loaded | Check `server.js` — `app.use(session(...))` must come before routes |

---

## Learning Checkpoints

After finishing this project, you should understand:

- [ ] What a REST API is and how HTTP verbs (GET, POST, PUT, DELETE) map to actions
- [ ] How Express routing and middleware work
- [ ] How MongoDB stores JSON-like documents and how Mongoose schemas enforce structure
- [ ] Why passwords must be hashed and never stored plain
- [ ] How sessions keep users logged in across requests
- [ ] How the frontend `fetch()` API communicates with the backend
- [ ] How role-based access control works (patients vs doctors)
- [ ] How to configure and deploy a Node.js app on Vercel with environment variables

---

## Next Steps to Improve This Project

1. **Email notifications** — Send booking confirmation via Nodemailer + Gmail SMTP
2. **Admin panel** — Dedicated admin page to manage all users and appointments
3. **Search & filter** — Filter dashboard by date range, doctor name, or status
4. **JWT Authentication** — Replace sessions with stateless JSON Web Tokens (better for serverless)
5. **React frontend** — Rebuild the UI with React + React Router for a SPA experience
6. **Appointment reminders** — Scheduled cron jobs to notify patients 24h before

---

*Built for learning full-stack web development. Deployed on Vercel + MongoDB Atlas.*
