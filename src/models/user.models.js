import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   username:{
    type:String,
    required:[true,"username is required"],
    unique:[true,"username already exists"]

   },
   email:{
    type:String,
    required:[true,"email is required"],
    unique:[true,"email already exists"],
   },
    password:{  
    type:String,
    required:[true,"password is required"],
   }


})

const userModel = mongoose.model("users",userSchema)


export default userModel;