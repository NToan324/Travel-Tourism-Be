import { Router } from "express";

import knowledgeController from "@/controllers/knowledge.controller";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validationRequest } from "@/middlewares/validationRequest.middleware";
// Giả định bạn sẽ tạo file validation tương ứng (tôi có code gợi ý bên dưới)
import { KnowledgeValidation } from "@/validations/knowledge.validation";
import verifyRole from "@/middlewares/verifyRoles.middleware";

const router = Router();

// Tạo mới (Upload thông tin file)
router.post(
    "/",
    authenticate,
    verifyRole(['admin']),
    validationRequest(KnowledgeValidation.create()),
    asyncHandler(knowledgeController.create),
);

//
router.get("/", 
    authenticate,
    verifyRole(['admin']),
    asyncHandler(knowledgeController.getAll));

// 3. Lấy chi tiết
router.get(
    "/:id",
    authenticate,
    verifyRole(['admin']),
    validationRequest(KnowledgeValidation.idParam()),
    asyncHandler(knowledgeController.getById),
);

// 4. Cập nhật thông tin
router.put(
    "/:id",
    authenticate,
    verifyRole(['admin']),
    validationRequest(KnowledgeValidation.update()),
    asyncHandler(knowledgeController.update),
);

// Xóa
router.delete(
    "/:id",
    authenticate,
    verifyRole(['admin']),
    validationRequest(KnowledgeValidation.idParam()),
    asyncHandler(knowledgeController.delete),
);

// --- CÁC ROUTE ĐẶC BIỆT CHO AI SYNC ---

// Đồng bộ sang Python (Trigger Sync)
// POST /api/knowledge/:id/sync
router.post(
    "/:id/sync",
    authenticate,
    verifyRole(['admin']),
    validationRequest(KnowledgeValidation.idParam()),
    asyncHandler(knowledgeController.synchronize),
);

// Hủy đồng bộ (Gỡ khỏi AI nhưng giữ lại file)
// POST /api/knowledge/:id/desync
router.post(
    "/:id/desync",
    authenticate,
    verifyRole(['admin']),
    validationRequest(KnowledgeValidation.idParam()),
    asyncHandler(knowledgeController.desynchronize),
);

export default router;