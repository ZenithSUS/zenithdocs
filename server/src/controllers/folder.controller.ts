import { NextFunction, Request, Response } from "express";
import {
  createFolderService,
  deleteFolderService,
  getAllFoldersAdminService,
  getFolderByIdService,
  getFolderByNameService,
  getFoldersByUserService,
  updateFolderService,
} from "../services/folder.service.js";
import { IFolder } from "../models/Folder.js";
import { ParamsDictionary } from "express-serve-static-core";
import { getFoldersByUserPaginated } from "../repositories/folder.repository.js";
import AppError from "../utils/app-error.js";

interface FolderParams extends ParamsDictionary {
  id: string;
}

/**
 * Creates a new folder
 * @route POST /api/folders
 */
export const createFolderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: Partial<IFolder> = req.body;
    const currentUserId = req.user?.sub;

    if (!currentUserId) {
      throw new AppError("Unauthorized", 401);
    }

    const folder = await createFolderService(data, currentUserId);

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all folders (admin only)
 *  @route GET /api/folders/admin
 */
export const getAllFoldersAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const folders = await getAllFoldersAdminService();

    return res.status(200).json({
      success: true,
      message: "Folders fetched successfully",
      data: folders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get folders by user ID
 * @route GET /api/folders/user/:id
 */
export const getFoldersByUserController = async (
  req: Request<FolderParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    const folders = await getFoldersByUserService(userId);

    return res.status(200).json({
      success: true,
      message: "Folders fetched successfully",
      data: folders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get folder by Name
 * @route GET /api/folders/name/:name
 */
export const getFolderByNameController = async (
  req: Request<{ name: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.params;

    const folder = await getFolderByNameService(name);

    return res.status(200).json({
      success: true,
      message: "Folder fetched successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get folder by ID
 * @route GET /api/folders/:id
 */
export const getFolderByIdController = async (
  req: Request<FolderParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const folder = await getFolderByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Folder fetched successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get folders by user ID with pagination
 * @route GET /api/folders/user/:id/paginated
 */
export const getFolderByUserPaginatedController = async (
  req: Request<FolderParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const folder = await getFoldersByUserPaginated(id, page, limit);

    return res.status(200).json({
      success: true,
      message: "Folder fetched successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update folder by ID
 * @route PUT /api/folders/:id
 */
export const updateFolderController = async (
  req: Request<FolderParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    const data: Partial<IFolder> = req.body;

    if (!currentUserId || !role) {
      throw new AppError("Unauthorized", 401);
    }

    const folder = await updateFolderService(id, data, currentUserId, role);

    return res.status(200).json({
      success: true,
      message: "Folder updated successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

/** * Delete folder by ID
 * @route DELETE /api/folders/:id
 */
export const deleteFolderController = async (
  req: Request<FolderParams>,
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

    const folder = await deleteFolderService(id, currentUserId, role);

    return res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};
