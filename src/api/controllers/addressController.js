import asyncHandler from "../utils/asynchandler.js";
import addressModel from "../../models/addressModel.js";

export const createAddress = asyncHandler(async(req,res)=>{

    const {userId, addressLine1,addressLine2, city, state, country, pincode } = req.body;
    
    const addressData = await addressModel.create({
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        pincode
    });

    res.status(201).json({
        success: true,
        message: "Address created successfully",
        data: addressData
    });
})


export const updateAddress = asyncHandler(async(req,res)=>{

    const {addressId, addressLine1,addressLine2, city, state, country, pincode } = req.body;


    const updatedData = {
      ...(addressLine1 &&{addressLine1}),
        ...(addressLine2 &&{addressLine2}),
        ...(city &&{city}),
        ...(state &&{state}),
        ...(country &&{country}),
        ...(pincode &&{pincode}),

    }

    const addressData = await addressModel.findByIdAndUpdate(addressId,updatedData,{ new: true} 
    )

    res.status(200).json({
        success: true,
        message: "Address updated successfully",
        data: addressData
    });
});


export const getAddressList = asyncHandler(async(req,res)=>{

    const addressData = await addressModel.find();

    res.status(200).json({
        success: true,
        message: "Address list fetched successfully",
        data: addressData
    });
});

export const getAddressById = asyncHandler(async(req,res)=>{
    const {addressId} = req.query;

    const addressData = await addressModel.findById(addressId);

    res.status(200).json({
        success: true,
        message: "Address fetched successfully",
        data: addressData
    });
});

export const deleteAddress = asyncHandler(async(req,res)=>{
    const {addressId} = req.query;

   const addressData = await addressModel.findByIdAndDelete(addressId);
    res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        data: addressData
    });
});