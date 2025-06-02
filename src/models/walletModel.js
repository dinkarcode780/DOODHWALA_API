import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    amount: {
        type: Number,
        default: 0,
    },

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
    },

    walletStatus: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        default: "CREDIT",
    },

}, { timestamps: true });

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;