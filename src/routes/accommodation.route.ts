import { Router } from "express";

import accommodationController from "@/controllers/accommodation.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { AccommodationValidation } from "@/validations/accommodation.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(AccommodationValidation.create()),
  asyncHandler(accommodationController.create)
);

router.get("/", asyncHandler(accommodationController.getAll));

router.get(
  "/:id",
  validationRequest(AccommodationValidation.idParam()),
  asyncHandler(accommodationController.getById)
);

router.put(
  "/:id",
  authenticate,
  validationRequest(AccommodationValidation.update()),
  asyncHandler(accommodationController.update)
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(AccommodationValidation.idParam()),
  asyncHandler(accommodationController.delete)
);

export default router;
