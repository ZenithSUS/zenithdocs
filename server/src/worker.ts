import connectDB from "./config/db.js";

import "./models/user.model.js";
import "./models/document.model.js";
import "./models/folder.model.js";
import "./queues/embedding.worker.js";

import colors from "./utils/log-colors.js";

console.log("=".repeat(50));
console.log(`${colors.green}Worker started!${colors.green}${colors.reset}`);
console.log("=".repeat(50) + "\n");

await connectDB();
