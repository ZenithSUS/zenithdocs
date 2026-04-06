import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error.js";
import { getDocumentById } from "../repositories/document.repository.js";
import { getDocumentShareByDocumentId } from "../repositories/document-share.repository.js";

interface ValidateDocumentParams {
  id?: string;
  documentId?: string;
}

const validateDocument = async (
  req: Request<ValidateDocumentParams>,
  res: Response,
  next: NextFunction,
) => {
  const documentId = req.params.id ?? req.body.documentId;
  const userId = req.user.sub;

  const document = await getDocumentById(documentId);

  if (!document) {
    return next(new AppError("Document not found", 404));
  }

  if (document.status !== "completed") {
    return next(new AppError("Document processing is not completed", 400));
  }

  if (document.user._id.toString() === userId) {
    return next();
  }

  const share = await getDocumentShareByDocumentId(documentId);

  if (!share || !share.isActive) {
    return next(new AppError("Access denied", 403));
  }

  if (share.expiresAt && share.expiresAt < new Date()) {
    return next(new AppError("Share link has expired", 403));
  }

  if (share.type === "private") {
    const isAllowed = share.allowedUsers?.some(
      (u) => u.userId.toString() === userId,
    );

    if (!isAllowed) {
      return next(new AppError("Access denied", 403));
    }
  }

  next();
};

export default validateDocument;
