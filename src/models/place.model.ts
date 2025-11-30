import mongoose, { type InferSchemaType, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { PLACE } from "@/constants";
import { tourismDbConnection } from "@/dbs/init.mongodb";

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

const placeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: PLACE,
    required: true,
  },

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

  price_range: {
    type: String,
    default: "",
  },

  menu: {
    type: [
      {
        item: String,
        price: String,
      },
    ],
    default: [],
  },

  specialties: {
    type: [String],
    default: [],
  },

  event_date: {
    type: String,
    default: "",
  },

  event_location: {
    type: String,
    default: "",
  },

  related_posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
  ],

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});

placeSchema.plugin(mongoosePaginate);

export type Place = InferSchemaType<typeof placeSchema> & {
  _id: mongoose.Types.ObjectId;
};

const placeModel = tourismDbConnection.model<Place>(
  "Place",
  placeSchema,
  "places"
);
export default placeModel;
