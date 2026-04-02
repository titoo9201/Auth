import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URI || !process.env.PORT) {
  throw new Error("Missing required environment variables please check your .env file");
}
if(!process.env.JWT_SECRET) {
  throw new Error("missing required environment variable JWT_SECRET PLEASE CHECK YOUR .ENV FILE")
}
if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN || !process.env.GOOGLE_USER) {
  throw new Error("Missing required Google OAuth environment variables please check your .env file");
}

const config = {
  MONGO_URI: process.env.MONGO_URI ,
  PORT: process.env.PORT ,
  JWT_SECRET: process.env.JWT_SECRET ,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN ,
  GOOGLE_USER: process.env.GOOGLE_USER
};

export default config;