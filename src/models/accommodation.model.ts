import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const accommodationSchema = new mongoose.Schema({
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
  type: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  price_range: {
    type: String,
    default: "",
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image_urls: {
    type: [String],
    default: [],
  },
});

accommodationSchema.plugin(mongoosePaginate);

export type Accommodation = InferSchemaType<typeof accommodationSchema> & {
  _id: mongoose.Types.ObjectId;
};

const accommodationModel = model<Accommodation>(
  "Accommodation",
  accommodationSchema
);
export default accommodationModel;
