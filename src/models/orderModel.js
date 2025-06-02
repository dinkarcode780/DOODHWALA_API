import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  orderItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        trim:true,
      },
        price: {
            type: Number,
            trim:true,
        },
    }
  ],

  addressId: {
    type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref:"Address",
  },

  totalAmount: {
    type: Number,
    default: 0,
  },

  paymentStatus: {
    type: String,
    enum: ["COD", "ONLINE", "PENDING"],
    default: "PENDING",
  },

  orderStatus: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
   deliveryTime: {
    type: Date,
  }

}, { timestamps: true });

const Order = mongoose.model("Order",orderSchema);

export default Order;
