import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'], 
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumPurchase: {
    type: Number,
    default: 0 
  },
  maximumDiscount: {
    type: Number,
    default: null 
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTill: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1 
  },
  usageCount: {
    type: Number,
    default: 0 
  },
  isActive: {
    type: Boolean,
    default: true 
  },
  isDeleted: {
    type: Boolean,
    default: false 
  },
}, { timestamps: true }); 

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;



const userUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  coupons: [{
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true
    },
    usageCount: {
      type: Number,
      default: 1 
    },
  }]
}, { timestamps: true });

export const UserUsage = mongoose.model('UserUsage', userUsageSchema);
