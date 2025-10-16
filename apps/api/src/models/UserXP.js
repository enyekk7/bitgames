import mongoose from 'mongoose';

const UserXPSchema = new mongoose.Schema({
  playerAddress: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  totalXP: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0 // XP cannot be negative
  },
  level: { 
    type: Number, 
    required: true, 
    default: 1,
    min: 1 // Level cannot be less than 1
  },
  totalGamesPlayed: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0 
  },
  totalScore: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0 
  },
  achievements: [{ 
    type: String 
  }],
  currentStreak: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  longestStreak: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  lastPlayedDate: { 
    type: String,
    default: () => new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
UserXPSchema.index({ playerAddress: 1 });
UserXPSchema.index({ totalXP: -1 }); // For leaderboards
UserXPSchema.index({ level: -1 }); // For level-based queries

export const UserXP = mongoose.model('UserXP', UserXPSchema);
