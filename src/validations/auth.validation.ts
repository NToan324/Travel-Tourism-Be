import { z } from "zod";

export class AuthValidation {
  static signup() {
    return {
      body: z.object({
        fullName: z.string().nonempty("Full name is required"),
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

  static forgotPassword() {
    return {
      body: z.object({
        email: z
          .string()
          .nonempty("Email is required")
          .email("Invalid email format"),
      }),
    };
  }

  static resendOtp() {
    return {
      body: z.object({
        userId: z.string().nonempty("User ID is required"),
      }),
    };
  }

  static verifyOtp() {
    return {
      body: z.object({
        userId: z.string().nonempty("User ID is required"),
        otp: z.string().nonempty("OTP is required"),
      }),
    };
  }

  static resetPassword() {
    return {
      body: z.object({
        resetToken: z.string().nonempty("Token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      }),
    };
  }
}
