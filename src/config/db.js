import mongoose from "mongoose";
import { createDefaultAdmin } from "../models/userModel.js";
import { createDefaultCompany } from "../models/companyModel.js";

const databseConnection = async()=>{

    const DB_URL = process.env.DB_URL;

    await mongoose.connect(DB_URL).
    then(async()=>{
        console.log("Databse Connected");
        await createDefaultAdmin();
        await createDefaultCompany();

    }).catch((error)=>console.log(error.message));
};

export default databseConnection;