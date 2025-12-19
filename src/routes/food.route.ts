import { Router } from "express";

import foodController from "@/controllers/food.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { FoodValidation } from "@/validations/food.validation";
import verifyRole from "@/middlewares/verifyRoles.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  verifyRole(['admin']),
  validationRequest(FoodValidation.create()),
  asyncHandler(foodController.create),
);

router.get("/", asyncHandler(foodController.getAll));

router.get(
  "/city/:id",
  validationRequest(FoodValidation.idParam()),
  asyncHandler(foodController.getByCityId),
);

router.get(
  "/:id",
  validationRequest(FoodValidation.idParam()),
  asyncHandler(foodController.getById),
);

router.put(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(FoodValidation.update()),
  asyncHandler(foodController.update),
);

router.delete(
  "/:id",
  authenticate,
  verifyRole(['admin']),
  validationRequest(FoodValidation.idParam()),
  asyncHandler(foodController.delete),
);

export default router;
