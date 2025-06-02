import bcrypt from "bcrypt";

export const hashValue = async(value)=>{
    return await bcrypt.hash(value.toString(),10);
};


export const compareValue = async(value, hashValue)=>{

     if (!value || !hashValue) {
        throw new Error("Both value and hash are required for comparison");
    }
    return await bcrypt.compare(value.toString(),hashValue);
}