import { z } from "zod";

import { PLACE } from "@/constants";

const ActivitySchema = z.object({
  time_start: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time_start format (HH:MM)"),
  time_end: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time_end format (HH:MM)"),
  description: z.string().nonempty("Description is required"),
  type: z.nativeEnum(PLACE),
});

const ItinerarySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().nonempty("Title is required"),
  activities: z
    .array(ActivitySchema)
    .min(1, "Each day must have at least one activity"),
});

const WeatherSummarySchema = z.object({
  avg_temp: z.number().optional(),
  condition: z.string({ message: "Condition is required" }).optional(),
  notes: z.string().optional(),
});

const AccommodationSchema = z.object({
  name: z.string().nonempty(),
  address: z.string().nonempty(),
  price_range: z.string().nonempty(),
  notes: z.string().optional(),
});

export class ScheduleValidation {
  static create() {
    return {
      body: z.object({
        trip_id: z.string().nonempty("Trip ID is required"),
        trip_cover_image: z.string().optional(),

        location: z.string().nonempty("Location is required"),
        duration_days: z.number().int().positive("Duration must be positive"),

        start_date: z.coerce.date(),
        end_date: z.coerce.date(),

        weather_summary: WeatherSummarySchema.optional(),

        accommodation: AccommodationSchema.optional(),

        itinerary: z
          .array(ItinerarySchema)
          .min(1, "At least one itinerary day is required"),

        tips: z.array(z.string()).optional(),
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
        trip_cover_image: z.string().optional(),

        tips: z.array(z.string()).optional(),

        weather_summary: WeatherSummarySchema.optional(),

        accommodation: AccommodationSchema.optional(),

        itinerary: z.array(ItinerarySchema).optional(),
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

  static CalendarEventSchema = z.object({
    summary: z.string().nonempty("Summary is required"),
    location: z.string().nonempty("Location is required"),
    description: z.string().nonempty("Description is required"),

    start: z.object({
      dateTime: z.string().datetime({
        offset: true,
        message: "start.dateTime must be ISO datetime with timezone (Z)",
      }),
      timeZone: z.string().nonempty("start.timeZone is required"),
    }),

    end: z.object({
      dateTime: z.string().datetime({
        offset: true,
        message: "end.dateTime must be ISO datetime with timezone (Z)",
      }),
      timeZone: z.string().nonempty("end.timeZone is required"),
    }),
  });

  static createEvents() {
    return {
      body: z
        .array(this.CalendarEventSchema)
        .nonempty("At least one event is required"),
    };
  }
}
