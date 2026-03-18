import colors from "../utils/log-colors.js";
import config from "./env.js";
import redis from "./redis.js";
import { getIO } from "./socket.js";

interface DocumentEvent {
  type: string;
  documentId: string;
  userId: string;
  status: string;
}

const startEventBridge = async () => {
  const sub = redis.duplicate();

  sub.on("message", (channel, message) => {
    if (config.nodeEnv === "development") {
      console.log("=".repeat(50));
      console.log(
        colors.yellow,
        "Event received on channel:",
        channel,
        message,
        colors.reset,
      );
      console.log("=".repeat(50) + "\n");
    }

    if (!message) return;

    try {
      const event: DocumentEvent = JSON.parse(message);
      const io = getIO();
      io.to(event.userId).emit(event.type, {
        documentId: event.documentId,
        status: event.status,
      });
    } catch (err) {
      console.error("Failed to parse document event:", err);
    }
  });

  await sub.subscribe("document-events", (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log("=".repeat(50));
      console.log(
        `${colors.yellow}Subscribed to ${colors.green}${count} ${colors.yellow}channel(s)${colors.reset}`,
      );
      console.log("=".repeat(50) + "\n");
    }
  });
};

export default startEventBridge;
