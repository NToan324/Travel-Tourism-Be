import { type NextFunction, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

import { type CustomError, NotFoundError } from "@/core/error.response";

export default class ErrorHandling {
  static notFoundError(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError());
  }

  static globalError(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status,
      message: err.message || "Internal server error",
    });
  }
}
