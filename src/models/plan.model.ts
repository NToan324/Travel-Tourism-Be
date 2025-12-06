import mongoose, { type InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { tourismDbConnection } from "@/dbs/init.mongodb";

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    is_completed: {
      type: Boolean,
      default: false,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan_type: {
      type: String,
      enum: ["yearly", "monthly", "travel", "personal"],
      default: "yearly",
    },
  },
  {
    timestamps: true,
  }
);

planSchema.plugin(mongoosePaginate);

export type Plan = InferSchemaType<typeof planSchema> & {
  _id: mongoose.Types.ObjectId;
};

const planModel = tourismDbConnection.model<Plan>("Plan", planSchema, "plans");
export default planModel;
