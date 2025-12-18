import { Router } from "express";

import { uploadDisk } from "@/configs/multer.config";
import uploadController from "@/controllers/upload.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";

const router = Router();

router.post(
  "/multiple",
  uploadDisk.array("files", 10),
  asyncHandler(uploadController.uploadMultiImages),
);

router.post(
  "/",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadImage),
);

router.post(
  "/document",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadDocument),
);

export default router;
