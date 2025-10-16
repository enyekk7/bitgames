import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  stxAddress: { type: String, required: true, unique: true, index: true },
  username: { type: String, sparse: true, unique: true }, // unique & sparse allows nulls
  usernameChanged: { type: Boolean, default: false },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
