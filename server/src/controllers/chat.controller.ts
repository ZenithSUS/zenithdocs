import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";
import { streamDocumentChatWithContextService } from "../lib/mistral/services/document-chat.service.js";
import {
  getChatByDocumentService,
  getChatByUserPaginatedService,
  initChatForDocumentService,
} from "../services/chat.service.js";
import { ParamsDictionary } from "express-serve-static-core";
import { streamDocumentPublicChatService } from "../lib/mistral/services/document-public-chat-service.js";

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
    const currentUserId = req.user.sub;

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
 * Chat with a public document
 * @route POST /api/chat/public
 */
export const chatPublicController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { question, shareToken, history } = req.body;

    const data = {
      question,
      shareToken,
      history,
      res,
    };

    await streamDocumentPublicChatService(data);
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
    const currentUserId = req.user.sub;

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
