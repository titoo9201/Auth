import userModel from "../models/user.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.models.js";
import { sendEmail } from "../services/email.services.js";
import {genrateOTP,getOtpHtml} from "../utils/otp.utils.js"
import otpModel from "../models/otp.model.js";

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this username or email" });
    }
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
const otp = genrateOTP()
const html = getOtpHtml(otp)
 const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
 await otpModel.create({
    user:user._id,
    email,
    otpHash
 })
    await sendEmail(email,"Verify your email","Please use the following OTP to verify your email address: "+otp,html)

    return res.status(201).json({
      message: "user registered successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function LoginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await userModel.findOne({
    email,
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if(!user.verified) {
    return res.status(401).json({ message: "Please verify your email before logging in" });
  }
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const isPasswordValid = hashedPassword === user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15d",
    },
  );
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.create({
    user: user._id,
    refreshToken: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  const acessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "Login successful",
    id: user._id,
    username: user.username,
    email: user.email,
    acessToken,
  });
}

export async function getMe(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User profile retrieved successfully",
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "unauthorized access",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.findOne({
    _id: decoded.sessionId,
    refreshToken: refreshTokenHash,
    revoked: false,
  });
  if (!session) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  const newAccessToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const newRfreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15d",
    },
  );
  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRfreshToken)
    .digest("hex");
  session.refreshToken = newRefreshTokenHash;
  await session.save();

  res.cookie("refreshToken", newRfreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "Access token refreshed successfully",
    newAccessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.findOne({
    refreshToken: refreshTokenHash,
    revoked: false,
  });
  if (!session) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  session.revoked = true;
  await session.save();
  res.clearCookie("refreshToken");
  return res.status(200).json({
    message: "Logged out successfully",
  });
}

export async function logoutAll(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  await sessionModel.updateMany(
    {
      user: decoded.id,
      refreshToken: refreshTokenHash,
      revoked: false,
    },
    {
      revoked: true,
    },
  );
  res.clearCookie("refreshToken");
  return res.status(200).json({
    message: "Logged out from all sessions successfully",
  });
}


export async function verifyEmail(req,res){
const {otp,email}=req.body
if(!otp||!email){
    return res.status(400).json({message:"All fields are required"})    

}
const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
const otpRecord = await otpModel.findOne({
    email,
    otpHash     
})
if(!otpRecord){
    return res.status(400).json({message:"Invalid OTP"})
}
const user = await userModel.findByIdAndUpdate(otpRecord.user,{verified:true})
await otpModel.deleteMany({
    user:otpRecord.user

})
return res.status(200).json({message:"Email verified successfully",
    username:user.username,
    email:user.email,   
    verified:user.verified

})
}