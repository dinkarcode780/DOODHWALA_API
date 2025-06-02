import asyncHandler from "../utils/asynchandler.js";
import ratingModel from "../../models/ratingModel.js";

export const createRating = asyncHandler(async(req,res)=>{

    const {userId,rating,review} = req.body

    const ratingData = await ratingModel.create({
        userId,rating,review
    })

   res.status(201).json({
    success:true,message:"Rating created successfully",data:ratingData
   })
})

export const updateRating = asyncHandler(async(req,res)=>{

    const {ratingId,rating,review} = req.body

    if( !ratingId || !rating || !review){
        return res.status(401).json({success:false,message:"invailid Credentials"})
    }

    const ratingData = await ratingModel.findByIdAndUpdate(ratingId,{
       rating,review
    },{new:true})

    res.status(200).json({
        success:true,
        message:"Rating updated successfully",
        data:ratingData
        
    });
});


export const getListReview = asyncHandler(async(req,res)=>{

    const allReview = await ratingModel.find()
    
    res.status(200).json({success:false,message:"Fetched all reviews successfully",data:allReview});

})

export const deleteRating = asyncHandler(async(req,res)=>{

    const {ratingId} = req.query;

    const removedata = await ratingModel.findByIdAndDelete(ratingId);

    res.status(200).json({success:true,message:"Rating delete successfully",data:removedata});
})