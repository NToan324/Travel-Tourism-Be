import { z } from "zod";

export class AccommodationValidation {
  static create() {
    return {
      body: z.object({
        city_id: z.string().nonempty("City ID is required"),
        name: z.string().nonempty("Accommodation name is required"),
        description: z.string().optional(),
        type: z.string().optional(),
        address: z.string().optional(),
        price_range: z.string().optional(),
        ratings: z.number().min(0).max(5).optional(),
        image_urls: z.array(z.string().url()).optional(),
      }),
    };
  }

  static update() {
    return {
      params: z.object({
        id: z.string().nonempty("Accommodation ID is required"),
      }),
      body: z.object({
        city_id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        address: z.string().optional(),
        price_range: z.string().optional(),
        ratings: z.number().min(0).max(5).optional(),
        image_urls: z.array(z.string().url()).optional(),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("Accommodation ID is required"),
      }),
    };
  }
}
