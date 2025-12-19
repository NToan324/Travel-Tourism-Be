import { Router } from "express";

import accommodationController from "@/controllers/accommodation.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { AccommodationValidation } from "@/validations/accommodation.validation";
import verifyRole from "@/middlewares/verifyRoles.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  verifyRole(['admin']),
  validationRequest(AccommodationValidation.create()),
  asyncHandler(accommodationController.create),
);

router.get("/", asyncHandler(accommodationController.getAll));

router.get(
  "/:id",
  validationRequest(AccommodationValidation.idParam()),
  asyncHandler(accommodationController.getById),
);

router.put(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(AccommodationValidation.update()),
  asyncHandler(accommodationController.update),
);

router.delete(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(AccommodationValidation.idParam()),
  asyncHandler(accommodationController.delete),
);

export default router;
