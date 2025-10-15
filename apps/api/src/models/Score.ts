import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document {
  gameSlug: string;
  playerAddress: string;
  score: number;
  metadata?: Record<string, any>;
  txHash?: string;
  createdAt: Date;
}

const ScoreSchema = new Schema<IScore>({
  gameSlug: { type: String, required: true, index: true },
  playerAddress: { type: String, required: true, index: true },
  score: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for leaderboards
ScoreSchema.index({ gameSlug: 1, score: -1 });
ScoreSchema.index({ gameSlug: 1, playerAddress: 1 });

export const Score = mongoose.model<IScore>('Score', ScoreSchema);




