import { Router } from "express";

import festivalController from "@/controllers/festival.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { FestivalValidation } from "@/validations/festival.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(FestivalValidation.create()),
  asyncHandler(festivalController.create)
);

router.get("/", asyncHandler(festivalController.getAll));

router.get(
  "/:id",
  validationRequest(FestivalValidation.idParam()),
  asyncHandler(festivalController.getById)
);

router.put(
  "/:id",
  authenticate,
  validationRequest(FestivalValidation.update()),
  asyncHandler(festivalController.update)
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(FestivalValidation.idParam()),
  asyncHandler(festivalController.delete)
);

export default router;
