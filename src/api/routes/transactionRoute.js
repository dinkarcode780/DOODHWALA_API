import express from "express";
import { createTransaction, getTransactionByFilter, getTransactionById,  } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/users/createTransaction",createTransaction);

// router.put("/users/updateTransactionStatus")

router.get("/users/getTransactionByFilter",getTransactionByFilter);

router.get("/users/getTransactionById",getTransactionById);

export default router;