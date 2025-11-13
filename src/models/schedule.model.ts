import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// ───────────────── Sub-schemas ─────────────────

// Activity trong từng ngày
const activitySchema = new mongoose.Schema(
  {
    time_start: {
      type: String, // "HH:MM"
      required: true,
    },
    time_end: {
      type: String, // "HH:MM"
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Food", "Attraction", "Accommodation", "Festival", "Transport"],
      required: true,
    },
  },
  { _id: false }
);

// Itinerary cho từng ngày
const itineraryDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  { _id: false }
);

// Weather summary embed
const weatherSummarySchema = new mongoose.Schema(
  {
    avg_temp: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Accommodation embed
const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    price_range: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// ───────────────── Main Schedule schema ─────────────────

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

  // Match format bạn đưa
  location: {
    type: String,
    required: true,
  },
  duration_days: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date, // sẽ được serialize thành ISO 8601 khi trả về JSON
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },

  weather_summary: {
    type: weatherSummarySchema,
    required: false, // cho phép null nếu chưa có dữ liệu thời tiết
  },

  itinerary: {
    type: [itineraryDaySchema],
    default: [],
  },

  accommodation: {
    type: accommodationSchema,
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
