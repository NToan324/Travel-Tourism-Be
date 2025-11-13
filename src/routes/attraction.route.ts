import { Router } from "express";

import attractionController from "@/controllers/attraction.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { AttractionValidation } from "@/validations/attraction.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(AttractionValidation.create()),
  asyncHandler(attractionController.create)
);

router.get("/", asyncHandler(attractionController.getAll));

router.get(
  "/:id",
  validationRequest(AttractionValidation.idParam()),
  asyncHandler(attractionController.getById)
);

router.put(
  "/:id",
  authenticate,
  validationRequest(AttractionValidation.update()),
  asyncHandler(attractionController.update)
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(AttractionValidation.idParam()),
  asyncHandler(attractionController.delete)
);

export default router;
