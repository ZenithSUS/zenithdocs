import { NextFunction, Request, Response } from "express";
import colors from "../utils/log-colors.js";

interface ExtendedResponse extends Response {
  responseData?: any;
}

function getStatusColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) {
    return colors.green; // Success
  } else if (statusCode >= 300 && statusCode < 400) {
    return colors.cyan; // Redirect
  } else if (statusCode >= 400 && statusCode < 500) {
    return colors.yellow; // Client error
  } else if (statusCode >= 500) {
    return colors.red; // Server error
  }
  return colors.white; // Default
}

function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return colors.blue;
    case "POST":
      return colors.green;
    case "PUT":
      return colors.yellow;
    case "PATCH":
      return colors.magenta;
    case "DELETE":
      return colors.red;
    default:
      return colors.white;
  }
}

function logger(req: Request, res: ExtendedResponse, next: NextFunction) {
  const startTime = Date.now();

  // Log request with colored method
  const methodColor = getMethodColor(req.method);
  console.log(
    `${methodColor}${colors.bright}${req.method}${colors.reset} ` +
      `${colors.reset}${req.protocol}://${req.hostname}${colors.reset}` +
      `${colors.cyan}${req.url}${colors.reset}`,
  );

  // Log body
  if (
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length > 0
  ) {
    console.log(
      `${colors.dim}Body:${colors.reset} ${JSON.stringify(req.body)}`,
    );
  }

  // Log query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(
      `${colors.dim}Query:${colors.reset} ${JSON.stringify(req.query)}`,
    );
  }

  // Log route parameters
  if (req.params && Object.keys(req.params).length > 0) {
    console.log(
      `${colors.dim}Params:${colors.reset} ${JSON.stringify(req.params)}`,
    );
  }

  // Store original methods
  const originalJson = res.json;
  const originalSend = res.send;

  // Override res.json
  res.json = function (body: Body) {
    res.responseData = body;
    return originalJson.call(this, body);
  };

  // Override res.send
  res.send = function (body: Body) {
    res.responseData = body;
    return originalSend.call(this, body);
  };

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor = getStatusColor(res.statusCode);

    console.log(
      `${statusColor}${colors.bright}${res.statusCode}${colors.reset} ` +
        `${colors.reset}${res.statusMessage || ""}${colors.reset} ` +
        `${colors.reset}(${duration}ms)${colors.reset}`,
    );

    // Log response
    // if (res.responseData !== undefined) {
    //   console.log(`${colors.dim}Response:${colors.reset} ${JSON.stringify(res.responseData)}`);
    // }

    // Log separator
    console.log(colors.reset + "=".repeat(50) + colors.reset + "\n");
  });

  next();
}

export default logger;
