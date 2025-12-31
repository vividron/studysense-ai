import Chat from "../models/chat.js";
import Document from "../models/document.js";
import Quiz from "../models/quiz.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

async function checkDocument(documentId, userId) {
    const doc = await Document.findOne({
        _id: documentId,
        userId
    });

    if (!doc) {
        return res.status(400).json({
            success: false,
            error: 'Document not found',
            statusCode: 400
        });
    }

    if (doc.status === "processing" || doc.status === "failed") {
        doc.deleteOne();
        return res.status(400).json({
            success: false,
            error: 'Not able to process document, Try uploading it again',
            statusCode: 400
        });
    }
    return doc;
}

// Generate quiz from document
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numOfQuestions, title } = req.body;
        const doc = await checkDocument(documentId, req.user._id);

        // Generate full content of document from chunks
        const fullContent = doc.chunks.map(c => c.content).join("\n");

        const questions = await geminiService.generateQuiz(fullContent, numOfQuestions);

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId,
            title: title || `${doc.title} - Quiz`,
            questions,
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully'
        });
    } catch (error) {
        next(error)
    }
}

// Handle chat with AI holding document context
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;
        const userId = req.user._id;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: 'Please provide the question',
                statusCode: 400
            });
        }
        const doc = await checkDocument(documentId, userId);

        // Find chunks with high keyword match
        const chunks = findRelevantChunks(doc.chunks, question, 3);
        const context = chunks.map(c => c.content).join("\n");
        console.log(context);

        const answer = await geminiService.chat(question, context);

        let chatHistory = await Chat.findOne({
            userId,
            documentId
        });

        if (!chatHistory) {
            chatHistory = await Chat.create({
                userId,
                documentId,
                messages: []
            });
        }

        chatHistory.messages.push({
            role: 'user',
            content: question,
            timestamp: new Date()
        },
            {
                role: "ai",
                content: answer,
                timestamp: new Date()
            });

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                chatId: chatHistory._id
            },
            message: 'Answer generated successfully'
        });

    } catch (error) {
        next(error);
    }
}

// Get chat history
export const getChatHistory = async (req, res, next) => {
    try {
        const documentId = req.params.documentId;
        const chatHistory = await Chat.findOne({
            userId: req.user._id,
            documentId
        }).select('messages');

        if (!chatHistory) {
            return res.status(200).json({
                success: false,
                data: [],
                message: 'No chat history found',
            });
        }

        res.status(200).json({
            success: false,
            data: chatHistory.messages,
        })
    } catch (error) {
        next(error);
    }
}

// Generate summary of document 
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;
        const doc = await checkDocument(documentId, req.user._id);

        // Generate full content of document from chunks
        const fullContent = doc.chunks.map(c => c.content).join("\n");
        const summary = await geminiService.generateSummary(fullContent);

        await Document.updateOne({ _id: documentId }, { $set: { summary: summary } });

        res.status(200).json({
            success: true,
            data: summary,
            message: "Summary generated successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Get summary
export const getSummary = async (req, res, next) => {
    try {
        const documentId = req.params.documentId;
        const doc = await checkDocument(documentId, req.user._id);
        console.log(doc.summary);
        res.status(200).json({
            success: true,
            data: doc.summary,
        });
    } catch (error) {
        next(error);
    }
}

