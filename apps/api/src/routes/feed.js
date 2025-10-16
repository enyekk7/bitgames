import express from 'express';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Game } from '../models/Game.js';
import { Tip } from '../models/Tip.js';

const router = express.Router();

// Get feed
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('originalPostId');

    // Enrich posts with user and game data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findOne({ stxAddress: post.author });
        const game = post.gameSlug ? await Game.findOne({ slug: post.gameSlug }) : null;
        
        return {
          _id: post._id,
          type: post.type,
          author: {
            address: post.author,
            username: user?.username,
            avatar: user?.avatar
          },
          content: post.content,
          game: game ? {
            slug: game.slug,
            name: game.name,
            thumbnail: game.thumbnail
          } : null,
          score: post.score,
          likes: post.likes.length,
          tips: post.tips,
          template: post.template,
          createdAt: post.createdAt,
          originalPost: post.originalPostId
        };
      })
    );

    res.json(enrichedPosts);
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Like post
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hasLiked = post.likes.includes(address);
    
    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter(a => a !== address);
    } else {
      // Like
      post.likes.push(address);
    }

    await post.save();

    res.json({ 
      success: true, 
      liked: !hasLiked,
      likesCount: post.likes.length 
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Repost feature removed - only Like and Tip available

// Record tip
router.post('/:id/tip', async (req, res) => {
  try {
    const { id } = req.params;
    const { from, amount, txId } = req.body;

    if (!from || !amount || !txId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Save tip
    await Tip.create({
      from,
      to: post.author,
      amount,
      postId: post._id,
      txId,
      status: 'pending'
    });

    // Add tip to post
    post.tips.push({
      from,
      amount,
      txId,
      timestamp: new Date()
    });
    await post.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Tip error:', error);
    res.status(500).json({ error: 'Failed to record tip' });
  }
});

export default router;
