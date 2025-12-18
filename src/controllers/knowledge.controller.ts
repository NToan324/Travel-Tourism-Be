import type { Request, Response } from "express";
import knowledgeService from "@/services/knowledge.service";

class KnowledgeController {
    // Tạo mới Knowledge (Lưu metadata vào DB)
    async create(req: Request, res: Response) {
        const {
            url,
            public_id,
            file_name,
            name,
            mime_type,
            size,
            topic,
            location,
            source,
        } = req.body;

        res.status(201).send(
            await knowledgeService.create({
                url,
                public_id,
                file_name,
                name,
                mime_type,
                size,
                topic,
                location,
                source,
            }),
        );
    }

    async getAll(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query;
        res.status(200).send(
            await knowledgeService.getAll({
                page: Number(page),
                limit: Number(limit),
            }),
        );
    }

    // Lấy chi tiết theo ID
    async getById(req: Request, res: Response) {
        const { id } = req.params;
        res.status(200).send(await knowledgeService.getById(id));
    }

    // Xóa Knowledge (Xóa cả DB và Vector Store nếu đã sync)
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        res.status(200).send(await knowledgeService.delete(id));
    }

    // Đồng bộ sang Python (Streaming upload)
    async synchronize(req: Request, res: Response) {
        const { id } = req.params;
        res.status(200).send(await knowledgeService.synchronize(id));
    }

    // Hủy đồng bộ (Xóa vector bên Python, giữ lại file trong DB)
    async desynchronize(req: Request, res: Response) {
        const { id } = req.params;
        res.status(200).send(await knowledgeService.desynchronize(id));
    }

    // Cập nhật Knowledge
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const {
            url,
            file_name,
            name,
            mime_type,
            size,
            topic,
            location,
            source,
        } = req.body;

        res.status(200).send(
            await knowledgeService.update(id, {
                url,
                file_name,
                name,
                mime_type,
                size,
                topic,
                location,
                source,
            }),
        );
    }
}

export default new KnowledgeController();