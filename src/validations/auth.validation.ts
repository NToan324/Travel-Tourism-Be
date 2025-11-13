import { z } from "zod";

export class AuthValidation {
  static signup() {
    return {
      body: z.object({
        email: z
          .string()
          .nonempty("Email is required")
          .email("Invalid email format"),
        password: z
          .string()
          .nonempty("Password is required")
          .min(6, "Password must be at least 6 characters"),
      }),
    };
  }

  static login() {
    return {
      body: z.object({
        email: z
          .string()
          .nonempty("Email is required")
          .email("Invalid email format"),
        password: z
          .string()
          .nonempty("Password is required")
          .min(6, "Password must be at least 6 characters"),
      }),
    };
  }
}
