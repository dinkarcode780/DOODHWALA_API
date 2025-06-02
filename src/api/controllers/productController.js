import asyncHandler from "../utils/asynchandler.js";
import produtModel from "../../models/productModel.js";

export const createProduct = asyncHandler(async(req,res)=>{

    const {name,description,price,adminId,categoryId} = req.body;

    const image = req.files?.image ? req.files?.image.map((file)=>file.key) : [];
  
    const productData = await produtModel.create({
        name,description,price,image,adminId,categoryId
    });

    res.status(200).json({success:true,message:"Product created successfully",data:productData})

    
});

export const updateProduct = asyncHandler(async(req,res)=>{

    const {productId,name,description,price,} = req.body;
    const image = req.files?.image ? req.files?.image.map((file)=>file.key) : [];

    const updatedProduct = await produtModel.findByIdAndUpdate(productId,{
        ...(name&&{name}),
        ...(description&&{description}),
        ...(price&&{price}),
        ...(image&&{image})
    },{new:true})

    res.status(200).json({success:true,message:"Product updated successfully",data:updatedProduct})

});



export const getProductByFilter = asyncHandler(async (req, res) => {
  const {
    name,
    categoryId,
    isAvailable,
    adminId,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (categoryId) filter.categoryId = categoryId;
  if (typeof isAvailable !== "undefined") filter.isAvailable = isAvailable === "true";
  if (adminId) filter.adminId = adminId;

  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    produtModel.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    produtModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts: total,
        limit: limitNum,
      },
    },
  });
});




export const getProductById = asyncHandler(async(req,res)=>{

    const {productId} = req.query;
    
    const productData = await produtModel.findById(productId);

    res.status(200).json({success:true,message:"Product fetched successfully",data:productData});
});

export const deleteProduct = asyncHandler(async(req,res)=>{
  
    const {productId} = req.query;

    const deleteData = await produtModel.findByIdAndDelete(productId);

    res.status(200).json({success:true,message:"Product delete successfully",data:deleteData})

});