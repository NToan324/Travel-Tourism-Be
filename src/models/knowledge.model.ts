import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { tourismDbConnection } from "@/dbs/init.mongodb";

const knowledgeSchema = new mongoose.Schema({
    file_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    file_name: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: false,
    },
    mime_type: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['excel', 'document'],
        required: true,
    },
    metadata: {
        topic: { type: String, default: null },
        location: { type: String, default: null },
        source: { type: String, default: null },
        _id: false,
        default: {},
    },
    status: {
        type: String,
        enum: ['uploaded', 'syncing', 'synced', 'error'],
        default: 'uploaded',
    },
}, { timestamps: true});

knowledgeSchema.plugin(mongoosePaginate);

export type Knowledge = InferSchemaType<typeof knowledgeSchema> & {
  _id: mongoose.Types.ObjectId;
};

const knowledgeModel = tourismDbConnection.model<Knowledge>("Knowledge", knowledgeSchema, "knowledges");
export default knowledgeModel;
