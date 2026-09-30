import type { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.js";

interface ErrorWithDetails extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
}

const errorMiddleware = (
  err: ErrorWithDetails,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue ?? {})} Entered`;
    err = new ErrorHandler(message, 409);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, Try again";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is Expired, Try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode ?? 500).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;