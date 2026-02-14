import mongoose from "mongoose";
import config from "./env";
import colors from "../utils/log-colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.database.mongoURI || "mongodb://127.0.0.1:27017/zenithdocs",
    );

    console.log("=".repeat(50));
    console.log(
      `${colors.green}MongoDB Connected Host: ${colors.reset}${conn.connection.host}`,
    );
    console.log("=".repeat(50));
  } catch (error: unknown) {
    const err = error as Error;
    console.error(
      `${colors.red}MongoDB Connection Error: ${colors.reset}${err.message}`,
    );
    process.exit(1); // Exit Process with Failure
  }
};

export default connectDB;
