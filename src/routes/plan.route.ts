import { Router } from "express";

import planController from "@/controllers/plan.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { PlanValidation } from "@/validations/plan.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(PlanValidation.create()),
  asyncHandler(planController.create)
);

router.get("/", authenticate, asyncHandler(planController.getAllByUser));

/* GET PLAN BY ID */
router.get(
  "/:id",
  authenticate,
  validationRequest(PlanValidation.idParam()),
  asyncHandler(planController.getById)
);

/* UPDATE PLAN */
router.put(
  "/:id",
  authenticate,
  validationRequest(PlanValidation.update()),
  asyncHandler(planController.update)
);

/* MARK AS COMPLETED / UNCOMPLETED */
router.patch(
  "/:id/toggle",
  authenticate,
  validationRequest(PlanValidation.idParam()),
  asyncHandler(planController.toggleStatus)
);

/* DELETE PLAN */
router.delete(
  "/:id",
  authenticate,
  validationRequest(PlanValidation.idParam()),
  asyncHandler(planController.delete)
);

export default router;
