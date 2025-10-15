import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  stxAddress: string;
  username?: string;
  usernameChanged: boolean;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

const UserSchema = new Schema<IUser>({
  stxAddress: { type: String, required: true, unique: true, index: true },
  username: { type: String, sparse: true, unique: true }, // unique & sparse allows nulls
  usernameChanged: { type: Boolean, default: false },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);


