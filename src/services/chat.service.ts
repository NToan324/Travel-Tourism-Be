import mongoose from "mongoose";

import { BadRequestError } from "@/core/error.response";
import { OkResponse } from "@/core/success.response";
import chatSessionModel from "@/models/chatSessions.model";

class ChatService {
  async getChatHistory({
    userId,
    page = 1,
    limit = 10,
  }: {
    userId: string;
    page?: number;
    limit?: number;
  }) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError("Invalid User ID format");
    }

    const sessions = await chatSessionModel
      .find({
        user_id: new mongoose.Types.ObjectId(userId),
      })
      .lean()
      .paginate({ page, limit, sort: { updated_at: -1 } });

    if (!sessions) {
      throw new BadRequestError("No chat sessions found for this user");
    }

    return new OkResponse("Get chat history successfully", {
      docs: sessions.docs,
      pagination: {
        totalDocs: sessions.totalDocs,
        limit: sessions.limit,
        page: sessions.page,
        totalPages: sessions.totalPages,
        nextPage: sessions.nextPage,
      },
    });
  }

  async getChatBySessionId({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError("Invalid User ID format");
    }

    const result = await chatSessionModel.aggregate([
      {
        $match: {
          session_id: sessionId,
          user_id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          session_id: 1,
          _id: 0,
          totalMessages: { $size: "$messages" },
          messages: "$messages",
        },
      },
    ]);

    const session = result[0];

    if (!session) {
      throw new BadRequestError("Session not found");
    }

    return new OkResponse("Get chat by session ID successfully", {
      session_id: session.session_id,
      messages: session.messages,
    });
  }
}

const chatService = new ChatService();
export default chatService;
