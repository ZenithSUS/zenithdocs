import connectDB from "./config/db.js";

import "./models/User.js";
import "./models/Document.js";
import "./models/Folder.js";

import { warmOcr } from "./lib/extract-text.js";
import colors from "./utils/log-colors.js";

console.log("=".repeat(50));
console.log(`${colors.green}Worker started!${colors.green}${colors.reset}`);
console.log("=".repeat(50) + "\n");

await connectDB();

console.log("=".repeat(50));
console.log("[ocr] warming up tesseract...");
await warmOcr();
console.log("[ocr] tesseract ready");
console.log("=".repeat(50) + "\n");

// Start accepting jobs only after Tesseract is warm
await import("./queues/embedding.worker.js");
