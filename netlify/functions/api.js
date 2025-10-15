// Netlify Function untuk API routes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const gamesRouter = require('../../apps/api/dist/routes/games.js');
const leaderboardRouter = require('../../apps/api/dist/routes/leaderboard.js');
const feedRouter = require('../../apps/api/dist/routes/feed.js');
const authRouter = require('../../apps/api/dist/routes/auth.js');
const xpRouter = require('../../apps/api/dist/routes/xp.js');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/games', gamesRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/feed', feedRouter);
app.use('/auth', authRouter);
app.use('/xp', xpRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Netlify Function handler
exports.handler = async (event, context) => {
  // Connect to database if not connected
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  // Convert Netlify event to Express request format
  const request = {
    method: event.httpMethod,
    url: event.path.replace('/api', ''),
    headers: event.headers,
    body: event.body,
    query: event.queryStringParameters || {},
  };

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: '',
  };

  // Mock Express response object
  const res = {
    status: (code) => {
      response.statusCode = code;
      return res;
    },
    json: (data) => {
      response.body = JSON.stringify(data);
      response.headers['Content-Type'] = 'application/json';
      return res;
    },
    send: (data) => {
      response.body = data;
      return res;
    },
    setHeader: (key, value) => {
      response.headers[key] = value;
      return res;
    },
    end: () => res,
  };

  try {
    // Create a mock Express request object
    const req = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      query: request.query,
    };

    // Handle the request with Express app
    await new Promise((resolve, reject) => {
      const originalSend = res.send;
      const originalJson = res.json;
      
      res.send = function(data) {
        originalSend.call(this, data);
        resolve();
      };
      
      res.json = function(data) {
        originalJson.call(this, data);
        resolve();
      };

      // Simulate Express request handling
      app(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
