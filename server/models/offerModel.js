import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  offerName: {
    type: String,
    required: true,
    trim : true,
  },
  offerDescription: {
    type: String,
    trim : true,
  },
  offerType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  offerValue: {
    type: Number,
    required: true,
  },
  maximumDiscount: {
    type: Number,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTill: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
    default: [],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;