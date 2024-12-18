import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  profileImage: {
    filename: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
  },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;