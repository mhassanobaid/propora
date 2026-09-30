import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.model.js";

interface JwtPayload {
  id: string;
}

export const isAuthenticatedUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies || {};

    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401),
      );
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = user;

    next();
  },
);
