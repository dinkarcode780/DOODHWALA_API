import asyncHandler from "../utils/asynchandler.js";
import { compareValue, hashValue } from "../utils/hashHelper.js";
import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import { deleteFileFromObjectStorage } from "../middleware/multerS3.js";

// const generateRandom =  ()=> "DSM"+ Math.floor(1000 + Math.random()*9000);


export const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  const otp = 1234;
  const hashedOtp = await hashValue(otp);

  let user = await userModel.findOne({ phoneNumber });

  if (!user) {
    user = await userModel.create({
      phoneNumber,otp:hashedOtp,
        
    });

    return res.status(201).json({
      success: true,
      message: "User created and OTP sent",
      otp, 
    });
  }

  user.otp = hashedOtp;
  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP updated and sent sucessfully",
    otp, 
  });
});

export const verifyOtp = asyncHandler(async(req,res)=>{
  
      const { phoneNumber, otp } = req.body;


    const user = await userModel.findOne({phoneNumber});
     
     if (!user || !user.phoneNumber) {
        return res.status(400).json({
            success: false,
            message: "Invalid phone number ",
        });
    }
     
    const isMatch = await compareValue(otp.toString(),user.otp);


    if(!isMatch){
        return res.status(400).json({success:false,message:"Invalid OTP"});
    }

      const token = jwt.sign({ id: user._id,userType: user.userType }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    user._doc.token = token;

   res.status(200).json({
    success:true,
    message:"Verify otp successfully",
      dat:user,
    })

});

// export const updateProfile = asyncHandler(async (req, res) => {
//     const { userId, name, email, phoneNumber } = req.body;
//     const image = req.file?.key || null;

//     const profileData = await userModel.findById(userId);
    
  
//     if (image && profileData.image) {
        
//         await deleteFileFromObjectStorage(profileData.image);
//     }

//     profileData.name = name || profileData.name;
//     profileData.email = email || profileData.email;
//     profileData.phoneNumber = phoneNumber || profileData.phoneNumber;

//     if (image) {
//         profileData.image = image;
//     }

//     await profileData.save();

//     res.status(200).json({
//         success: true,
//         message: "User updated successfully",
//         data: profileData
//     });
// });

export const updateProfile = asyncHandler(async (req, res) => {
    const { userId, name, email, phoneNumber } = req.body;
    const image = req.file?.key || null;

    const profileData = await userModel.findById(userId);
    
   
    if (image && profileData.image) {
        await deleteFileFromObjectStorage(profileData.image);
    }

    const updateFields = {
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(image && { image }),
    };

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
});




export const getListAllUser = asyncHandler(async(req,res)=>{

    const getListAllUser = await userModel.find()

    res.status(200).json({
        success:true,
        message:"All user fetched successfully",
        data:getListAllUser,
    });
});


export const getUserByFilter = asyncHandler(async(req,res)=>{

  const {name,email,phoneNumber,search} = req.query
  
  
  
})
export const getUserById = asyncHandler(async(req,res)=>{

    const {userId} = req.query;

    const userData = await userModel.findById(userId);

    res.status(200).json({success:true,message:"User fetched successfully",data:userData});
});


export const deleteUser = asyncHandler(async(req,res)=>{

    const {userId} = req.query;

    const userData = await userModel.findByIdAndDelete(userId);

    if(userData.image){
        await deleteFileFromObjectStorage(userData.image);
    }

    res.status(200).json({success:true,message:"User deleted successfully"});
});


export const adminLogin = asyncHandler(async(req,res)=>{

  const {email,password} = req.body;

   const adminUser = await userModel.findOne({email,userType:"ADMIN"});

  const isMatchPassword = await compareValue(password,adminUser.password);

    if(!isMatchPassword){
    return res.status(401).json({
      success:false,message:"Wrong Password"
    })
  }

  const token = jwt.sign({id: adminUser._id,userType:adminUser.userType},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})

   adminUser._doc.token = token;

   res.status(200).json({success:true,message:"Admin Login successfully",data:adminUser})
});


export const updateAdminProfile = asyncHandler(async(req,res)=>{
 
  const {adminId,email,phoneNumber} = req.body;
  const image = req.file?.key || null;

   const adminUser = await userModel.fondOne({_id:adminId,userType:"ADMIN"});

   if(image && adminUser.image){
    await deleteFileFromObjectStorage(adminUser.image)
   }
   
   const updatedAdminData = {
    ...(email&&{email}),
    ...(phoneNumber&&{phoneNumber}),
    ...(image&&{image})
   }

   const admin = await userModel.findByIdAndUpdate(adminId,updatedAdminData,{new:true})

   res.status(200).json({success:true, message:"Admin updated successfully",data:admin})
   

})


export const logOutUser =  asyncHandler(async(req,res)=>{

  res.clearCookie("authorization");
  res.status(200).json({
    success:true,
    message:"Logout successfully",
  });
});



