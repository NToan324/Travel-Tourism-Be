import { Router } from "express";

import festivalController from "@/controllers/festival.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { FestivalValidation } from "@/validations/festival.validation";
import verifyRole from "@/middlewares/verifyRoles.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  verifyRole(['admin']),
  validationRequest(FestivalValidation.create()),
  asyncHandler(festivalController.create),
);

router.get("/", asyncHandler(festivalController.getAll));

router.get(
  "/:id",
  validationRequest(FestivalValidation.idParam()),
  asyncHandler(festivalController.getById),
);

router.put(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(FestivalValidation.update()),
  asyncHandler(festivalController.update),
);

router.delete(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(FestivalValidation.idParam()),
  asyncHandler(festivalController.delete),
);

export default router;
