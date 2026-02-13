import config from "./config/env";
import app from "./app";
import colors from "./utils/log-colors";

app.listen(config.port, () => {
  console.log("=".repeat(50));
  console.log(
    `${colors.green}ZenithDocs server listening on port ${config.port} ${colors.reset}`,
  );
  console.log("=".repeat(50));
});
