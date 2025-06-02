import express from "express";
import { createAddress, deleteAddress, getAddressById, getAddressList, updateAddress } from "../controllers/addressController.js";

const router = express.Router();

router.post("/users/createAddress",createAddress);
router.put("/users/updateAddress",updateAddress);

router.get("/admin/getAddressList",getAddressList);

router.get("/users/getAddressById",getAddressById);
router.delete("/users/deleteAddress",deleteAddress);

export default router;