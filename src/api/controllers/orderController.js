import asyncHandler from "../utils/asynchandler.js";
import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";


export const createOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    orderItems,
    addressId,
    paymentStatus,
    orderStatus,
    deliveryTime,
  } = req.body;


   let totalAmount = 0;

  for (let i = 0; i < orderItems.length; i++) {
    const product = await productModel.findById(orderItems[i].productId)

    if (product) {
      totalAmount += product.price * orderItems[i].quantity;
      
    }
  }
   console.log("orderItems", orderItems);

  console.log("totalAmount", totalAmount);

  const orderData = await orderModel.create({
    userId,
    orderItems:orderItems,
    addressId,
    paymentStatus,
    orderStatus,
    totalAmount,
    deliveryTime,
  });
  
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: orderData,
  });
});



export const updateOrder = asyncHandler(async (req, res) => {
  const {
    orderId,
    orderItems,
    addressId,
    paymentStatus,
    orderStatus,
    deliveryTime,
  } = req.body;

  const orderData = await orderModel.findById(orderId);
  if (!orderData) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }


  if (orderItems) orderData.orderItems = orderItems;
  // if (addressId) orderData.addressId = addressId;
  // if (paymentStatus) orderData.paymentStatus = paymentStatus;
  // if (orderStatus) orderData.orderStatus = orderStatus;
  // if (deliveryTime) orderData.deliveryTime = deliveryTime;

  
  let totalAmount = 0;
  for (let i = 0; i < orderData.orderItems.length; i++) {
    const product = await productModel.findById(orderData.orderItems[i].productId);
    if (product) {
      totalAmount += product.price * orderData.orderItems[i].quantity;
      orderData.orderItems[i].price = product.price;
    }
  }
  orderData.totalAmount = totalAmount;

  await orderData.save();

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: orderData,
  });
});


export const getAllOrderList = asyncHandler(async(req,res)=>{
    const getAllOrder = await orderModel.find().populate("userId").populate("addressId").populate("orderItems.productId");

    res.status(200).json({success:true,message:"fetched all order successfully",data:getAllOrder})
});

// export const getOrderByFilter = asyncHandler(async (req, res) => {
//   const {
//     userId,
//     paymentStatus,
//     orderStatus,
//     addressId,
//     search,
//     page = 1,
//     limit = 10,
//   } = req.query;

//   const filter = {};

//   if (userId) filter.userId = userId;
//   if (paymentStatus) filter.paymentStatus = paymentStatus;
//   if (orderStatus) filter.orderStatus = orderStatus;
//   if (addressId) filter.addressId = addressId;

//   // Search by orderStatus or paymentStatus (expand as needed)
//   if (search) {
//     filter.$or = [
//       { orderStatus: { $regex: search, $options: "i" } },
//       { paymentStatus: { $regex: search, $options: "i" } },
//     ];
//   }

//   const pageNum = Math.max(1, Number(page));
//   const limitNum = Math.max(1, Number(limit));
//   const skip = (pageNum - 1) * limitNum;

//   const [orders, totalOrders] = await Promise.all([
//     orderModel.find(filter)
//       .skip(skip)
//       .limit(limitNum)
//       .sort({ createdAt: -1 })
//       .populate("userId")
//       .populate("orderItems.productId")
//       .populate("addressId"),
//     orderModel.countDocuments(filter),
//   ]);

//   res.status(200).json({
//     success: true,
//     message: "Orders fetched successfully",
//     data: {
//       orders,
//       pagination: {
//         currentPage: pageNum,
//         totalPages: Math.ceil(totalOrders / limitNum),
//         totalOrders,
//         limit: limitNum,
//       },
//     },
//   });
// });


export const getOrderByFilter = asyncHandler(async (req, res) => {
  const {
    userId,
    paymentStatus,
    orderStatus,
    addressId,
    productId,
    productName,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (userId) filter.userId = userId;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (orderStatus) filter.orderStatus = orderStatus;
  if (addressId) filter.addressId = addressId;


  if (productId) {
    filter["orderItems.productId"] = productId;
  }

  if (search) {
    filter.$or = [
      { orderStatus: { $regex: search, $options: "i" } },
      { paymentStatus: { $regex: search, $options: "i" } },

    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;


  if (productName) {
    const matchStage = { $match: filter };
    const unwindStage = { $unwind: "$orderItems" };
    const lookupStage = {
      $lookup: {
        from: "products",
        localField: "orderItems.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    };
    const matchProductNameStage = {
      $match: {
        "productDetails.name": { $regex: productName, $options: "i" },
      },
    };
    const groupStage = {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" },
      },
    };
    const replaceRootStage = { $replaceRoot: { newRoot: "$doc" } };
    const sortStage = { $sort: { createdAt: -1 } };
    const facetStage = {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limitNum }],
        totalCount: [{ $count: "count" }],
      },
    };

    const agg = [
      matchStage,
      unwindStage,
      lookupStage,
      matchProductNameStage,
      groupStage,
      replaceRootStage,
      sortStage,
      facetStage,
    ];

    const result = await orderModel.aggregate(agg);

    const orders = result[0]?.paginatedResults || [];
    const totalOrders = result[0]?.totalCount[0]?.count || 0;

  
    await userModel.populate(orders, { path: "userId" });
    await userModel.populate(orders, { path: "addressId" });
    await userModel.populate(orders, { path: "orderItems.productId" });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalOrders / limitNum),
          totalOrders,
          limit: limitNum,
        },
      },
    });
  }

 
  const [orders, totalOrders] = await Promise.all([
    orderModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("orderItems.productId")
      .populate("addressId"),
    orderModel.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: {
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        totalOrders,
        limit: limitNum,
      },
    },
  });
});
export const getOrderById = asyncHandler(async(req,res)=>{

  const {orderId} = req.query;
  const orderData = await orderModel.findById(orderId).populate("userId").populate("addressId").populate("orderItems.productId");

  res.status(200).json({success:true,message:"Order fetched successfully",data:orderData});
  
})


export const deleteOrder = asyncHandler(async(req,res)=>{
  const {orderId} = req.query;

  const deleteData = await orderModel.findByIdAndDelete(orderId);

  res.status(200).json({success:true,message:"Order delete successfully",data:deleteData})
})
