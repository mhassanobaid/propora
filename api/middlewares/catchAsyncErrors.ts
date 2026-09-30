import type { NextFunction, Request, Response } from "express";

type AsyncController<TRequest extends Request = Request> = (
  req: TRequest,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const catchAsyncErrors = <TRequest extends Request = Request>(theFunc: AsyncController<TRequest>,) => (
  req: TRequest,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

export default catchAsyncErrors;