import { Router } from "express";

import chatController from "@/controllers/chat.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";

const router = Router();

router.get(
  "/history",
  authenticate,
  asyncHandler(chatController.getChatHistory)
);

router.get(
  "/:sessionId",
  authenticate,
  asyncHandler(chatController.getChatBySessionId)
);

export default router;
