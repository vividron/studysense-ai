import express from 'express';

import {
    getUploadUrl,
    processDocument,
    getDocuments,
    getDocument,
    deleteDocument
} from '../controllers/documentController.js';

import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/get-upload-url', getUploadUrl);

router.post('/process-document', processDocument);

router.get('/', getDocuments);

router.get('/:id', getDocument);

router.delete('/:id', deleteDocument);

export default router;



