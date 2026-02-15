import { NextFunction, Request, Response } from "express";

// Middleware to check if the user is authorized to access this resource
const authorizeSelf = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  // Check if the user is authorized to access this resource
  if (user.sub !== id && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource",
    });
  }

  next();
};

export default authorizeSelf;
