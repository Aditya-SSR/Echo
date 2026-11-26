# Echo

> **A modern, full-stack social media platform.**

Echo is a full-stack social media application focused on simplicity, performance, and scalability. Built from the ground up using the MERN ecosystem and Next.js, it provides secure authentication, global messaging, role-based authorization, and a clean, distraction-free user experience.


###  Live Demo

**https://echo-frontend-69m5.onrender.com**

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios
* Socket.IO Client
* JWT Decode

## Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* Passport.js
* Passport Google OAuth 2.0
* bcrypt
* dotenv

---

# Features

## Authentication

* Email & Password Registration
* Secure Login
* JWT Authentication
* Google OAuth 2.0 Sign-In
* Protected Routes
* Persistent User Sessions

## Messaging

* Create Posts
* Global Feed
* Delete Your Own Posts
* User Information Displayed with Every Post
* RESTful API Integration

## Real-time (WebSockets)

* New posts, likes and deletions appear instantly for everyone (Socket.IO, no polling)
* Live "is typing" indicator
* Automatically reconnects and catches up if the connection drops

## Interactions

* Like & Unlike Posts
* Duplicate Like Prevention
* Instant UI Updates

## Authorization

* Role-Based Access Control
* Users Can Delete Only Their Own Posts
* Elevated Admin Privileges

## User Experience

* Responsive Design
* Neo-Brutalist Interface
* Fast Client-Side Navigation
* Clean Typography
* Minimalist Layout
* Optimized API Requests

---

# Running Locally

```bash
# 1. Backend
cd server
cp .env.example .env        # then fill in MONGODB_URL and JWT_SECRET
npm install
npm run dev                 # http://localhost:8000

# 2. Frontend (new terminal)
cd client
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev                 # http://localhost:3000
```

Google sign-in is optional locally - leave `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` empty and email sign-in still works.

## Deployment (Render)

| Service  | Root dir | Build          | Start           | Environment variables |
|----------|----------|----------------|-----------------|-----------------------|
| Backend  | `server` | `npm install`  | `npm start`     | `MONGODB_URL`, `JWT_SECRET`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Frontend | `client` | `npm install && npm run build` | `npm start` | `NEXT_PUBLIC_API_URL` (the backend URL) |

`NEXT_PUBLIC_API_URL` is baked in at build time, so redeploy the frontend after changing it.
On MongoDB Atlas, Network Access must allow Render (`0.0.0.0/0`), and a free (M0) cluster pauses after a long idle period - resume it from the Atlas dashboard.

---

### Echo by LYNX
