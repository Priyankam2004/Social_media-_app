# SocialApp — MERN + Redux

A full-stack social media app with posts, likes, comments, and profile editing.

---

## Prerequisites
- Node.js (v16+)
- MongoDB running locally (`mongod`)

---

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
# Edit .env if needed (default: mongodb://localhost:27017/socialapp)
npm run dev
```
Backend runs at: http://localhost:5000

### 2. Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

---

## Features
- Register & Login with JWT auth
- Navbar with profile avatar (click to edit profile)
- Edit profile: name, bio, profile photo
- Create posts with caption and/or image
- Feed showing all posts (newest first)
- Like / Unlike posts
- Add and delete comments
- Delete your own posts
- Post owners can delete any comment on their post

---

## Project Structure
```
socialapp/
├── backend/
│   ├── config/multer.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── uploads/          ← auto-created on first upload
│   ├── .env
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── redux/
        │   ├── store.js
        │   └── slices/
        ├── App.js
        └── index.js
```
