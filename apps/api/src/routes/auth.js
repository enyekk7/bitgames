import express from 'express';
import { User } from '../models/User.js';
import crypto from 'crypto';

const router = express.Router();

// Store nonces temporarily (in production, use Redis)
const nonces = new Map();

// Get nonce for signing
router.get('/nonce', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address required' });
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    nonces.set(address, { nonce, timestamp: Date.now() });

    // Clean up old nonces (older than 5 minutes)
    for (const [addr, data] of nonces.entries()) {
      if (Date.now() - data.timestamp > 5 * 60 * 1000) {
        nonces.delete(addr);
      }
    }

    res.json({ nonce });
  } catch (error) {
    console.error('Nonce error:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// Verify signature and authenticate
router.post('/verify', async (req, res) => {
  try {
    const { address, signature, publicKey } = req.body;

    if (!address || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nonceData = nonces.get(address);
    if (!nonceData) {
      return res.status(400).json({ error: 'No nonce found. Request a new one.' });
    }

    // In production, verify the signature here
    // For now, we'll trust the client

    // Create or update user
    const user = await User.findOneAndUpdate(
      { stxAddress: address },
      { 
        stxAddress: address,
        lastLoginAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Clean up nonce
    nonces.delete(address);

    res.json({ 
      success: true,
      user: {
        address: user.stxAddress,
        username: user.username,
        avatar: user.avatar,
        usernameChanged: user.usernameChanged
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

// Get user profile
router.get('/profile/:address', async (req, res) => {
  try {
    const { address } = req.params;
    console.log('🔍 Get profile request for address:', address);
    
    let user = await User.findOne({ stxAddress: address });
    
    if (!user) {
      console.log('❌ User not found, creating new user for address:', address);
      // Create user if not found
      user = new User({
        stxAddress: address,
        usernameChanged: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      await user.save();
      console.log('✅ Created new user for address:', address);
    }

    res.json({
      address: user.stxAddress,
      username: user.username,
      avatar: user.avatar,
      usernameChanged: user.usernameChanged
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update username (only once)
router.put('/profile/:address/username', async (req, res) => {
  try {
    const { address } = req.params;
    const { username } = req.body;

    console.log('🔍 Update username request:', { address, username });

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Validate username format (alphanumeric, underscore, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' 
      });
    }

    const user = await User.findOne({ stxAddress: address });
    console.log('🔍 User lookup result:', user ? 'Found' : 'Not found', { address });
    
    if (!user) {
      console.log('❌ User not found for address:', address);
      // Try to create user if not found
      const newUser = new User({
        stxAddress: address,
        usernameChanged: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      await newUser.save();
      console.log('✅ Created new user for address:', address);
      
      // Update the user variable
      const updatedUser = await User.findOne({ stxAddress: address });
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      
      // Continue with the new user
      updatedUser.username = username;
      updatedUser.usernameChanged = true;
      await updatedUser.save();
      
      return res.json({
        success: true,
        user: {
          address: updatedUser.stxAddress,
          username: updatedUser.username,
          avatar: updatedUser.avatar,
          usernameChanged: updatedUser.usernameChanged
        }
      });
    }

    // Check if username already changed
    if (user.usernameChanged) {
      return res.status(400).json({ error: 'Username can only be changed once' });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Update username
    user.username = username;
    user.usernameChanged = true;
    await user.save();

    res.json({
      success: true,
      user: {
        address: user.stxAddress,
        username: user.username,
        avatar: user.avatar,
        usernameChanged: user.usernameChanged
      }
    });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ error: 'Failed to update username' });
  }
});

export default router;
