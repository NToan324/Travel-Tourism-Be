import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { ForbiddenError, UnauthorizedError } from "@/core/error.response";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.DEV_JWT_SECRET_KEY as string);
    if (!decoded) {
      return next(new ForbiddenError("Forbidden"));
    }

    const request = req;

    request.user = decoded as JwtPayload;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return next(new UnauthorizedError("Unauthorized"));
  }
};
