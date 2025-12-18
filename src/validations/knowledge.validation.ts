import { z } from "zod";

export class KnowledgeValidation {
    static create() {
        return {
            body: z.object({
                url: z.string().url("Invalid URL format").nonempty("URL is required"),
                public_id: z.string().optional(),
                file_name: z.string().nonempty("File name is required"),
                name: z.string().nonempty("Name is required"),
                mime_type: z.string().nonempty("Mime type is required"),
                size: z.number().positive("Size must be a positive number"),
                type: z.enum(["excel", "document"], {
                    errorMap: () => ({ message: "Type must be 'excel' or 'document'" }),
                }),
                topic: z.string().nullable().optional(),
                location: z.string().nullable().optional(),
                source: z.string().nullable().optional(),
            }),
        };
    }

    static update() {
        return {
            params: z.object({
                id: z.string().nonempty("Knowledge ID is required"),
            }),
            body: z.object({
                url: z.string().url("Invalid URL format").optional(),
                public_id: z.string().optional(),
                file_name: z.string().optional(),
                name: z.string().optional(),
                mime_type: z.string().optional(),
                size: z.number().positive().optional(),
                type: z.enum(["excel", "document"]).optional(),
                topic: z.string().nullable().optional(),
                location: z.string().nullable().optional(),
                source: z.string().nullable().optional(),
            }),
        };
    }

    static idParam() {
        return {
            params: z.object({
                id: z.string().nonempty("Knowledge ID is required"),
            }),
        };
    }
}