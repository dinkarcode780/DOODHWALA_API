import companyModel from "../../models/companyModel.js";
import asyncHandler from "../utils/asynchandler.js";

export const updateCompany = asyncHandler(async(req,res)=>{

    const {
    companyId,
    name,
    phoneNumber,
    email,
    privacyPolicy,
    termsAndconditions,
    aboutUs,
  } = req.body;
  
  const logo =  req.files?.logo ?req.files.logo[0].key:null;
  const favIcon = req.files?.favIcon?req.files.favIcon[0].key:null;
  const banners = req.files?.banners ? req.files?.banners.map((file)=>file.key) : [];

  const updatedData = {

    ...(name&&{name}),
    ...(phoneNumber&&{phoneNumber}),
    ...(email&&{email}),
    ...(privacyPolicy&&{privacyPolicy}),
    ...(termsAndconditions&&{termsAndconditions}),
    ...(aboutUs&&{aboutUs}),
    ...(logo&&{logo}),
    ...(favIcon&&{favIcon}),
    ...(banners&&{banners})
  }

  const comapnyData = await companyModel.findByIdAndUpdate(companyId,updatedData,{new:true})
  res.status(200).json({
    success:true,message:"Company updated successfully",
    data:comapnyData
  });


});

export const getCompany = asyncHandler(async(req,res)=>{

    const companyData = await companyModel.find()

    res.status(200).json({success:true,message:"Fetched company successfully",data:companyData})
})