import express from 'express';
import { Score } from '../models/Score.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get leaderboard for a game
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get top scores (best score per player)
    const topScores = await Score.aggregate([
      { $match: { gameSlug: slug } },
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: '$playerAddress',
          bestScore: { $first: '$score' },
          lastPlayed: { $first: '$createdAt' }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: limit }
    ]);

    // Enrich with user data
    const leaderboard = await Promise.all(
      topScores.map(async (entry, index) => {
        const user = await User.findOne({ stxAddress: entry._id });
        return {
          rank: index + 1,
          playerAddress: entry._id,
          username: user?.username,
          avatar: user?.avatar,
          score: entry.bestScore,
          lastPlayed: entry.lastPlayed
        };
      })
    );

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;




