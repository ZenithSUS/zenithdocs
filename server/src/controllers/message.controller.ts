import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {
  deleteMessagesByChatIdAndUserService,
  getMessagesByChatIdPaginatedService,
} from "../services/message.service.js";
import AppError from "../utils/app-error.js";

interface MessageParams extends ParamsDictionary {
  id: string;
}

/**
 * Get messages by chat id
 * @route GET /api/messages/chat/:id
 */
export const getMessagesByChatIdPaginatedController = async (
  req: Request<MessageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const messages = await getMessagesByChatIdPaginatedService(id, page, limit);

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete messages by chat id
 * @route DELETE /api/messages/chat/:id
 */
export const deleteMessagesByChatIdAndUserController = async (
  req: Request<MessageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    const messages = await deleteMessagesByChatIdAndUserService(
      id,
      currentUserId,
    );

    return res.status(200).json({
      success: true,
      message: "Messages deleted successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
