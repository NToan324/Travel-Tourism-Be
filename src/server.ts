import "@/dbs/init.mongodb";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Express } from "express";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";

import appConfig from "@/configs/app.config";
import { corsConfig } from "@/configs/cors.config";
import ErrorHandling from "@/middlewares/errorHandling.middleware";
import router from "@/routes";
import SocketInstance from "@/services/socket.instance";
import SocketService from "@/services/socket.service";

dotenv.config();

class Server {
  app: Express;
  server: HttpServer;
  io: SocketServer;

  constructor() {
    this.app = express();
    this.server = new HttpServer((req, res) => this.app(req, res));
    this.io = new SocketServer(this.server, { cors: { origin: "*" } });

    SocketInstance.init(this.io);

    this.setupApplication();
    this.setupSocket();
  }

  private setupApplication() {
    this.configureMiddlewares();
    this.customMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares() {
    this.app.use(cors(corsConfig));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(morgan("short"));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private customMiddleware() {
    // this.app.use(pushLogToDiscord);
  }

  private configureRoutes() {
    this.app.use("/api/v1", router);
  }

  private configureErrorHandling() {
    this.app.use(ErrorHandling.notFoundError);
    this.app.use(ErrorHandling.globalError);
  }

  private setupSocket() {
    const socketService = new SocketService(this.io);
    socketService.setupListeners();
  }

  start() {
    const PORT = appConfig.app.port;
    const HOST_ADDRESS = appConfig.app.host;

    this.server.listen(PORT, () => {
      console.log(
        `[Server] Running at [http://${HOST_ADDRESS}:${PORT}/api/v1]`
      );
    });
  }
}

const server = new Server();
server.start();

// Graceful Shutdown Handling
process.on("SIGINT", () => {
  console.log("[Process terminated]");
  server.server.close(() => process.exit(0));
});
