import { Router } from "express";

import userController from "@/controllers/user.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { UserValidation } from "@/validations/user.validation";

const router = Router();

router.put(
  "/profile",
  authenticate,
  validationRequest(UserValidation.updateUserInfo()),
  asyncHandler(userController.updateProfile)
);

export default router;
