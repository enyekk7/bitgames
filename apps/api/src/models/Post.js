import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  type: { type: String, enum: ['score'], required: true },
  author: { type: String, required: true, index: true },
  content: { type: String, required: true },
  gameSlug: { type: String, index: true },
  score: { type: Number },
  scoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Score' },
  originalPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
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

export const Post = mongoose.model('Post', PostSchema);
