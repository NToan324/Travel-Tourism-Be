import { BadRequestError } from "@/core/error.response";
import { OkResponse } from "@/core/success.response";
import chatSessionModel from "@/models/chat_sessions.model";
import mongoose from "mongoose";

class ChatService {
    async getChatHistory({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new BadRequestError("Invalid User ID format");
            }

            // Tìm kiếm tất cả các session của user
            const sessions = await chatSessionModel
                .find({
                    user_id: new mongoose.Types.ObjectId(userId)
                })
                .sort({ updated_at: -1 })
                .lean().paginate({ page, limit });

            return new OkResponse("Get chat history successfully", {
                docs: sessions.docs,
                pagination: {
                    totalDocs: sessions.totalDocs,
                    limit: sessions.limit,
                    page: sessions.page,
                    totalPages: sessions.totalPages,
                },
            });

        } catch (error) {
            console.error("Error getting chat history:", error);
            throw new BadRequestError("Failed to get chat history");
        }
    
    }
}

const chatService = new ChatService();
export default chatService;