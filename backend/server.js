// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mediaProxy = require('./mediaProxy');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Media proxy routes
app.use('/api/media', mediaProxy);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Media server is running',
    timestamp: new Date().toISOString(),
    media: {
      videos: 10,
      englishAudio: 10,
      hindiAudio: 10
    }
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📺 Media proxy available at http://localhost:${PORT}/api/media`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Game ready at: http://localhost:5173`);
});