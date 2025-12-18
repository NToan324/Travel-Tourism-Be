import fs from "fs";

import { CreatedResponse } from "@/core/success.response";
import { Cloudinary } from "@/helpers/cloudinary";
import { BadRequestError, InternalServerError } from "@/core/error.response";

class UploadService {
  static async uploadImage(image: string, public_id?: string) {
    let uploadedImage;
    if (!public_id) {
      uploadedImage = await Cloudinary.uploadImage(image);
    } else {
      uploadedImage = await Cloudinary.updateImage(image, public_id);
    }
    fs.unlinkSync(image);
    return new CreatedResponse("Tải ảnh lên thành công", uploadedImage);
  }

  static async uploadMultiImages(files: Express.Multer.File[]) {
    const uploadedImages = [];

    for (const file of files) {
      const uploadedImage = await Cloudinary.uploadImage(file.path);
      uploadedImages.push(uploadedImage);

      fs.unlinkSync(file.path);
    }

    return new CreatedResponse("Tải ảnh lên thành công", uploadedImages);
  }

  static async uploadDocument(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("Vui lòng chọn file tài liệu!");
    }

    // Mảng các mimetype cho phép
    const ALLOWED_MIMES = [
      'text/plain',                                                                // .txt
      'application/pdf',                                                           // .pdf
      'application/msword',                                                        // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
      'application/vnd.ms-excel',                                                  // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',         // .xlsx
      'text/csv'                                                                   // .csv
    ];

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      // Xóa file tạm nếu sai định dạng để tránh rác server
      fs.unlinkSync(file.path);
      throw new BadRequestError("Định dạng file không hỗ trợ. Chỉ chấp nhận .txt, .pdf, .docx, .xlsx");
    }

    try {
      // 2. Gọi Helper upload lên Cloudinary (Raw)
      const uploadedDoc = await Cloudinary.uploadFile(file.path);

      // 3. Xóa file tạm trên ổ cứng server
      fs.unlinkSync(file.path);

      return new CreatedResponse("Tải tài liệu lên thành công", {
        ...uploadedDoc,
        file_name: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
      });

    } catch (error) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new InternalServerError("Tải tài liệu lên thất bại");
    }
  }
}

const uploadService = UploadService;
export default uploadService;
