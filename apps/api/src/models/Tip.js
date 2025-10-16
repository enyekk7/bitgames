import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
  from: { type: String, required: true, index: true },
  to: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  txId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Tip = mongoose.model('Tip', TipSchema);
