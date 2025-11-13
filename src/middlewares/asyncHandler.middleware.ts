import { type NextFunction, type Request, type Response } from "express";

export const asyncHandler = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown> | void,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
