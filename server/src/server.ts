import app from "./app.js";
import config from "./config/env.js";
import colors from "./utils/log-colors.js";
import connectDB from "./config/db.js";

// Connect to MongoDB
connectDB();

// Start the server
app.listen(config.server.port, () => {
  console.log("=".repeat(50));
  console.log(
    `${colors.green}ZenithDocs server listening on port ${config.server.port} ${colors.reset}`,
  );
  console.log("=".repeat(50));
});
