import { z } from "zod";

export class CityValidation {
  static create() {
    return {
      body: z.object({
        name: z.string().nonempty("City name is required"),
        country: z.string().nonempty("Country is required"),
        description: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
      }),
    };
  }

  static update() {
    return {
      body: z.object({
        name: z.string().optional(),
        country: z.string().optional(),
        description: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
      }),
      params: z.object({
        id: z.string().nonempty("City ID is required"),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("City ID is required"),
      }),
    };
  }
}
