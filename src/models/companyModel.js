import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

     name:{
        type:String,
        trim:true,
    },
    phoneNumber:{
        type:Number,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
    },
    logo:{
        type:String,
        trim:true,

    },
    favIcon:{
        type:String,
        trim:true,
    },

    banners:[{
        type:String

    }],
    privacyPolicy:{
        type:String,
        trim:true,
    },
    termsAndConditions:{
        type:String,
        trim:true,
    },
    aboutUs:{
        type:String,
        trim:true,
    },

},{timestamps:true});

const Company = mongoose.model("Comapny",companySchema);

export default Company;

const createDefaultCompany = async()=>{

    const companyData = {
        name:"MERA_company",
        phoneNumber:"7808426662",
        email:"comapny@gmail.com",
        logo:"company_logo.jpg",
        favIcon:"company_favIcon.jpg",
        banners:["company_banner.jpg","company_banner.jpg"],
        privacyPolicy:"company privacyPolicy",
        termsAndConditions:"company termsAndCondtion",
        aboutUs:"MY about",
    }

    const exstingCompany = await Company.countDocuments();
    if(!exstingCompany){
        await Company.create(companyData);
        console.log("Company created successfully")
    }else{
        console.log("company already exsit")
    }

};

export {createDefaultCompany};