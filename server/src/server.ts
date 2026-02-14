import config from "./config/env";
import app from "./app";
import colors from "./utils/log-colors";
import connectDB from "./config/db";

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
