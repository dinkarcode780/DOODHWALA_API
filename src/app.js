dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";





import userRoute from "./api/routes/userRoute.js";
import productRoute from "./api/routes/productRoute.js";
import categoryRoute from "./api/routes/categoryRoute.js";
import cartRoute from "./api/routes/cartRoute.js";
import addressRoute from "./api/routes/addressRoute.js";
import orderRoute from "./api/routes/orderRoute.js";
import transactionRoute from "./api/routes/transactionRoute.js";
import walletRoute from "./api/routes/walletRoute.js";
import ratingRoute from "./api/routes/ratingRoute.js";
import cuponRoute from "./api/routes/cuponRoute.js";
import companyRoute from "./api/routes/companyRoute.js";
import homePageRoute from "./api/routes/homePageRoute.js";



const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));




// Route

app.use("/api",userRoute);
app.use("/api",productRoute);
app.use("/api",categoryRoute);
app.use("/api",cartRoute);
app.use("/api",addressRoute);
app.use("/api",orderRoute);
app.use("/api",transactionRoute);
app.use("/api",walletRoute);
app.use("/api",ratingRoute);
app.use("/api",cuponRoute);
app.use("/api",companyRoute);
app.use("/api",homePageRoute);


export default app;