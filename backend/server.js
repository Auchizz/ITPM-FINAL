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
