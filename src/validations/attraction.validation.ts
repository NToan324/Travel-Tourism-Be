import { z } from "zod";

export class AttractionValidation {
  static create() {
    return {
      body: z.object({
        city_id: z.string().nonempty("City ID is required"),
        name: z.string().nonempty("Attraction name is required"),
        description: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
        opening_hours: z.string().optional(),
      }),
    };
  }

  static update() {
    return {
      body: z.object({
        city_id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
        opening_hours: z.string().optional(),
      }),
      params: z.object({
        id: z.string().nonempty("Attraction ID is required"),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("Attraction ID is required"),
      }),
    };
  }
}
