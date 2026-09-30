import type { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const catchAsyncErrors = (theFunc: AsyncController) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

export default catchAsyncErrors;