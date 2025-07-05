const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const redis = require('redis');
require('dotenv').config();

const WebSocketHandler = require('./websocket/handler');
const FormulaEngine = require('./engine/FormulaEngine');

const app = express();
const server = http.createServer(app);

// Redis client setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spreadsheet', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Spreadsheet API Server' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize WebSocket handler
const wsHandler = new WebSocketHandler(server, null, null);

const PORT = process.env.PORT || 3001;

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Redis connection
redisClient.connect().catch(console.error);

module.exports = app;