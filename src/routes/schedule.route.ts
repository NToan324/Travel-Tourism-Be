import { Router } from "express";

import scheduleController from "@/controllers/schedule.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
import { ScheduleValidation } from "@/validations/schedule.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validationRequest(ScheduleValidation.create()),
  asyncHandler(scheduleController.create)
);

router.get("/", authenticate, asyncHandler(scheduleController.getAll));

router.get(
  "/:id",
  authenticate,
  validationRequest(ScheduleValidation.idParam()),
  asyncHandler(scheduleController.getById)
);

router.put(
  "/:id",
  authenticate,
  validationRequest(ScheduleValidation.update()),
  asyncHandler(scheduleController.update)
);

router.delete(
  "/:id",
  authenticate,
  validationRequest(ScheduleValidation.idParam()),
  asyncHandler(scheduleController.delete)
);

export default router;
