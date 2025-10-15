import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  type: 'react' | 'html';
  category: string;
  featured: boolean;
  playCount: number;
  onChainId?: number;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>({
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

export const Game = mongoose.model<IGame>('Game', GameSchema);




