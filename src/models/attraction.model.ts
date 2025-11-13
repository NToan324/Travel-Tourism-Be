import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
});

attractionSchema.plugin(mongoosePaginate);

export type Attraction = InferSchemaType<typeof attractionSchema> & {
  _id: mongoose.Types.ObjectId;
};

const attractionModel = model<Attraction>("Attraction", attractionSchema);
export default attractionModel;
