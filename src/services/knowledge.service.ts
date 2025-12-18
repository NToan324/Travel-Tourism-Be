import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormData from 'form-data';
import knowledgeModel from '../models/knowledge.model';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import appConfig from "@/configs/app.config";
import { BadRequestError, InternalServerError, NotFoundError } from '@/core/error.response';
import { Cloudinary } from '@/helpers/cloudinary';


class KnowledgeService {

    async update(id: string, payload: {
        url?: string;
        public_id?: string;
        file_name?: string;
        name?: string;
        mime_type?: string;
        size?: number;
        topic?: string;
        location?: string;
        source?: string;
    }) {
        const knowledge = await knowledgeModel.findById(id);
        if (!knowledge) {
            throw new NotFoundError('Knowledge not found');
        }
        if (knowledge.status === 'synced' || knowledge.status === 'syncing') {
            throw new BadRequestError('Cannot update a synchronized knowledge');
        }

        // Cập nhật các trường nếu có trong payload
        if (payload.url !== undefined) knowledge.url = payload.url;
        if (payload.file_name !== undefined) knowledge.file_name = payload.file_name;
        if (payload.name !== undefined) knowledge.name = payload.name;
        if (payload.mime_type !== undefined) knowledge.mime_type = payload.mime_type;
        if (payload.size !== undefined) knowledge.size = payload.size;
            
        if (payload.topic !== undefined || payload.location !== undefined || payload.source !== undefined) {
            knowledge.metadata = {
                topic: payload.topic !== undefined ? payload.topic : (knowledge.metadata?.topic || ''),
                location: payload.location !== undefined ? payload.location : (knowledge.metadata?.location || ''),
                source: payload.source !== undefined ? payload.source : (knowledge.metadata?.source || '')
            };
        }

        const ALLOWED_MIMES = [
            'text/plain',                                                                // .txt
            'application/pdf',                                                           // .pdf
            'application/msword',                                                        // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
            'application/vnd.ms-excel',                                                  // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',         // .xlsx
            'text/csv'                                                                   // .csv
        ];

        if (payload.mime_type && !ALLOWED_MIMES.includes(payload.mime_type)) {
            throw new BadRequestError("Định dạng file không hỗ trợ. Chỉ chấp nhận .txt, .pdf, .docx, .xlsx");
        }

        if (payload.mime_type) {
            let type: 'excel' | 'document';

            if (payload.mime_type === 'application/vnd.ms-excel' || payload.mime_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                // Loại file Excel
                type = 'excel';
            }
            else {
                // Loại file Document
                type = 'document';
            }

            knowledge.type = type;
        }

        await knowledge.save();
        return new OkResponse("Knowledge updated successfully", knowledge);
    }

    async create(payload:{ 
        url: string;
        public_id?: string;
        file_name: string;
        name: string;
        mime_type: string;
        size: number;
        topic?: string;
        location?: string;
        source?: string;
    }) {

        const ALLOWED_MIMES = [
            'text/plain',                                                                // .txt
            'application/pdf',                                                           // .pdf
            'application/msword',                                                        // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
            'application/vnd.ms-excel',                                                  // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',         // .xlsx
            'text/csv'                                                                   // .csv
        ];

        const fileId = payload.file_name + '_' + uuidv4();

        if (!ALLOWED_MIMES.includes(payload.mime_type)) {
            throw new BadRequestError("Định dạng file không hỗ trợ. Chỉ chấp nhận .txt, .pdf, .docx, .xlsx");
        }

        let type: 'excel' | 'document';

        if(payload.mime_type === 'application/vnd.ms-excel' || payload.mime_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Loại file Excel
            type = 'excel';
        } else {
            // Loại file Document
            type = 'document';
        }

        // Xử lý metadata tùy theo loại file
        let metadata = {};
        if (type == 'document') {
            metadata = {
                topic: payload.topic,
                location: payload.location
            };
        }

        const savedKnowledge = await knowledgeModel.create({
            file_id: fileId,
            file_name: payload.file_name,
            name: payload.name,
            url: payload.url,
            mime_type: payload.mime_type,
            size: payload.size,
            type: type,
            metadata: metadata,
            status: 'uploaded',
        });
        return new CreatedResponse("Knowledge created successfully", savedKnowledge);
    }

    async synchronize(id: string) {
        const knowledge = await knowledgeModel.findById(id);
        if (!knowledge) {
            throw new NotFoundError('Knowledge not found');
        }

        knowledge.status = 'syncing';
        await knowledge.save();
        try {
            console.log(`[Sync] Starting stream for: ${knowledge.name} (${knowledge.url})`);

            const fileStreamResponse = await axios.get(knowledge.url, {
                responseType: 'stream'
            });

            const form = new FormData();

            form.append('file', fileStreamResponse.data);

            let pythonEndpoint = '';

            if (knowledge.type === 'excel') {
                pythonEndpoint = `${appConfig.app.PYTHON_API_URL}/admin/knowledge/import-excel`;
            } else {
                pythonEndpoint = `${appConfig.app.PYTHON_API_URL}/admin/knowledge/import-file`;
                if (knowledge.metadata) {
                    form.append('topic', knowledge.metadata.topic || '');
                    form.append('location', knowledge.metadata.location || '');
                    form.append('source', knowledge.metadata.source || '');
                    form.append('name', knowledge.name);
                }
            }
            form.append('file_id', knowledge.file_id);


            console.log(`[Sync] Sending to Python: ${pythonEndpoint}`);

            const pythonResponse = await axios.post(pythonEndpoint, form, {
                headers: {
                    ...form.getHeaders(),
                    'Internal-API-Key': appConfig.app.PYTHON_INTERNAL_API_KEY,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            console.log('[Sync] Python Response:', pythonResponse.data);

            knowledge.status = 'synced';
            await knowledge.save();

            return knowledge;

        } catch (error: any) {
            if (error.response) {
                // Server Python trả về lỗi (4xx, 5xx)
                console.error('[Sync Error Details] Status:', error.response.status);
                console.error('[Sync Error Details] Data:', JSON.stringify(error.response.data, null, 2));
            } else {
                // Lỗi mạng hoặc code Nodejs
                console.error('[Sync Error] Message:', error);
            }

            // Cập nhật trạng thái lỗi
            knowledge.status = 'error';
            await knowledge.save();

            throw new InternalServerError('Failed to synchronize knowledge');
        }
    }

    async desynchronize(id: string) {
        const knowledge = await knowledgeModel.findById(id);
        if (!knowledge) {
            throw new NotFoundError('Document not found');
        }

        if (knowledge.status === 'uploaded') {
            throw new BadRequestError('Document has not been synchronized yet');
        }

        try {
            const deleteUrl = `${appConfig.app.PYTHON_API_URL}/admin/knowledge/${knowledge.file_id}`;

            console.log(`[Desync] Requesting delete at Python: ${deleteUrl}`);
            await axios.delete(deleteUrl, {
                headers: {
                    'Internal-API-Key': appConfig.app.PYTHON_INTERNAL_API_KEY,
                },
            });

            // Reset trạng thái về 'uploaded'
            knowledge.status = 'uploaded';
            await knowledge.save();

            return new OkResponse('Document desynchronized successfully', knowledge);

        } catch (error: any) {
            console.error('[Desync Error]', error.message);
            throw new InternalServerError(`Failed to remove from AI: ${error.message}`);
        }
    }
    
    async delete(id: string) {
        const knowledge = await knowledgeModel.findById(id);
        if (!knowledge) {
            throw new NotFoundError('Knowledge not found');
        }

        if (knowledge.status === 'synced' || knowledge.status === 'error') {
            try {
                const deleteUrl = `${appConfig.app.PYTHON_API_URL}/admin/knowledge/${knowledge.file_id}`;
                await axios.delete(deleteUrl, {
                    headers: {
                        'Internal-API-Key': appConfig.app.PYTHON_INTERNAL_API_KEY,
                    },
                });
                console.log('[Delete] Deleted vectors from Python');
            } catch (error) {
                console.warn('[Delete] Warning: Could not delete from Python (might already be deleted)', error);
            }
        }

        await knowledgeModel.findByIdAndDelete(id);

        try {
            if (knowledge.public_id) {
                // Xóa file trên Cloudinary nếu có public_id
                await Cloudinary.deleteFile(knowledge.public_id);
                console.log('[Delete] Deleted file from Cloudinary');
            }
        } catch (error) {
            console.warn('[Delete] Warning: Could not delete file from Cloudinary (might already be deleted)', error);
        }
        return new OkResponse('Knowledge deleted successfully', null);
    }

    async getAll({ page, limit }: { page: number; limit: number }) {
        const knowledge = await knowledgeModel.find().paginate({ page, limit });
        
        const pagination = {
            totalDocs: knowledge.totalDocs,
            limit: knowledge.limit,
            page: knowledge.page,
            totalPages: knowledge.totalPages,
        };

        return new OkResponse("Get all knowledge successfully", {
            docs: knowledge.docs,
            pagination,
        });
    }

    async getById(id: string) {
        const knowledge = await knowledgeModel.findById(id);
        if (!knowledge) throw new NotFoundError("Knowledge not found");

        return new OkResponse("Get knowledge successfully", knowledge);
    }
}

const knowledgeService = new KnowledgeService();
export default knowledgeService;