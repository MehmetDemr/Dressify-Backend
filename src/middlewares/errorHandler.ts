import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error." });
};
