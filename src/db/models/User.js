import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: [true, 'İsim alanı zorunludur!'] },
  email: { type: String, required: [true, 'Email alanı zorunludur!'], unique: true, lowercase: true, index: true },
  password: { type: String, required: [true, 'Şifre alanı zorunludur!'] },
}, { timestamps: true, versionKey: false });

// JSON response'ta şifreyi gizle
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
