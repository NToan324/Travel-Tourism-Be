import { Router } from "express";

import cityController from "@/controllers/city.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { CityValidation } from "@/validations/city.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(CityValidation.create()),
  asyncHandler(cityController.create)
);

router.get("/", asyncHandler(cityController.getAll));

router.get(
  "/:id",
  validationRequest(CityValidation.idParam()),
  asyncHandler(cityController.getById)
);

router.put(
  "/:id",
  authenticate,
  validationRequest(CityValidation.update()),
  asyncHandler(cityController.update)
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(CityValidation.idParam()),
  asyncHandler(cityController.delete)
);

export default router;
