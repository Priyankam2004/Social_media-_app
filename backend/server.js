const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Use public DNS servers for Atlas SRV resolution when the local resolver refuses SRV queries.
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://social-media-app-rosy-seven.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.send('Backend is running');
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    message: err.message || 'Server Error'
  });
});

// Debug Environment Variables
console.log('================================');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('================================');

// MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error('Please stop the existing process or set a different PORT in your .env file.');
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Full Error:', err);
  });