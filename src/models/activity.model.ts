import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const activitySchema = new mongoose.Schema({
  itinerary_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
    required: true,
  },
  time_start: {
    type: String,
    required: true,
  },
  time_end: {
    type: String,
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
});

activitySchema.plugin(mongoosePaginate);

export type Activity = InferSchemaType<typeof activitySchema> & {
  _id: mongoose.Types.ObjectId;
};

const activityModel = model<Activity>("Activity", activitySchema);
export default activityModel;
