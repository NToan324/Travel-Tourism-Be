import { Router } from "express";

import authController from "@/controllers/auth.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { AuthValidation } from "@/validations/auth.validation";

const router = Router();

router.post(
  "/login",
  validationRequest(AuthValidation.login()),
  asyncHandler(authController.login)
);

router.post(
  "/signup",
  validationRequest(AuthValidation.signup()),
  asyncHandler(authController.signUp)
);

router.post(
  "/refresh-token",
  authenticate,
  asyncHandler(authController.refreshToken)
);

export default router;
