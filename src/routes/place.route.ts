import { Router } from "express";

import placeController from "@/controllers/place.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { PlaceValidation } from "@/validations/attraction.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(PlaceValidation.create()),
  asyncHandler(placeController.create),
);

router.get("/relevant", asyncHandler(placeController.getRelevantPlaces));

router.get("/", asyncHandler(placeController.getAll));

router.get(
  "/city/:id",
  validationRequest(PlaceValidation.idParam()),
  asyncHandler(placeController.getByCityId),
);

router.get(
  "/:id",
  validationRequest(PlaceValidation.idParam()),
  asyncHandler(placeController.getById),
);

router.put(
  "/:id",
  authenticate,
  validationRequest(PlaceValidation.update()),
  asyncHandler(placeController.update),
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(PlaceValidation.idParam()),
  asyncHandler(placeController.delete),
);

export default router;
