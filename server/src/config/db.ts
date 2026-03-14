import mongoose from "mongoose";
import config from "./env.js";
import colors from "../utils/log-colors.js";

// Main DB — local in dev, Atlas in prod
export const mainDB = mongoose.createConnection(
  config.database.mongoURI || "mongodb://127.0.0.1:27017/zenithdocs",
  {
    dbName: config.nodeEnv === "development" ? "zenithdocs-dev" : "zenithdocs",
  },
);

// Vector DB — always Atlas regardless of environment
export const vectorDB = mongoose.createConnection(
  config.database.mongoAtlasURI,
  {
    dbName: config.nodeEnv === "development" ? "zenithdocs-dev" : "zenithdocs",
  },
);

const connectDB = async () => {
  try {
    // Main connection
    await mainDB.asPromise();
    console.log("=".repeat(50));
    console.log(
      `${colors.green}Main MongoDB Connected: ${colors.reset}${mainDB.host}`,
    );
    console.log("=".repeat(50) + "\n");

    // Vector connection
    await vectorDB.asPromise();
    console.log("=".repeat(50));
    console.log(
      `${colors.green}Vector MongoDB (Atlas) Connected: ${colors.reset}${vectorDB.host}`,
    );
    console.log("=".repeat(50) + "\n");
  } catch (error: unknown) {
    const err = error as Error;
    console.error(
      `${colors.red}MongoDB Connection Error: ${colors.reset}${err.message}`,
    );
    process.exit(1);
  }
};

export default connectDB;
