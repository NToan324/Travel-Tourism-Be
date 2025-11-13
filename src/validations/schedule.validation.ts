import { z } from "zod";

export class ScheduleValidation {
  static create() {
    return {
      body: z.object({
        user_id: z.string().nonempty("User ID is required"),
        trip_id: z.string().nonempty("Trip ID is required"),
        location: z.string().nonempty("Location is required"),
        duration_days: z.number().int().positive("Duration must be positive"),
        start_date: z.coerce.date(),
        end_date: z.coerce.date(),
        accommodation_id: z.string().optional(),
        tips: z.array(z.string()).optional(),
        weather_summary: z.object({
          city_id: z.string().nonempty("City ID is required"),
          avg_temp: z.number().optional(),
          condition: z.string().optional(),
          notes: z.string().optional(),
        }),
        itineraries: z
          .array(
            z.object({
              day: z.number().int().positive(),
              title: z.string().nonempty(),
            })
          )
          .min(1, "At least one itinerary is required"),
      }),
    };
  }

  static update() {
    return {
      params: z.object({
        id: z.string().nonempty("Schedule ID is required"),
      }),
      body: z.object({
        location: z.string().optional(),
        duration_days: z.number().int().positive().optional(),
        start_date: z.coerce.date().optional(),
        end_date: z.coerce.date().optional(),
        tips: z.array(z.string()).optional(),
        itineraries: z
          .array(
            z.object({
              day: z.number().int().positive(),
              title: z.string(),
            })
          )
          .optional(),
        weather_summary: z
          .object({
            avg_temp: z.number().optional(),
            condition: z.string().optional(),
            notes: z.string().optional(),
          })
          .optional(),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("Schedule ID is required"),
      }),
    };
  }
}
