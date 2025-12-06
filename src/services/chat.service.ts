import mongoose from "mongoose";

import { BadRequestError } from "@/core/error.response";
import { OkResponse } from "@/core/success.response";
import chatSessionModel from "@/models/chat_sessions.model";
import scheduleModel from "@/models/schedule.model";

class ChatService {
  async getChatHistory({
    userId,
    page = 1,
    limit = 10,
    search,
  }: {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
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

    const session = await chatSessionModel
      .findOne({
        session_id: sessionId,
        user_id: new mongoose.Types.ObjectId(userId),
      })
      .lean();

    if (!session) {
      throw new BadRequestError("Session not found");
    }

    const tripIds = session.messages
      .map((msg) => msg.trip_id)
      .filter((id) => id);

    const schedulesMap = new Map();

    if (tripIds.length > 0) {
      const schedules = await scheduleModel
        .find({
          trip_id: { $in: tripIds },
        })
        .lean();

      schedules.forEach((schedule) => {
        const key = schedule.trip_id.toString();
        schedulesMap.set(key, schedule);
      });
    }

    const enrichedMessages = session.messages.map((msg) => {
      let tripDetails = null;

      if (msg.trip_id) {
        const key = msg.trip_id.toString();
        tripDetails = schedulesMap.get(key) || null;
      }

      return {
        ...msg,
        trip_details: tripDetails,
      };
    });

    return new OkResponse("Get chat by session ID successfully", {
      session_id: session.session_id,
      messages: enrichedMessages,
    });
  }

  async deleteChatSessionById({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) {
    const result = await chatSessionModel.deleteOne({
      session_id: sessionId,
      user_id: new mongoose.Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new BadRequestError("Session not found or already deleted");
    }

    return new OkResponse("Chat session deleted successfully", {
      sessionId,
    });
  }
}

const chatService = new ChatService();
export default chatService;
