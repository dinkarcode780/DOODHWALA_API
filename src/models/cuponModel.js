import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  discountType: {
    type: String,
    enum: ["FLAT", "PERCENTAGE"],
  },

  discountValue: {
    type: Number,
  },

  maxDiscountAmount: {
    type: Number,
    default: null, 
  },

  minOrderAmount: {
    type: Number,
    default: 0,
  },

  usageLimit: {
    type: Number,
    default: 1, 
  },

  adminId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  validFrom: {
    type: Date,
  },

  validTill: {
    type: Date,
  },

  isActive: {
    type: Boolean,
    default: true,
  }

}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
