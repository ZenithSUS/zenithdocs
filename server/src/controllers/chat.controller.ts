import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";
import { streamDocumentChatWithContextService } from "../lib/mistral/document-chat.service.js";
import {
  getChatByDocumentService,
  getChatByUserPaginatedService,
  initChatForDocumentService,
} from "../services/chat.service.js";
import { ParamsDictionary } from "express-serve-static-core";

interface DocumentParams extends ParamsDictionary {
  id: string;
}

/**
 * Init chat for document
 * @route GET /api/chats/document/:id/init
 */
export const initChatForDocumentController = async (
  req: Request<DocumentParams>,
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

    const chat = await initChatForDocumentService(id, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Chat initialized successfully",
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Chat with a document
 * @route POST /api/chat
 */
export const chatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    const { question, documentId } = req.body;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!question || !documentId) {
      throw new AppError("Missing question or documentId", 400);
    }

    const data = {
      question,
      documentId,
      userId: user.sub,
      role: user.role,
      res,
    };

    await streamDocumentChatWithContextService(data);
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.end();
    }
  }
};

/**
 * Get chat by document ID
 * @route GET /api/chats/document/:id
 */
export const getChatByDocumentController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || !role) {
      throw new AppError("Unauthorized", 401);
    }

    const chat = await getChatByDocumentService(id, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get paginated chat by user ID
 * @route GET /api/chats/user/:id
 */
export const getChatByUserPaginatedController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || !role) {
      throw new AppError("Unauthorized", 401);
    }

    const chats = await getChatByUserPaginatedService(id, page, limit);

    return res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};
