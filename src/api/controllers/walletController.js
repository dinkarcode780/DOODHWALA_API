import asyncHandler from "../utils/asynchandler.js";
import walletModel from "../../models/walletModel.js";

export const createWallet =asyncHandler(async(req,res)=>{
   
    const {userId,transactionId,amount,walletStatus} = req.body;

    if(!userId || !transactionId || !amount ){
      return  res.status(400).json({
            success:false,
            message:"Please provide all the required fields"
        })
        
    };
    const wallet = await walletModel.create({
        userId,
        transactionId,
        amount,
       walletStatus: walletStatus || "CREDIT"
    });

    res.status(201).json({
        success:true,
        message:"Wallet created successfully",
        data:wallet
    })

});



export const getWalletList = asyncHandler(async(req,res)=>{

    const walletData = await walletModel.find();
    if(!walletData){
        return res.status(404).json({
            success:false,
            message:"No wallet found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Wallet list fetched successfully",
        data:walletData
    })
});


