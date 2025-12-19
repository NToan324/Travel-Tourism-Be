import { Router } from "express";

import placeController from "@/controllers/place.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { PlaceValidation } from "@/validations/attraction.validation";
import verifyRole from "@/middlewares/verifyRoles.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  verifyRole(['admin']),
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
  verifyRole(['admin']),
  validationRequest(PlaceValidation.update()),
  asyncHandler(placeController.update),
);

router.delete(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(PlaceValidation.idParam()),
  asyncHandler(placeController.delete),
);

export default router;
