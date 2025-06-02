import express from "express";
import {  adminLogin, deleteUser, getListAllUser, getUserByFilter, getUserById, logOutUser, sendOtp, updateProfile, verifyOtp } from "../controllers/userController.js";
import { upload } from "../middleware/multerS3.js";
import { userMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/users/sendOtp",sendOtp);

router.post ("/users/verifyOtp",verifyOtp);

router.put("/users/updateProfile",upload.single("image"),userMiddleware,updateProfile);


router.post("/admin/adminLogin",adminLogin);
router.get("/admin/getListAllUser",getListAllUser);

router.get("/admin/getUserByFilter",getUserByFilter);

router.get("/users/getUserById",userMiddleware,getUserById);

router.get("/users/logOutUser",logOutUser)

router.delete("/users/deleteUser",deleteUser);



export default router;