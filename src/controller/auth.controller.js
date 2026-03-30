import userModel from "../models/user.models.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js"


export async function  registerUser(req,res)
{
    try {
         const{username,email,password}=req.body;
         if(!username||!email||!password)
         {
            return res.status(400).json({message:"All fields are required"})
         }
    const existingUser = await userModel.findOne({
        $or:[{username},{email}]
    });
    if(existingUser){
        return res.status(409).json({message:"User already exists with this username or email"})
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
        username,
        email,
        password:hashedPassword
     })

   const acessToken =jwt.sign({
    id:user._id,

   },config.JWT_SECRET,{
    expiresIn:"15m"
   })
   const refreshToken = jwt.sign({
    id:user._id,
   },config.JWT_SECRET,{
    expiresIn:"15d"
   })
  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:15*24*60*60*1000
   })

   return res.status(201).json({
    message:"user registered successfully",
    id:user._id,
    username:user.username,
    email:user.email,
    acessToken,




   })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function LoginUser(req,res){
    try {
        

    } catch (error) {
        
    }
}

export async function getMe(req,res){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try {
        
        const decoded = jwt.verify(token,config.JWT_SECRET);
        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({
            message:"User profile retrieved successfully",
            id:user._id,
            username:user.username,
            email:user.email
        })
    } catch (error) {
        return res.status(401).json({message:"Invalid token"})
    }

}

export async function refreshToken(req,res){
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({
            message:"unauthorized access"
        })
    }
  const decoded = jwt.verify(refreshToken,config.JWT_SECRET)
  const newAccessToken = jwt.sign({
    id:decoded.id,
  },config.JWT_SECRET,{
    expiresIn:"15m"
  })
  const newRfreshToken = jwt.sign({
    id:decoded.id,},config.JWT_SECRET,{
    expiresIn:"15d"
  })
  res.cookie("refreshToken",newRfreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:15*24*60*60*1000
})  
    return res.status(200).json({
        message:"Access token refreshed successfully",
        newAccessToken
    })
}