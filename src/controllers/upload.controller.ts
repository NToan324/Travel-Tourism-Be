import type { Request, Response } from "express";

import uploadService from "@/services/upload.service";

class UploadController {
  async uploadImage(req: Request, res: Response) {
    const image = req.file?.path as string;
    res.status(200).send(await uploadService.uploadImage(image));
  }

  // Tải lên ảnh avatar
  async uploadMultiImages(req: Request, res: Response) {
    const files = req?.files as Express.Multer.File[];
    const uploaded = await uploadService.uploadMultiImages(files);
    res.status(200).send(uploaded);
  }
}
const uploadController = new UploadController();
export default uploadController;
