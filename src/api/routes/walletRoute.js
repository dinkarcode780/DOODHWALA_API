import express from "express";
import { createWallet, getWalletList } from "../controllers/walletController.js";

const router = express.Router();

router.post("/users/createWallet",createWallet);

router.get("/users/getWalletList",getWalletList);

export default router;
