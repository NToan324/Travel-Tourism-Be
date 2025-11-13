import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
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
});

citySchema.plugin(mongoosePaginate);

export type City = InferSchemaType<typeof citySchema> & {
  _id: mongoose.Types.ObjectId;
};

const cityModel = model<City>("City", citySchema);
export default cityModel;
