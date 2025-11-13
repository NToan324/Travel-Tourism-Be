import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
});

const attractionSchema = new mongoose.Schema({
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image_urls: {
    type: [String],
    default: [],
  },
  opening_hours: {
    type: String,
    default: "",
  },
  sections: {
    type: [sectionSchema],
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

attractionSchema.plugin(mongoosePaginate);

export type Attraction = InferSchemaType<typeof attractionSchema> & {
  _id: mongoose.Types.ObjectId;
};

const attractionModel = model<Attraction>("Attraction", attractionSchema);
export default attractionModel;
