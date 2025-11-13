import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const scheduleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  trip_id: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  duration_days: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  weather_summary_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WeatherSummary",
    required: false,
  },
  accommodation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodation",
    required: false,
  },
  tips: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

scheduleSchema.plugin(mongoosePaginate);

export type Schedule = InferSchemaType<typeof scheduleSchema> & {
  _id: mongoose.Types.ObjectId;
};

const scheduleModel = model<Schedule>("Schedule", scheduleSchema);
export default scheduleModel;
