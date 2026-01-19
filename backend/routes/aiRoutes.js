import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    chat,
    getChatHistory,
    generateSummary,
    generateQuiz,
    deleteChatHistory

} from '../controllers/aiController.js'

const router = express.Router();
router.use(protect);

router.get('/chat-history/:documentId', getChatHistory);

router.delete('/chat-history/:documentId', deleteChatHistory);

// Check if documentId exist in request body
router.use((req, res, next) => {
    const documentId = req.body.documentId
    if (!documentId) {
        return res.status(400).json({
            success: false,
            error: 'Please provide documentId',
            statusCode: 400
        });
    }
    next();
});

router.post('/chat', chat);

router.post('/generate-summary', generateSummary);

router.post('/generate-quiz', generateQuiz);

export default router;