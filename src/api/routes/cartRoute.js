import express from  "express";
import { addToCart, deleteCart, getCartById, getCartList, updateCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/users/addToCart",addToCart);

router.put("/users/updateCart",updateCart);

router.get("/users/getCartList",getCartList);

router.get("/users/getcartById",getCartById);
router.delete("/users/deleteCart",deleteCart);

export default router;