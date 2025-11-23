import { Router } from "express";

import authController from "@/controllers/auth.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { AuthValidation } from "@/validations/auth.validation";

const router = Router();

router.get("/me", authenticate, asyncHandler(authController.getMe));

router.post(
  "/login",
  validationRequest(AuthValidation.login()),
  asyncHandler(authController.login),
);

router.post(
  "/forgot-password",
  validationRequest(AuthValidation.forgotPassword()),
  asyncHandler(authController.forgotPassword),
);

router.post(
  "/resend-otp",
  validationRequest(AuthValidation.resendOtp()),
  asyncHandler(authController.resendOtp),
);

router.post(
  "/verify-otp",
  validationRequest(AuthValidation.verifyOtp()),
  asyncHandler(authController.verifyOtp),
);

router.post(
  "/reset-password",
  validationRequest(AuthValidation.resetPassword()),
  asyncHandler(authController.resetPassword),
);

router.post(
  "/signup",
  validationRequest(AuthValidation.signup()),
  asyncHandler(authController.signUp),
);

router.post(
  "/refresh-token",
  authenticate,
  asyncHandler(authController.refreshToken),
);

export default router;
