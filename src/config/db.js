import mongoose from "mongoose";
import config from"./config.js"

async function connectDB()
{
    const mongoUri = config.MONGO_URI;

    try {
        await mongoose.connect(mongoUri);
        console.log("database connected successfully");
    } catch (error) {
        console.error("database connection failed:", error.message);
        throw error;
    }
}


export default connectDB