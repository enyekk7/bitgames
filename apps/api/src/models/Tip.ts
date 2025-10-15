import mongoose, { Schema, Document } from 'mongoose';

export interface ITip extends Document {
  from: string;
  to: string;
  amount: number;
  postId?: Schema.Types.ObjectId;
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

const TipSchema = new Schema<ITip>({
  from: { type: String, required: true, index: true },
  to: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  txId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Tip = mongoose.model<ITip>('Tip', TipSchema);




