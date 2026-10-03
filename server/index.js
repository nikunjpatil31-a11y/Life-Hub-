const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, getDBState } = require('./config/db');
const { authMiddleware } = require('./middleware/auth');
const apiRoutes = require('./routes/apiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// Initialize Database Connection (with auto-fallback to mock storage)
connectDB();

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'LifeHub Backend Server',
    database: getDBState()
  });
});

// Register API Routes
app.use('/api', authMiddleware, apiRoutes);

// Serve static frontend assets from client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for any frontend SPA route (prevents 'Cannot GET /')
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.message || err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Process safety
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 LifeHub App running at: http://localhost:${PORT}`);
  console.log(`⚡ Vite Dev Server running at: http://localhost:5173`);
  console.log(`💾 Database Status: ${getDBState().mode}`);
  console.log(`==================================================\n`);
});

