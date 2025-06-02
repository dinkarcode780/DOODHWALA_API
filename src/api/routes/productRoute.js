import express from "express";
import { createProduct, deleteProduct, getProductByFilter, getProductById, updateProduct } from "../controllers/productController.js";
import { upload } from "../middleware/multerS3.js";

const router = express.Router();

router.post("/admin/createProduct",upload.fields([{name:"image"}]),createProduct);
router.put("/admin/updateProduct",upload.fields([{name:"image"}]),updateProduct);

router.get("/admin/deleteProduct",deleteProduct);
router.get("/admin/getProductByFilter",getProductByFilter);

router.get("/users/getProductById",getProductById);
router.get("/users/getProductByFilter",getProductByFilter);


export default router;