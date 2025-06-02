import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
    },

    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },

    amount:{
        type:Number,
        trim:true,
    },
},{timestamps:true});

const Transection = mongoose.model("Transaction", transactionSchema);
export default Transection;