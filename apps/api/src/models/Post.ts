import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  type: 'score';
  author: string;
  content: string;
  gameSlug?: string;
  score?: number;
  scoreId?: Schema.Types.ObjectId;
  originalPostId?: Schema.Types.ObjectId;
  likes: string[];
  tips: Array<{
    from: string;
    amount: number;
    txId: string;
    timestamp: Date;
  }>;
  template?: {
    id: string;
    name: string;
    emoji: string;
    background: string;
    borderColor: string;
    textColor: string;
    scoreColor: string;
  };
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  type: { type: String, enum: ['score'], required: true },
  author: { type: String, required: true, index: true },
  content: { type: String, required: true },
  gameSlug: { type: String, index: true },
  score: { type: Number },
  scoreId: { type: Schema.Types.ObjectId, ref: 'Score' },
  originalPostId: { type: Schema.Types.ObjectId, ref: 'Post' },
  likes: [{ type: String }],
  tips: [{
    from: String,
    amount: Number,
    txId: String,
    timestamp: { type: Date, default: Date.now }
  }],
  template: {
    id: String,
    name: String,
    emoji: String,
    background: String,
    borderColor: String,
    textColor: String,
    scoreColor: String
  },
  createdAt: { type: Date, default: Date.now, index: -1 }
});

export const Post = mongoose.model<IPost>('Post', PostSchema);


