import { Router } from "express";

import foodController from "@/controllers/food.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { FoodValidation } from "@/validations/food.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(FoodValidation.create()),
  asyncHandler(foodController.create)
);

router.get("/", asyncHandler(foodController.getAll));

router.get(
  "/city/:id",
  validationRequest(FoodValidation.idParam()),
  asyncHandler(foodController.getByCityId)
);

router.get(
  "/:id",
  validationRequest(FoodValidation.idParam()),
  asyncHandler(foodController.getById)
);

router.put(
  "/:id",
  authenticate,
  validationRequest(FoodValidation.update()),
  asyncHandler(foodController.update)
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(FoodValidation.idParam()),
  asyncHandler(foodController.delete)
);

export default router;
