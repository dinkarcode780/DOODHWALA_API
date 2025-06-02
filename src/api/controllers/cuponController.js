import asyncHandler from "../../api/utils/asynchandler.js";
import cuponModel from "../../models/cuponModel.js";

export const createCoupon = asyncHandler(async(req,res)=>{
    const {
    code,
    description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    usageLimit,
    userId,
    validFrom,
    validTill,
    isActive
  } = req.body;

  const existingCoupon = await cuponModel.findOne({ code });
  if (existingCoupon) {
    return res.status(400).json({
      success: false,
      message: "Coupon code already exists",
    });
  }

  const couponData = await cuponModel.create({
    code,
    description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    usageLimit,
    userId,
    validFrom,
    validTill,
    isActive
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: couponData,
  });
});


export const updateCoupon = asyncHandler(async(req,res)=>{

    const {couponId, description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    usageLimit,
    validFrom,
    validTill,
    isActive} = req.body;

    const updateData = {
       ...(description && { description }),
       ...(discountType && { discountType }),
       ...(discountValue && { discountValue }),
       ...(maxDiscountAmount && { maxDiscountAmount }),
       ...(minOrderAmount && { minOrderAmount }),
       ...(usageLimit && { usageLimit }),
       ...(validFrom && { validFrom }),
       ...(validTill && { validTill }),
       ...(typeof isActive === "boolean" && { isActive }),
     };

     const couponData = await cuponModel.findByIdAndUpdate(couponId,updateData,{new:true})

     res.status(200).json({success:true,message:"Coupon updated successfully",data:couponData})
});

export const getCouponById = asyncHandler(async(req,res)=>{
     const {couponId} = req.query;

    const couponData = await cuponModel.findById(couponId);

    res.status(200).json({success:true,message:"fetched coupon successfully",data:couponData})

});

export const getListCouponFilter = asyncHandler(async (req, res) => {
  const {
    description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    usageLimit,
    validFrom,
    validTill,
    isActive,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (description) filter.description = { $regex: description, $options: "i" };
  if (discountType) filter.discountType = discountType;
  if (discountValue) filter.discountValue = Number(discountValue);
  if (maxDiscountAmount) filter.maxDiscountAmount = Number(maxDiscountAmount);
  if (minOrderAmount) filter.minOrderAmount = Number(minOrderAmount);
  if (usageLimit) filter.usageLimit = Number(usageLimit);
  if (validFrom) filter.validFrom = { $gte: new Date(validFrom) };
  if (validTill) filter.validTill = { $lte: new Date(validTill) };
  if (typeof isActive !== "undefined") filter.isActive = isActive === "true";

  
  if (search) {
    filter.$or = [
      { code: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const coupons = await cuponModel
    .find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await cuponModel.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "Coupons fetched successfully",
    data: coupons,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  });
});



