import type { JwtPayload } from "jsonwebtoken";
import type { Server } from "socket.io";

declare global {
  var _io: Server | undefined;

  namespace Express {
    interface Request {
      jwtDecoded: JwtPayload;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
      post?: {
        validatedQuery: {
          page: number;
          limit: number;
          order: "asc" | "desc";
        };
      };
      user?: {
        id: string;
        email: string;
        fullName: string;
        role: "user" | "admin";
      };
    }
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: string;
    email: string;
    fullName: string;
    role: "user" | "admin";
  }
}
