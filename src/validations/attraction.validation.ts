import { z } from "zod";

import { PLACE } from "@/constants";

const sectionSchema = z.object({
  title: z.string().nonempty("Section title is required"),
  content: z.string().nonempty("Section content is required"),
  images: z.array(z.string().url()).optional(),
});

export class PlaceValidation {
  static create() {
    return {
      body: z.object({
        type: z.nativeEnum(PLACE),
        city_id: z.string().nonempty("City ID is required"),
        name: z.string().nonempty("Name is required"),
        description: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
        opening_hours: z.string().optional(),
        sections: z.array(sectionSchema).optional(),

        // FOOD FIELDS
        price_range: z.string().optional(),
        menu: z
          .array(
            z.object({
              item: z.string().nonempty("Menu item name is required"),
              price: z.string().nonempty("Menu item price is required"),
            }),
          )
          .optional(),
        specialties: z.array(z.string()).optional(),

        // FESTIVAL FIELDS
        event_date: z.string().optional(),
        event_location: z.string().optional(),

        // RELATED POSTS
        related_posts: z.array(z.string()).optional(),
      }),
    };
  }

  static update() {
    return {
      body: z.object({
        type: z.nativeEnum(PLACE).optional(),
        city_id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        image_urls: z.array(z.string().url()).optional(),
        opening_hours: z.string().optional(),
        sections: z.array(sectionSchema).optional(),
        price_range: z.string().optional(),

        menu: z
          .array(
            z.object({
              item: z.string().optional(),
              price: z.string().optional(),
            }),
          )
          .optional(),

        specialties: z.array(z.string()).optional(),

        event_date: z.string().optional(),
        event_location: z.string().optional(),

        related_posts: z.array(z.string()).optional(),
      }),

      params: z.object({
        id: z.string().nonempty("Place ID is required"),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string().nonempty("Place ID is required"),
      }),
    };
  }
}
