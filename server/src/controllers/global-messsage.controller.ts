import { NextFunction } from "connect";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {
  deleteGlobalMessagesByChatAndUserIdService,
  getGlobalMessagesByChatIdPaginatedService,
} from "../services/global-message.service.js";
import AppError from "../utils/app-error.js";

interface GlobalMessageParams extends ParamsDictionary {
  id: string;
}

/**
 * Get global messages by chat ID
 * @route GET /api/global-messages/chat/:id
 */
export const getGlobalMessagesByChatIdPaginatedController = async (
  req: Request<GlobalMessageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const globalMessages = await getGlobalMessagesByChatIdPaginatedService(
      id,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: globalMessages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete global messages by chat ID and user ID
 * @route DELETE /api/global-messages/chat/:id
 */
export const deleteGlobalMessagesByChatAndUserIdController = async (
  req: Request<GlobalMessageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.sub;
    const role = req.user?.role;

    const { id: chatId } = req.params;

    if (!userId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    const globalMessages = await deleteGlobalMessagesByChatAndUserIdService(
      chatId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Global messages deleted successfully",
      data: globalMessages,
    });
  } catch (error) {
    next(error);
  }
};
