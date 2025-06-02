import asyncHandler from "../utils/asynchandler.js";
import productModel from "../../models/productModel.js";
import categoryModel from "../../models/categoryModel.js";
import CompanyModel from "../../models/companyModel.js";


export const getHomepage = asyncHandler(async (req, res) => {
  const {
    search,
    productPage = 1,
    productLimit = 10,
    categoryPage = 1,
    categoryLimit = 10,
    categoryId,
    adminId,
    isAvailable
  } = req.query;

  
  const productFilter = {};
  if (categoryId) productFilter.categoryId = categoryId;
  if (adminId) productFilter.adminId = adminId;
  if (typeof isAvailable !== "undefined") productFilter.isAvailable = isAvailable === "true";

  if (search) {
    productFilter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

 
  const categoryFilter = {};
  if (adminId) categoryFilter.adminId = adminId;
  if (search) {
    categoryFilter.name = { $regex: search, $options: "i" };
  }


  const productPageNum = Math.max(1, Number(productPage));
  const productLimitNum = Math.max(1, Number(productLimit));
  const productSkip = (productPageNum - 1) * productLimitNum;

  const categoryPageNum = Math.max(1, Number(categoryPage));
  const categoryLimitNum = Math.max(1, Number(categoryLimit));
  const categorySkip = (categoryPageNum - 1) * categoryLimitNum;


  const [products, totalProducts, categories, totalCategories,companydata] = await Promise.all([
    productModel.find(productFilter).skip(productSkip).limit(productLimitNum).sort({ createdAt: -1 }),
    productModel.countDocuments(productFilter),
    categoryModel.find(categoryFilter).skip(categorySkip).limit(categoryLimitNum).sort({ createdAt: -1 }),
    categoryModel.countDocuments(categoryFilter),
    CompanyModel.findOne().populate("banners.companyId")
  ]);

  res.status(200).json({
    success: true,
    message: "Homepage data fetched successfully",
    data: {
      products,
      productPagination: {
        currentPage: productPageNum,
        totalPages: Math.ceil(totalProducts / productLimitNum),
        totalProducts,
        limit: productLimitNum,
      },
      categories,
      categoryPagination: {
        currentPage: categoryPageNum,
        totalPages: Math.ceil(totalCategories / categoryLimitNum),
        totalCategories,
        limit: categoryLimitNum,
      },
      companydata,
    }
  });
});