import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
   
    name:{
        type:String,
        trim:true,
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items: [
    {
      name: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,

      },
      image: {
        type: String,
        trim: true,
      },
      isAvailable: {
        type: Boolean,
        default: true,
      }
    }
  ],
    
},{timestamps:true});

const Category = mongoose.model("Category",categorySchema);

export default Category;