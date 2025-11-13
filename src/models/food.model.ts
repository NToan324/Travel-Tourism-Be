import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePagination from "mongoose-paginate-v2";

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

const foodSchema = new mongoose.Schema({
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

  image_urls: {
    type: [String],
    default: [],
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

foodSchema.plugin(mongoosePagination);

export type Food = InferSchemaType<typeof foodSchema> & {
  _id: mongoose.Types.ObjectId;
};

const foodModel = model<Food>("Food", foodSchema);
export default foodModel;
