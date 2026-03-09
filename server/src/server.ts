import app from "./app.js";
import config from "./config/env.js";
import colors from "./utils/log-colors.js";
import connectDB from "./config/db.js";

// Socket IO Server
import { createServer } from "http";
import { initSocket } from "./config/socket.js";

const httpServer = createServer(app);
initSocket(httpServer, config.server.allowedOrigins.split(","));

// Connect to MongoDB
connectDB();

const originalWarn = console.warn.bind(console);
const originalInfo = console.info.bind(console);

console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("TT:")) return;
  originalWarn(...args);
};

console.info = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("TT:")) return;
  originalInfo(...args);
};

// Start the HTTP server
httpServer.listen(config.server.port, () => {
  console.log("=".repeat(50));
  console.log(
    `${colors.blue}ZenithDocs Socket server listening on port ${config.server.port} ${colors.reset}`,
  );
  console.log("=".repeat(50));
});

// Start the server
app.listen(config.server.port, () => {
  console.log("=".repeat(50));
  console.log(
    `${colors.green}ZenithDocs server listening on port ${config.server.port} ${colors.reset}`,
  );
  console.log("=".repeat(50));
});
