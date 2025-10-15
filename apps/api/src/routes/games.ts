import express from 'express';
import { Game } from '../models/Game.js';
import { Score } from '../models/Score.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ featured: -1, playCount: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get game by slug
router.get('/:slug', async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Submit score
router.post('/:slug/score', async (req, res) => {
  try {
    const { slug } = req.params;
    const { playerAddress, score, metadata, shareMessage, template } = req.body;
    
    console.log('🎨 Backend received template:', JSON.stringify(template, null, 2));

    if (!playerAddress || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if game exists
    const game = await Game.findOne({ slug });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Ensure user exists
    await User.findOneAndUpdate(
      { stxAddress: playerAddress },
      { $set: { lastLoginAt: new Date() } },
      { upsert: true, new: true }
    );

    // Save score
    const newScore = await Score.create({
      gameSlug: slug,
      playerAddress,
      score,
      metadata
    });

    // Update play count
    await Game.findByIdAndUpdate(game._id, { $inc: { playCount: 1 } });

    // Create post if shareMessage provided
    let post = null;
    if (shareMessage) {
      console.log('📝 Creating post with template:', template);
      post = await Post.create({
        type: 'score',
        author: playerAddress,
        content: shareMessage,
        gameSlug: slug,
        score,
        scoreId: newScore._id,
        template: template
      });
      console.log('✅ Post created with ID:', post._id);
    }

    res.json({ 
      success: true, 
      score: newScore,
      post: post?._id
    });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

export default router;



