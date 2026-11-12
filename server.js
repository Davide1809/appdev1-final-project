const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set in the backend environment.');
}

const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    sameSite: process.env.SESSION_COOKIE_SAME_SITE || 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Inventory System API',
    status: 'running',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/admin'));

// 404 error handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    code: 404
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 500
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
