import asyncHandler from "../utils/asynchandler.js";
import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";


export const addToCart = asyncHandler(async(req,res)=>{
   const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "userId, productId, and quantity are required",
    });
  }


  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const productPrice = product.price;

  
  let cart = await cartModel.findOne({ userId });

  if (!cart) {
  
    cart = new cartModel({
      userId,
      items: [{ productId, quantity }],
      totalAmount: quantity * productPrice,
    });
  } else {
    
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    console.log("itemIndex", itemIndex);

    if (itemIndex > -1) {
      
      cart.items[itemIndex].quantity += quantity;
    } else {
     
      cart.items.push({ productId, quantity });
    }

    let total = 0;
    for (const item of cart.items) {
      const prod = await productModel.findById(item.productId);
      if (prod) {
        total += prod.price * item.quantity;
      }
    }
    cart.totalAmount = total;
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Add to cart successfully",
    data:cart
  });  
})

export const updateCart = asyncHandler(async(req,res)=>{
  const { cartId, productId, quantity } = req.body;
  if (!cartId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "cartId, productId, and quantity are required",
    });

  }
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }
  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    return res.status(404).json({ success: false, message: "Product not found in cart" });
  }
  let total = 0;
  for (const item of cart.items) {
    const prod = await productModel.findById(item.productId);
    if (prod) {
      total += prod.price * item.quantity;
    }
  }
  cart.totalAmount = total;
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,

  });
});


  export const getCartList = asyncHandler(async(req,res)=>{

    const cartData = await cartModel.find();

    res.status(200).json({
      success:true,
      message:"All Cart fetched successfully",
      data:cartData
    });
  });

  export const getCartById = asyncHandler(async(req,res)=>{

    const {cartId} = req.query;

    const cartData = await cartModel.findById(cartId);

    res.status(200).json({
      success:true,
      message:"Cart fetched successfully",
      data:cartData
    });
  });


  
  export const deleteCart = asyncHandler(async(req,res)=>{
    const {cartId} = req.query;
    const cartData = await cartModel.findByIdAndDelete(cartId);
    res.status(200).json({
      success:true,
      message:"Cart deleted successfully",
      data:cartData,
    });
  })

