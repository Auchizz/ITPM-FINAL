<<<<<<< HEAD
// ══════════════════════════════════════════════
// UniPortal — server.js (Node.js + Express + MongoDB)
// ══════════════════════════════════════════════

const express   = require('express')
const mongoose  = require('mongoose')
const cors      = require('cors')
const helmet    = require('helmet')
const rateLimit = require('express-rate-limit')
const path      = require('path')
require('dotenv').config()

const app = express()

// ── Security ────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(rateLimit({ windowMs: 15*60*1000, max: 200,
  message: { success: false, message: 'Too many requests.' }
}))

// ── CORS ────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH']
}))

// ── Body Parsers ────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Static files (uploaded images) ──────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── MongoDB ─────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/uniportal')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message))

// ── Routes ──────────────────────────────────
app.use('/api/auth',          require('./routes/authRoutes'))
app.use('/api/users',         require('./routes/userRoutes'))
app.use('/api/events',        require('./routes/eventRoutes'))
app.use('/api/news',          require('./routes/newsRoutes'))
app.use('/api/announcements', require('./routes/announcementRoutes'))
app.use('/api/registrations', require('./routes/registrationRoutes'))
app.use('/api/gallery',       require('./routes/galleryRoutes'))
app.use('/api/stats',         require('./routes/statsRoutes'))

// ── Health check ────────────────────────────
app.get('/api/health', (_, res) => res.json({ success: true, message: 'UniPortal API running', timestamp: new Date() }))

// ── 404 ─────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// ── Error handler ───────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 UniPortal server → http://localhost:${PORT}`))
=======
require('dotenv').config();
const dns = require('node:dns');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/module', require('./routes/moduleRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));

// Simple root
app.get('/', (req, res) => res.json({ success: true, message: 'SportSphere User API' }));

async function startServer(port = process.env.PORT || 5000) {
  await connectDB();

  return new Promise((resolve) => {
    const server = app.listen(port, () => console.log(`Server running on port ${port}`));
    resolve(server);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
>>>>>>> origin/main
