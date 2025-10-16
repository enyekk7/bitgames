import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  type: { type: String, enum: ['react', 'html'], required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  playCount: { type: Number, default: 0 },
  onChainId: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export const Game = mongoose.model('Game', GameSchema);
