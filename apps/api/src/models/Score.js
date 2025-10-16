import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  gameSlug: { type: String, required: true, index: true },
  playerAddress: { type: String, required: true, index: true },
  score: { type: Number, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for leaderboards
ScoreSchema.index({ gameSlug: 1, score: -1 });
ScoreSchema.index({ gameSlug: 1, playerAddress: 1 });

export const Score = mongoose.model('Score', ScoreSchema);
