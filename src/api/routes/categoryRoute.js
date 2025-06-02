import express from "express";
import { createCategory, getCategoryByFilter,  updateCategory } from "../controllers/categoryController.js";
import { upload } from "../middleware/multerS3.js";

const router = express.Router();

router.post("/admin/createCategory",upload.single("image"),createCategory);

router.put("/admin/updateCategory",upload.single("image"),updateCategory);

router.get("/admin/getCategoryByFilter",getCategoryByFilter);

router.get("/users/getCategoryByFilter",getCategoryByFilter);

export default router;