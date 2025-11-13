import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const festivalSchema = new mongoose.Schema({
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
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  image_urls: {
    type: [String],
    default: [],
  },
});

festivalSchema.plugin(mongoosePaginate);

export type Festival = InferSchemaType<typeof festivalSchema> & {
  _id: mongoose.Types.ObjectId;
};

const festivalModel = model<Festival>("Festival", festivalSchema);
export default festivalModel;
