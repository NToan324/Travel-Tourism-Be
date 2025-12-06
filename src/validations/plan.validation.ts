import { z } from "zod";

export class PlanValidation {
  static create() {
    return {
      body: z.object({
        title: z.string().min(1),
        plan_type: z.string().optional(),
      }),
    };
  }

  static update() {
    return {
      body: z.object({
        title: z.string().optional(),
        is_completed: z.boolean().optional(),
        plan_type: z.string().optional(),
      }),
      params: z.object({
        id: z.string(),
      }),
    };
  }

  static idParam() {
    return {
      params: z.object({
        id: z.string(),
      }),
    };
  }
}
