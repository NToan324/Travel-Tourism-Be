import { z } from "zod";

const sectionSchema = z.object({
  title: z.string().nonempty("Section title is required"),
  content: z.string().nonempty("Section content is required"),
  images: z.array(z.string().url()).optional(),
});

export class FoodValidation {
  static create() {
    return {
      body: z.object({
        city_id: z.string().nonempty("City ID is required"),
        name: z.string().nonempty("Food name is required"),
        description: z.string().optional(),
        type: z.string().optional(),
        address: z.string().optional(),
        price_range: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
        sections: z.array(sectionSchema).optional(),
      }),
    };
  }

  static update() {
    return {
      params: z.object({
        id: z.string().nonempty("Food ID is required"),
      }),
      body: z.object({
        city_id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        address: z.string().optional(),
        price_range: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),

        sections: z.array(sectionSchema).optional(),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("Food ID is required"),
      }),
    };
  }
}
