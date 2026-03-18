import app from "./app.js";
import config from "./config/env.js";
import colors from "./utils/log-colors.js";
import connectDB from "./config/db.js";

import { createServer } from "http";
import { initSocket } from "./config/socket.js";
import startEventBridge from "./config/event-listener.js";

const httpServer = createServer(app);
initSocket(httpServer, config.server.allowedOrigins.split(","));

await startEventBridge();

connectDB();

// Start Server
httpServer.listen(Number(config.server.port), "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log(
    `${colors.green}ZenithDocs server listening on port ${config.server.port}${colors.reset}`,
  );
  console.log(`${colors.blue}Socket.IO ready${colors.reset}`);
  console.log("=".repeat(50) + "\n");
});
