import { Request, Response } from "express";
import { IDocument } from "../models/Document.js";
import {
  createDocumentService,
  deleteDocumentByIdService,
  getAllDocumentsService,
  getDocumentByIdService,
  getDocumentsByUserPaginatedService,
  updateDocumentService,
} from "../services/document.service.js";
import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import AppError from "../utils/app-error.js";

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
  try {
    const userId = req.user?.sub;

    // Check if user is authenticated
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const data: Partial<IDocument> = {
      ...req.body,
      user: req.user.sub,
    };

    const document = await createDocumentService(data);

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: document,
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
  } catch (error: unknown) {
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

    const documents = await getDocumentsByUserPaginatedService(
      userId,
      page,
      limit,
    );

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
