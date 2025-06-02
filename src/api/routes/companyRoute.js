import express from "express";
import { getCompany, updateCompany } from "../controllers/comapnyController.js";
import { upload } from "../middleware/multerS3.js";

const router = express.Router();

router.put("/admin/updateCompany",upload.fields([{name:"banners"},{name:"logo"},{name:"favIcon"}]),updateCompany);
router.get("/admin/getCompany",getCompany);

export default router;