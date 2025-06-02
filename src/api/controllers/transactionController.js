import asyncHandler from "../utils/asynchandler.js";
import transactionModel from "../../models/transactionModel.js";
import walletModel from "../../models/walletModel.js";

// export const createTransaction = asyncHandler(async(req,res)=>{

//     const {userId, orderId, amount} = req.body;
//     if(!userId || !orderId || !amount){
//         return res.status(400).json({
//             success:false,
//             message:"userId, orderId and amount are required"
//         })
//     }
//     const transaction = await transactionModel.create({
//         userId,
//         orderId,
//         amount
//     })
//     res.status(200).json({
//         success:true,
//         message:"Transaction created successfully",
//         data:transaction
//     })

// });


// export const updateTransaction = asyncHandler(async(req,res)=>{    
// })


// export const getTransactionList = asyncHandler(async(req,res)=>{

//     const{transactionId,status,userId,page,limit,search} = req.query;
//     const query = {};
//     if(transactionId){
//         query.transactionId = transactionId;
//     }
//     if(status){
//         query.status = status;
//     }
//     if(userId){
//         query.userId = userId;
//     }
//     if(search){
//         query.$or = [
//             {transactionId: {$regex: search, $options: "i"}},
//             {userId: {$regex: search, $options: "i"}}
//         ]
//     }
//     const pageNumber = parseInt(page) || 1;
//     const limitNumber = parseInt(limit) || 10;
//     const skip = (pageNumber - 1) * limitNumber;
//     const transactions = await transactionModel.find(query).skip(skip).limit(limitNumber);
//     const totalTransactions = await orderModel.findOne(query).populate("paymentStatus.orderId");
//     res.status(200).json({
//         success:true,
//         message:"Transaction list fetched successfully",
//         data:transactions,
//         totalTransactions,
//         pageNumber,
//         limitNumber
//     })
    
// })

export const createTransaction = asyncHandler(async (req, res) => {
    const { userId, orderId, amount, walletStatus } = req.body;

    if (!userId || !amount || !walletStatus) {
        res.status(400);
        throw new Error("userId, amount, and walletStatus are required.");
    }

    if (!["CREDIT", "DEBIT"].includes(walletStatus)) {
        return res.status(400).json({success: false, message: "Invalid wallet status. It should be either 'CREDIT' or 'DEBIT'."});
    }

  
    const latestWallet = await walletModel.findOne({ userId }).sort({ createdAt: -1 });

    const currentBalance = latestWallet ? latestWallet.amount : 0;

    
    if (walletStatus === "DEBIT" && currentBalance < amount) {
        res.status(400).json({
            success: false,
            message: "Insufficient balance in the wallet.",
        });
    }

  
    const transaction = await transactionModel.create({
        userId,
        orderId,
        amount,
    });

    
    const updatedAmount = walletStatus === "CREDIT"
        ? currentBalance + amount
        : currentBalance - amount;

    const walletEntry = await walletModel.create({
        userId,
        amount: updatedAmount,
        transactionId: transaction._id,
        walletStatus: walletStatus,
    });

    res.status(201).json({
        message: `Wallet ${walletStatus} successful.`,
        transaction,
        wallet: walletEntry,
    });
});




export const getTransactionByFilter = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10,walletStatus, search = "" } = req.query;

  const query = {};

  // 🔍 Regex-based search for amount or transactionCode
  if (search.trim()) {
    query.$or = [
      { amount: { $regex: search, $options: "i" } },
      { transactionCode: { $regex: search, $options: "i" } }
    ];
  }

  // 🧹 Additional filters (if provided)
  if (req.query.userId) query.userId = req.query.userId;
  if (req.query.userId) query.userId = req.query.userId;

//   if (req.query.walletStatus) query.walletStatus = req.query.walletStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const total = await transactionModel.countDocuments(query);

  const transactions = await transactionModel
    .find(query)
    .populate("userId")
    .populate("orderId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    message: "Transactions fetched successfully",
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalTransactions: total,
    data: transactions,
  });
});


export const getTransactionById = asyncHandler(async(req,res)=>{
    const {transactionId} = req.query;

    if(!transactionId){
        return res.status(400).json({
            success:false,
            message:"transactionId is required"
        })
    }
    const transaction = await transactionModel.findById(transactionId).populate("userId").populate("orderId");
   
    res.status(200).json({
        success:true,
        message:"Transaction fetched successfully",
        data:transaction
    })
});

// export const updateTransactionStatus = asyncHandler(async(req,res)=>{

// })
