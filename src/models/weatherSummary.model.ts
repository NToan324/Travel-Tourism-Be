import mongoose, { type InferSchemaType, model } from "mongoose";

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

const weatherSummaryModel = model<WeatherSummary>(
  "WeatherSummary",
  weatherSummarySchema
);
export default weatherSummaryModel;
