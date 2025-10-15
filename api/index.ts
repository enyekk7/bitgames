import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../src/db.js';
import gamesRouter from '../src/routes/games.js';
import leaderboardRouter from '../src/routes/leaderboard.js';
import feedRouter from '../src/routes/feed.js';
import authRouter from '../src/routes/auth.js';
import xpRouter from '../src/routes/xp.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gamesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/feed', feedRouter);
app.use('/api/auth', authRouter);
app.use('/api/xp', xpRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database connection
let isConnected = false;

async function ensureDBConnection() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

export default async function handler(req: any, res: any) {
  await ensureDBConnection();
  return app(req, res);
}
