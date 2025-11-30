import mongoose, { type InferSchemaType, model } from "mongoose";

import { tourismDbConnection } from "@/dbs/init.mongodb";

const weatherSummarySchema = new mongoose.Schema({
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  avg_temp: {
    type: Number,
    default: null,
  },
  condition: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
});

export type WeatherSummary = InferSchemaType<typeof weatherSummarySchema> & {
  _id: mongoose.Types.ObjectId;
};

const weatherSummaryModel = tourismDbConnection.model<WeatherSummary>(
  "WeatherSummary",
  weatherSummarySchema,
  "weathersummaries",
);
export default weatherSummaryModel;
