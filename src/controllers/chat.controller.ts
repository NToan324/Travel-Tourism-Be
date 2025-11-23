import type { Request, Response } from "express";

import chatService from "@/services/chat.service";

class ChatController {
  async getChatHistory(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const { id: userId } = req.user!;
    res.status(200).send(
      await chatService.getChatHistory({
        userId,
        page: Number(page),
        limit: Number(limit),
      })
    );
  }

  async getChatBySessionId(req: Request, res: Response) {
    const { sessionId } = req.params;
    const { id: userId } = req.user!;
    res.status(200).send(
      await chatService.getChatBySessionId({
        userId,
        sessionId,
      })
    );
  }
}

const chatController = new ChatController();
export default chatController;
