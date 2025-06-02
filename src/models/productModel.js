import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },

    image:[
        {
        type:String,
    }
   ],

   description:{
    type:String,
    trim:true,
    
   },
   price:{
    type:Number
   },

    categoryId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category",
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    
  },


},{timestamps:true});

const Product = mongoose.model("Product",productSchema);

export default Product;

