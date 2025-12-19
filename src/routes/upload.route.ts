import { Router } from "express";

import { uploadDisk } from "@/configs/multer.config";
import uploadController from "@/controllers/upload.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import verifyRole from "@/middlewares/verifyRoles.middleware";

const router = Router();

router.post(
  "/multiple",
  authenticate,
  uploadDisk.array("files", 10),
  asyncHandler(uploadController.uploadMultiImages),
);

router.post(
  "/",
  authenticate,
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadImage),
);

router.post(
  "/document",
  authenticate,
  verifyRole(['admin']),
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadDocument),
);

export default router;
