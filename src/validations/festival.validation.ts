import { z } from "zod";

export class FestivalValidation {
  static create() {
    return {
      body: z.object({
        city_id: z.string().nonempty("City ID is required"),
        name: z.string().nonempty("Festival name is required"),
        description: z.string().optional(),
        start_date: z.coerce.date({
          required_error: "Start date is required",
          invalid_type_error: "Start date must be a valid date",
        }),
        end_date: z.coerce.date({
          required_error: "End date is required",
          invalid_type_error: "End date must be a valid date",
        }),
        image_urls: z.array(z.string().url()).optional(),
      }),
    };
  }

  static update() {
    return {
      params: z.object({
        id: z.string().nonempty("Festival ID is required"),
      }),
      body: z.object({
        city_id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        start_date: z.coerce.date().optional(),
        end_date: z.coerce.date().optional(),
        image_urls: z.array(z.string().url()).optional(),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("Festival ID is required"),
      }),
    };
  }
}
