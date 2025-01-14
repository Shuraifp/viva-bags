import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    default: null,
    sparse: true,
  },
  profileImage: {
    filename: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    }
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  referralCode: {
    type: String,
    default: null,
  },
  referredBy: {
    type: String,
    default: null,
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;