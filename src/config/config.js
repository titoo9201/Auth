import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URI || !process.env.PORT) {
  throw new Error("Missing required environment variables please check your .env file");
}
if(!process.env.JWT_SECRET) {
  throw new Error("missing required environment variable JWT_SECRET PLEASE CHECK YOUR .ENV FILE")
}
const config = {
  MONGO_URI: process.env.MONGO_URI ,
  PORT: process.env.PORT ,
  JWT_SECRET: process.env.JWT_SECRET
};

export default config;