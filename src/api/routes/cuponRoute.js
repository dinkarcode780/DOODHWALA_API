import express from "express";
import { createCoupon, getCouponById, getListCouponFilter, updateCoupon } from "../controllers/cuponController.js";

const router = express.Router();

router.post("/admin/createCoupon",createCoupon);

router.put("/admin/updateCoupon",updateCoupon);

router.get("/users/getCouponById",getCouponById);

router.get("/users/getListCouponFilter",getListCouponFilter);

export default router;