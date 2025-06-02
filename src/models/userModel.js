import mongoose from "mongoose";
import { hashValue } from "../api/utils/hashHelper.js";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
       
    },
    phoneNumber:{
      type:Number,
      
    },
    email:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
        trim:true,
    },
    image:{
        type:String,
    },
    otp:{
      type:String,
      trim:true,
      
    },
    userType:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },

    disable:{
        type:Boolean,
        default:false,
    }
    

});

const User = mongoose.model("User",userSchema);

export default User;


const createDefaultAdmin = async()=>{

    const password = 12345;

    const exstingAdmin = await User.findOne({email:"admin@gmail.com"});

    if(!exstingAdmin){
        const hashPassword = await hashValue(password);
       await User.create({
        name:"DoodhWala",
        email:"admin@gmail.com",
        password:hashPassword,
        userType:"ADMIN"
       })

       console.log("Default admin creted successfully")
    }else{
        console.log("deafult admin already exist");
    }
}

export {createDefaultAdmin};