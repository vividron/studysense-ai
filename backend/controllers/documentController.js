import fs from 'fs/promises';
import { parsePDF } from "../utils/pdfParser.js";
import Document from "../models/document.js";
import { chunkText } from "../utils/textChunker.js";
import mongoose from "mongoose";
import Quiz from '../models/quiz.js';
import { formatFileSize } from '../utils/fileSizeFormatter.js';

export const uploadDocument = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Please upload the document",
                statuscode: 400
            });
        }

        const { title } = req.body;

        if (!title) {
            fs.unlink(req.file.path).catch(error => console.error("Failed to unlink file:" + error));
            return res.status(400).json({
                success: false,
                error: "Title for the document is requried",
                statuscode: 400
            });
        }

        const fileurl = `https://localhost:${process.env.PORT || 8000}/uploads/${req.file.filename}`;
        const fileSize = formatFileSize(req.file.size);

        const doc = await Document.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            filePath: fileurl,
            fileSize,
            title,
            status: 'processing'
        });

        res.status(201).json({
            success: true,
            document: doc,
            message: "Document uploaded and processing started"
        });

        (async () => {
            try {

                const extractedText = await parsePDF(req.file.path);

                // Creat chunks
                const chunks = await chunkText(extractedText, 500, 10);

                doc.content = extractedText;
                doc.chunks = chunks;
                doc.status = 'ready';

                await doc.save();
            } catch (error) {
                doc.status = 'failed';
                await doc.save();
            }
        })();

    } catch (error) {
        // Clean up files on error 
        fs.unlink(req.file.path).catch(error => console.error("Failed to unlink file:" + error));
        next(error);
    }
}

export const getDocument = async (req, res, next) => {
    try {
        const doc = await Document.findOne({
            userId: req.user._id,
            _id: req.params.id,
        }).select('-content -chunks -userId -summary');

        if (!doc) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statuscode: 404
            });
        }

        await Document.updateOne(
            { _id: doc._id },
            { $set: { lastAccessed: Date.now() } }
        );

        const quizCount = await Quiz.countDocuments({ userId: req.user._id, documentId: req.params.id });

        res.status(200).json({
            success: true,
            data: { ...doc.toObject(), quizCount }
        });

    } catch (error) {
        next(error);
    }
}

export const getDocuments = async (req, res, next) => {
    try {
        const doc = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    as: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId'
                }
            },
            {
                $addFields: {
                    quizCount: { $size: '$quizzes' }
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    summary: 0,
                    quizzes: 0
                }
            },
            {
                $sort: { uploadDate: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: doc.length,
            documents: doc
        })
    } catch (error) {
        next(error);
    }
}

export const deleteDocument = async (req, res, next) => {
    try {
        const doc = await Document.findOneAndDelete({ userId: req.user._id, _id: req.params.id });

        if (!doc) {
            returnres.status(404).json({
                success: false,
                error: "Document not found",
                statuscode: 404
            });
        }

        // Delete the file from file system 
        await fs.unlink(doc.filePath).catch(error => console.error("Deleting file from file system failed:" + error));

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}
