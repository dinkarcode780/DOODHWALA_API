import asyncHandler from "../utils/asynchandler.js";
import categoryModel from "../../models/categoryModel.js";
import { deleteFileFromObjectStorage } from "../middleware/multerS3.js";


// export const createCategory = asyncHandler(async(req,res)=>{

//     const {adminId,name,items} = req.body;
//     const image = req.file ? req.file.key : null;

//     console.log("image",image);

//     let b = JSON.parse(items)
//     items = b;
    
//     console.log("items",typeof  b);

//     const categoryData = await categoryModel.create({
//         adminId,name,items:b,image
//     });

//     console.log("data",categoryData);

//     res.status(200).json({success:true,message:"created cetegory successfully",data:categoryData});
// })

export const createCategory = asyncHandler(async(req,res)=>{
    const { adminId, name, items } = req.body;
    const image = req.file ? req.file.key : null;

    let parsedItems = JSON.parse(items); 

     if (image && parsedItems.length > 0) {
    parsedItems[0].image = image;
  }

    console.log("items", typeof parsedItems);

    const categoryData = await categoryModel.create({
        adminId,
        name,
        items: parsedItems,   
    });

    res.status(200).json({ success: true, message: "created category successfully", data: categoryData });
});


// export const updateCategory = asyncHandler(async(req,res)=>{
 
//     const {categoryId,name,items} = req.body
//     const image = req.file?.key || null;
//     const parsedItems = items?JSON.parse(items):[];

//     const exstingCtegory = await categoryModel.findById(categoryId);

//     const oldImage = exstingCtegory?.items?.[0].image;

//     image&&oldImage&& await deleteFileFromObjectStorage(oldImage);

//     parsedItems[0]&& image &&(parsedItems[0].image=image);

//     const updatedData = {
//         ...(name&&{name}),
//         ...(parsedItems.length&&{items:parsedItems})
//     }

//     console.log("image",image);




    
//     const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId,updatedData, {new:true}
//     ) ;

//     res.status(200).json({success:true,message:"Category updated successfully",data:updatedCategory})
// });

// export const updateCategory = asyncHandler(async (req, res) => {
//     const { categoryId, name, items } = req.body;
//     const image = req.file?.key || null;

//     console.log("image", image);

//     let parsedItems = [];

//     try {
//         if (items) {
//             parsedItems = JSON.parse(items);
//             console.log("parsed", parsedItems);

//             if (image && parsedItems.length > 0) {
//                 parsedItems[0].image = image;
//             }
//         }
//     } catch (error) {
//         console.error("JSON parse error:", error);
//         return res.status(400).json({
//             success: false,
//             message: "Invalid JSON format for items",
//         });
//     }

//     const updatedCategory = await categoryModel.findByIdAndUpdate(
//         categoryId,
//         {
//             ...(name && { name }),
//             ...(parsedItems.length > 0 && { items: parsedItems }),
//         },
//         { new: true }
//     );

//     res.status(200).json({
//         success: true,
//         message: "Category updated successfully",
//         data: updatedCategory,
//     });
// });

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId, name, items } = req.body;
  const image = req.file?.key || null;

  const existingCategory = await categoryModel.findById(categoryId);

  if (!existingCategory) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const oldImage = existingCategory?.items?.[0]?.image;

  
  let parsedItems = items ? JSON.parse(items) : existingCategory.items || [];

  
  if (image && oldImage) {
    await deleteFileFromObjectStorage(oldImage);
  }

 
  if (parsedItems.length > 0 && image) {
    parsedItems[0].image = image;
  }

  const updatedData = {
    ...(name && { name }),
    ...(parsedItems.length > 0 && { items: parsedItems }),
  };

  console.log("Updating category with data:", updatedData);

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    updatedData,
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});



export const getCategoryByFilter = asyncHandler(async (req, res) => {
  const {
    name,
    adminId,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (adminId) filter.adminId = adminId;

  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { "items.name": { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [categories, total] = await Promise.all([
    categoryModel.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    categoryModel.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: {
      categories,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCategories: total,
        limit: limitNum,
      },
    },
  });
});

export const getcategoryById = asyncHandler(async(req,res)=>{

    const {categoryId} = req.query;

    const categoryData = await categoryModel.findById(categoryId);
    res.status(200).json({success:true,message:" category data fetched successfully",data:categoryData})

})

export const deleteCategory = asyncHandler