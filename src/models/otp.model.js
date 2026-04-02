import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"user is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    otpHash:{
        type:String,
        required:[true,"OTP code is required"]
    },

},{
    timestamps:true

})

const otpModel = mongoose.model("otps",otpSchema)
export default otpModel