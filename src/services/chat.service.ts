import { BadRequestError } from "@/core/error.response";
import { OkResponse } from "@/core/success.response";
import chatSessionModel from "@/models/chat_sessions.model";
import scheduleModel from "@/models/schedule.model";
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

    async getChatBySessionId({ userId, sessionId, page = 1, limit = 10 }: { userId: string; sessionId: string; page?: number; limit?: number }) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new BadRequestError("Invalid User ID format");
            }

            const skip = (page - 1) * limit;

            const result = await chatSessionModel.aggregate([
                {
                    $match: {
                        session_id: sessionId,
                        user_id: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $project: {
                        session_id: 1,
                        totalMessages: { $size: "$messages" },
                        messages: {
                            $slice: [
                                { $reverseArray: "$messages" },
                                skip,
                                limit
                            ]
                        }
                    }
                }
            ]);

            const session = result[0];

            if (!session) {
                throw new BadRequestError("Session not found");
            }

            const tripIds = session.messages
                .map((msg: any) => msg.trip_id)
                .filter((id: any) => id);
                        
            let schedulesMap = new Map();

            if (tripIds.length > 0) {
                const schedules = await scheduleModel.find({
                    trip_id: { $in: tripIds }
                }).lean();

                schedules.forEach((schedule: any) => {
                    const key = schedule.trip_id.toString();
                    schedulesMap.set(key, schedule);
                });
            }
            
            const orderedMessages = session.messages.reverse();

            const enrichedMessages = orderedMessages.map((msg: any) => {
                let tripDetails = null;

                if (msg.trip_id) {
                    const key = msg.trip_id.toString();
                    tripDetails = schedulesMap.get(key) || null;
                }

                return {
                    ...msg,
                    trip_details: tripDetails
                };
            });

            return new OkResponse("Get chat by session ID successfully", {
                docs:
                {
                    session_id: session.session_id,
                    messages: enrichedMessages,
                },
                pagination: {
                    totalDocs: session.totalMessages,
                    page,
                    limit,
                    totalPages: Math.ceil(session.totalMessages / limit),
                },
            });

        } catch (error) {
            console.error("Error getting messages by session ID:", error);
            throw new BadRequestError("Failed to get messages by session ID");
        }
    }
}

const chatService = new ChatService();
export default chatService;