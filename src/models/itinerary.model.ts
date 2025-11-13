import mongoose, { type InferSchemaType, model } from "mongoose";

const itinerarySchema = new mongoose.Schema({
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScheduleItem",
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export type Itinerary = InferSchemaType<typeof itinerarySchema> & {
  _id: mongoose.Types.ObjectId;
};

const itineraryModel = model<Itinerary>("Itinerary", itinerarySchema);
export default itineraryModel;
