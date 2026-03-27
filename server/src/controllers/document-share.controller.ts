import { Request, Response, NextFunction } from "express";
import { IDocumentShareInput } from "../models/DocumentShare.js";
import {
  createDocumentShareService,
  deleteDocumentShareService,
  getDocumentShareByIdService,
  getDocumentShareByTokenService,
  getDocumentSharesByUserPaginatedService,
  updateDocumentShareService,
} from "../services/document-share.service.js";
import { ParamsDictionary } from "express-serve-static-core";

interface DocumenShareParams extends ParamsDictionary {
  id: string;
  token: string;
}

/**
 * Create a new document share
 * @route POST /document-shares
 */
export const createDocumentShareController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: IDocumentShareInput = req.body;

    const documentShare = await createDocumentShareService(data);

    return res.status(201).json({
      success: true,
      message: "Document share created successfully",
      data: documentShare,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a document share by token (Public share)
 * @route GET /document-shares/token/:token
 */
export const getDocumentShareByTokenController = async (
  req: Request<DocumenShareParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;

    const documentShare = await getDocumentShareByTokenService(token, req);

    return res.status(200).json({
      success: true,
      message: "Document share fetched successfully",
      data: documentShare,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a document share by id (Private share)
 * @route GET /document-shares/:id
 */
export const getDocumentShareByIdController = async (
  req: Request<Pick<DocumenShareParams, "id">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;

    const documentShare = await getDocumentShareByIdService(id, userId, req);

    return res.status(200).json({
      success: true,
      message: "Document share fetched successfully",
      data: documentShare,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all document shares by user id in a paginated manner
 * @route GET /document-shares/user/:id
 */
export const getDocumentSharesByUserIdPaginatedController = async (
  req: Request<DocumenShareParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { id: userId } = req.params;

    const documentShares = await getDocumentSharesByUserPaginatedService(
      userId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Document shares fetched successfully",
      data: documentShares,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a document share
 * @route PUT /document-shares/:id
 */
export const updateDocumentShareController = async (
  req: Request<Pick<DocumenShareParams, "id">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data: Partial<IDocumentShareInput> = req.body;

    const userId = req.user.sub;

    const documentShare = await updateDocumentShareService(id, userId, data);

    return res.status(200).json({
      success: true,
      message: "Document share updated successfully",
      data: documentShare,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a document share
 * @route DELETE /document-shares/:id
 */
export const deleteDocumentShareController = async (
  req: Request<Pick<DocumenShareParams, "id">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;

    const documentShare = await deleteDocumentShareService(id, userId);

    return res.status(200).json({
      success: true,
      message: "Document share deleted successfully",
      data: documentShare,
    });
  } catch (error) {
    next(error);
  }
};
