import cloudinary from "@/configs/cloudinary.config";
import path from "path";

export class Cloudinary {
  static async uploadImage(filePath: string) {
    try {
      const result = await cloudinary.uploader.upload(filePath);
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new Error("Failed to upload image to Cloudinary");
    }
  }
  static async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error("Failed to delete image from Cloudinary");
    }
  }
  static async deleteImages(publicIds: string[]) {
    try {
      await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    } catch (error) {
      throw new Error("Failed to delete images from Cloudinary");
    }
  }
  static async updateImage(filePath: string, publicId: string) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new Error("Failed to update image on Cloudinary");
    }
  }

  static async uploadFile(filePath: string) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'raw',
        folder: 'documents',
        use_filename: true,
        unique_filename: true
      });

      const fileFormat = path.extname(filePath).replace('.', '');

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: fileFormat || "unknown",
        original_filename: result.original_filename
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Failed to upload file to Cloudinary");
    }
  }

  static async deleteFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
    } catch (error) {
      throw new Error("Failed to delete file from Cloudinary");
    }
  }
}
