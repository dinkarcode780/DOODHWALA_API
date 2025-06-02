import express from "express";
import { createOrder, getAllOrderList, getOrderByFilter, getOrderById, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/users/createOrder",createOrder);

router.put("/users/updateOrder",updateOrder);

router.get("/admin/getAllOrderList",getAllOrderList);

router.get("/users/getOrderByFilter",getOrderByFilter);

router.get("/admin/getOrderById",getOrderById);


export default router;