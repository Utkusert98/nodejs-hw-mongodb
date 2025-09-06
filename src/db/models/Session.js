import mongoose, { Schema, Types } from 'mongoose';

const sessionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  accessToken: { type: String, required: true, index: true },
  refreshToken: { type: String, required: true, index: true },
  accessTokenValidUntil: { type: Date, required: true },
  refreshTokenValidUntil: { type: Date, required: true },
}, { timestamps: true, versionKey: false });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
