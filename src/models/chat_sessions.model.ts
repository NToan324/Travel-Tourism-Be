import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {chatDbConnection} from "@/dbs/init.mongodb";

// Schema con cho từng tin nhắn trong mảng messages
const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["human", "ai"],
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

// Schema chính cho Chat Session
const chatSessionSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: {
        type: [messageSchema],
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

chatSessionSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

chatSessionSchema.plugin(mongoosePaginate);

export type ChatSession = InferSchemaType<typeof chatSessionSchema> & {
    _id: mongoose.Types.ObjectId;
};

// const chatSessionModel = model<ChatSession>("ChatSession", chatSessionSchema);
const chatSessionModel = chatDbConnection.model<ChatSession>("ChatSession", chatSessionSchema, "chat_sessions");
export default chatSessionModel;