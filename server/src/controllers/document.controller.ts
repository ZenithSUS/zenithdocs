import fs from "fs";
import { promisify } from "util";
import { Request, Response } from "express";
import { IDocument } from "../models/Document.js";
import {
  createDocumentService,
  deleteDocumentByIdService,
  getAllDocumentsService,
  getDocumentByIdService,
  getDocumentsByUserPaginatedService,
  getDocumentsByUserWithChatsPaginatedService,
  reprocessDocumentService,
  updateDocumentService,
} from "../services/document.service.js";
import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import AppError from "../utils/app-error.js";
import cloudinary, { uploadToCloudinary } from "../lib/cloudinary.service.js";
import extractRawText from "../lib/extract-text.js";
import mongoose from "mongoose";
import { embeddingQueue } from "../queues/embedding.queue.js";

const unlink = promisify(fs.unlink);

interface DocumentParams extends ParamsDictionary {
  id: string;
}

/**
 * Creates a new document
 * @route POST /api/documents
 */
export const createDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let uploadedPublicId: string | null = null;
  const tempFilePath = req.file?.path;

  try {
    const userId = req.user?.sub;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!req.file || !tempFilePath) throw new AppError("File is required", 400);

    if (req.file.size > 10 * 1024 * 1024) {
      await unlink(tempFilePath).catch(() => {});
      throw new AppError("File size must be less than 10MB", 400);
    }

    const data: Partial<IDocument> = req.body;

    const rawText = await extractRawText(tempFilePath, req.file.mimetype);

    const { url, publicId } = await uploadToCloudinary(
      tempFilePath,
      req.file.originalname,
      userId,
    );
    uploadedPublicId = publicId;

    const finalData: Partial<IDocument> = {
      ...data,
      user: new mongoose.Types.ObjectId(userId),
      title: data.title || req.file.originalname,
      fileUrl: url,
      fileType: req.file.mimetype.split("/")[1],
      fileSize: req.file.size,
      rawText,
      publicId,
    };

    const document = await createDocumentService(finalData);

    await unlink(tempFilePath).catch(() => {});

    await embeddingQueue.add(
      "embedding",
      { documentId: document._id.toString(), userId: document.user.toString() },
      {
        attempts: 1,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: document,
    });
  } catch (error) {
    // Delete the uploaded file from Cloudinary when error occurs
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId, {
        resource_type: "raw",
      });
    }

    if (tempFilePath) await unlink(tempFilePath).catch(() => {});
    next(error);
  }
};

/**
 * Reprocess uploaded or Failed document
 * @route POST /api/documents/:id/reprocess
 */
export const reprocessDocumentController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: documentId } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    await reprocessDocumentService(documentId, currentUserId);

    return res.status(200).json({
      success: true,
      message: "Document reprocessed started",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all documents
 * @route GET /api/documents/admin
 */
export const getAllDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const documents = await getAllDocumentsService();

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get documents by user ID
 * @route GET /api/documents/user/:id
 */
export const getDocumentsByUserPaginatedController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const includeChats = req.query.includeChats === "true";

    const documents = includeChats
      ? await getDocumentsByUserWithChatsPaginatedService(userId, page, limit)
      : await getDocumentsByUserPaginatedService(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get document by ID
 * @route GET /api/documents/:id
 */
export const getDocumentByIdController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    // Check if user is authenticated
    if (!currentUserId || !role) {
      throw new AppError("Unauthorized", 401);
    }

    const document = await getDocumentByIdService(id, currentUserId, role);

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update document by ID
 * @route PUT /api/documents/:id
 */
export const updateDocumentController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    // Check if user is authenticated
    if (!currentUserId || !role) {
      throw new AppError("Unauthorized", 401);
    }

    const data: Partial<IDocument> = {
      ...req.body,
      user: req.user.sub,
    };

    const document = await updateDocumentService(id, data, currentUserId, role);

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete document by ID
 * @route DELETE /api/documents/:id
 */
export const deleteDocumentByIdController = async (
  req: Request<DocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    // Check if user is authenticated
    if (!currentUserId || !role) {
      throw new AppError("Unauthorized", 401);
    }

    const document = await deleteDocumentByIdService(id, currentUserId, role);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};
