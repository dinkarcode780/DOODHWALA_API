import express from "express";
import { createRating, deleteRating, getListReview, updateRating } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/users/createRating",createRating);

router.put("/users/updateRating",updateRating);

router.get("/admin/getListReview",getListReview);

router.delete("/users/deleteRating",deleteRating);

router.delete("/admin/deleteRating",deleteRating)

export default router;