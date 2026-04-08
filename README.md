# UniPortal — University Information System

A full-stack university portal with React + Vite frontend and Node.js + Express + MongoDB backend.

## Project Structure

```
uniportal/
├── backend/
│   ├── config/           # DB connection
│   ├── controllers/      # Route logic
│   ├── middleware/        # Auth + role checks
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── .env              # Environment variables
│   ├── package.json
│   └── server.js         # Entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/          # Axios + API calls
    │   ├── assets/       # Static assets
    │   ├── components/   # Reusable components
    │   ├── context/      # AuthContext
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Routes
    │   ├── main.jsx      # Entry point
    │   └── index.css     # Global styles
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## Getting Started

### 1. Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```
Server runs at: http://localhost:5000

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173

## Demo Login
- **Admin:**   ID = `admin`   / Password = `admin123`
- **Student:** ID = `student` / Password = `student123`

## Features
- 📰 News & Announcements
- 🖼️ Gallery & Highlights
- 🏆 Upcoming Events with registration
- ⏱️ Real-time information display
- 💬 Chat assistant
- 👤 Admin Profile & Settings
- 🔐 JWT Authentication with role-based access
- 📝 Multi-step registration with full validation
