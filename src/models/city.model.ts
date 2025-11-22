import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { tourismDbConnection } from "@/dbs/init.mongodb";

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

const cityModel = tourismDbConnection.model<City>("City", citySchema, "cities");
export default cityModel;
