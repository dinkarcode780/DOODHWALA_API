import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
    addressLine1:{
      type: String,
      trim: true,
    },

     addressLine2:{
      type: String,
      trim: true,
    },

  addressType: {
    type: String,
    enum: ["Home", "Other"],
    default: "Home",
  },


  city: {
    type: String,
    trim: true,
  },

  state: {
    type: String,
    trim: true,
  },

  pincode: {
    type: String,
    trim: true,
  },


}, { timestamps: true });



const Address = mongoose.model("Address", addressSchema);
export default Address;
