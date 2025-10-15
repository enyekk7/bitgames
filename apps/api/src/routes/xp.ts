import express from 'express';
import { UserXP } from '../models/UserXP.js';

const router = express.Router();

// Calculate level based on XP
const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 1000) + 1;
};

// Calculate XP needed for a level
const calculateXPForLevel = (level: number): number => {
  return (level - 1) * 1000;
};

// Get user XP data
router.get('/:playerAddress', async (req, res) => {
  try {
    const { playerAddress } = req.params;
    
    let userXP = await UserXP.findOne({ playerAddress });
    
    // Create new user XP record if doesn't exist
    if (!userXP) {
      userXP = await UserXP.create({
        playerAddress,
        totalXP: 0,
        level: 1,
        totalGamesPlayed: 0,
        totalScore: 0,
        achievements: []
      });
    }
    
    res.json(userXP);
  } catch (error) {
    console.error('Get XP error:', error);
    res.status(500).json({ error: 'Failed to fetch XP data' });
  }
});

// Add XP to user (this is the main function for XP updates)
router.post('/:playerAddress/add', async (req, res) => {
  try {
    const { playerAddress } = req.params;
    const { xpToAdd, gameScore, gameSlug } = req.body;
    
    if (!xpToAdd || xpToAdd < 0) {
      return res.status(400).json({ error: 'Invalid XP amount' });
    }
    
    // Find or create user XP record
    let userXP = await UserXP.findOne({ playerAddress });
    
    if (!userXP) {
      userXP = await UserXP.create({
        playerAddress,
        totalXP: 0,
        level: 1,
        totalGamesPlayed: 0,
        totalScore: 0,
        achievements: []
      });
    }
    
    // Store old values for comparison
    const oldXP = userXP.totalXP;
    const oldLevel = userXP.level;
    
    // Add XP (XP can only increase, never decrease)
    userXP.totalXP = Math.max(userXP.totalXP, userXP.totalXP + xpToAdd);
    userXP.totalGamesPlayed += 1;
    
    if (gameScore && gameScore > 0) {
      userXP.totalScore += gameScore;
    }
    
    // Handle streak calculation
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (userXP.lastPlayedDate === today) {
      // Already played today, no streak change
    } else if (userXP.lastPlayedDate === yesterday) {
      // Consecutive day, increase streak
      userXP.currentStreak += 1;
      userXP.longestStreak = Math.max(userXP.longestStreak, userXP.currentStreak);
    } else {
      // Streak broken, reset to 1
      userXP.currentStreak = 1;
    }
    
    userXP.lastPlayedDate = today;
    
    // Calculate new level
    const newLevel = calculateLevel(userXP.totalXP);
    userXP.level = newLevel;
    userXP.lastUpdated = new Date();
    
    // Check for level up
    const leveledUp = newLevel > oldLevel;
    
    // Check for achievements (fokus pada frekuensi bermain)
    const newAchievements = [];
    
    // First game achievement
    if (userXP.totalGamesPlayed === 1) {
      newAchievements.push('🎮 First Game');
    }
    
    // Frequent player achievements (lebih mudah didapat)
    if (userXP.totalGamesPlayed >= 5 && !userXP.achievements.includes('🔥 Regular Player')) {
      newAchievements.push('🔥 Regular Player');
    }
    if (userXP.totalGamesPlayed >= 10 && !userXP.achievements.includes('⭐ Active Gamer')) {
      newAchievements.push('⭐ Active Gamer');
    }
    if (userXP.totalGamesPlayed >= 25 && !userXP.achievements.includes('🏆 Dedicated Player')) {
      newAchievements.push('🏆 Dedicated Player');
    }
    if (userXP.totalGamesPlayed >= 50 && !userXP.achievements.includes('🎯 Frequent Player')) {
      newAchievements.push('🎯 Frequent Player');
    }
    if (userXP.totalGamesPlayed >= 100 && !userXP.achievements.includes('🏅 Veteran Player')) {
      newAchievements.push('🏅 Veteran Player');
    }
    if (userXP.totalGamesPlayed >= 200 && !userXP.achievements.includes('👑 Game Master')) {
      newAchievements.push('👑 Game Master');
    }
    
    // Level achievements (tetap ada tapi tidak terlalu fokus)
    if (newLevel >= 3 && !userXP.achievements.includes('🌟 Rising Star')) {
      newAchievements.push('🌟 Rising Star');
    }
    if (newLevel >= 5 && !userXP.achievements.includes('💫 Level Master')) {
      newAchievements.push('💫 Level Master');
    }
    if (newLevel >= 10 && !userXP.achievements.includes('⭐ High Level Player')) {
      newAchievements.push('⭐ High Level Player');
    }
    
    // Streak achievements
    if (userXP.currentStreak >= 3 && !userXP.achievements.includes('🔥 3-Day Streak')) {
      newAchievements.push('🔥 3-Day Streak');
    }
    if (userXP.currentStreak >= 7 && !userXP.achievements.includes('⭐ Weekly Streak')) {
      newAchievements.push('⭐ Weekly Streak');
    }
    if (userXP.currentStreak >= 14 && !userXP.achievements.includes('🏆 2-Week Streak')) {
      newAchievements.push('🏆 2-Week Streak');
    }
    if (userXP.currentStreak >= 30 && !userXP.achievements.includes('👑 Monthly Streak')) {
      newAchievements.push('👑 Monthly Streak');
    }
    
    // Longest streak achievements
    if (userXP.longestStreak >= 7 && !userXP.achievements.includes('📅 Consistent Player')) {
      newAchievements.push('📅 Consistent Player');
    }
    if (userXP.longestStreak >= 30 && !userXP.achievements.includes('🎯 Streak Master')) {
      newAchievements.push('🎯 Streak Master');
    }
    
    // Add new achievements
    userXP.achievements.push(...newAchievements);
    
    await userXP.save();
    
    res.json({
      success: true,
      userXP,
      leveledUp,
      newAchievements,
      xpGained: userXP.totalXP - oldXP
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ error: 'Failed to add XP' });
  }
});

// Get XP leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const leaderboard = await UserXP.find()
      .sort({ totalXP: -1, lastUpdated: 1 })
      .limit(limit)
      .select('playerAddress totalXP level totalGamesPlayed totalScore achievements');
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get XP progress for a user
router.get('/:playerAddress/progress', async (req, res) => {
  try {
    const { playerAddress } = req.params;
    
    const userXP = await UserXP.findOne({ playerAddress });
    
    if (!userXP) {
      return res.status(404).json({ error: 'User XP not found' });
    }
    
    const currentLevel = userXP.level;
    const currentLevelXP = calculateXPForLevel(currentLevel);
    const nextLevelXP = calculateXPForLevel(currentLevel + 1);
    const progress = ((userXP.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    
    res.json({
      currentXP: userXP.totalXP,
      currentLevel,
      currentLevelXP,
      nextLevelXP,
      progress: Math.min(progress, 100),
      xpToNextLevel: nextLevelXP - userXP.totalXP
    });
  } catch (error) {
    console.error('XP progress error:', error);
    res.status(500).json({ error: 'Failed to fetch XP progress' });
  }
});

export default router;
