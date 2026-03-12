import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";
import { streamDocumentUserChat } from "../lib/mistral/services/document-global-user-chat.service.js";
import {
  deleteGlobalChatByUserService,
  getGlobalChatByUserService,
  initGlobalChatService,
} from "../services/global-chat.service.js";
import { ParamsDictionary } from "express-serve-static-core";

interface GlobalChatParams extends ParamsDictionary {
  id: string;
}

/**
 * Initialize global chat controller
 * @route POST /api/global-chats/init
 */
export const initGlobalChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.sub;
    const role = req.user?.role;

    if (!userId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    const globalGhat = await initGlobalChatService(userId);

    return res.status(200).json({
      success: true,
      message: "Global chat initialized successfully",
      data: globalGhat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Global chat controller
 * @route POST /api/global-chats
 */
export const globalChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { question } = req.body;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    await streamDocumentUserChat({ userId: user.sub, question, res });
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.end();
    }
  }
};

/**
 * Get global chat by user ID
 * @route GET /api/global-chats/user/:id
 */
export const getGlobalChatByUserController = async (
  req: Request<GlobalChatParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    const userId = req.params.id;
    const globalChat = await getGlobalChatByUserService(userId, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Global chat fetched successfully",
      data: globalChat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete global chat by user ID
 * @route DELETE /api/global-chats/user/:id
 */
export const deleteGlobalChatByUserController = async (
  req: Request<GlobalChatParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    const { id: userId } = req.params;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    await deleteGlobalChatByUserService(userId, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Global chat deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
