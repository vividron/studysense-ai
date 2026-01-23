import { parsePDF } from "../utils/pdfParser.js";
import Document from "../models/document.js";
import { chunkText } from "../utils/textChunker.js";
import Quiz from '../models/quiz.js';
import Chat from '../models/chat.js';
import Chunk from "../models/chunk.js";
import { formatFileSize } from '../utils/fileSizeFormatter.js';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadDocument = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                error: "Please upload the document",
                statuscode: 400
            });
        }

        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                error: "Title for the document is requried",
                statuscode: 400
            });
        }

        const fileKey = `${req.user._id}/${Date.now()}-${file.originalname}`;

        // Upload to S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        const fileSize = formatFileSize(req.file.size);

        const doc = await Document.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            fileKey,
            fileSize,
            title,
            status: 'processing'
        });

        res.status(201).json({
            success: true,
            document: {
                ...doc.toObject(),
                quizCount: 0
            },
            message: "Document uploaded and processing started"
        });

        processDocument(doc, file.buffer);

    } catch (error) {
        next(error);
    }
}

const processDocument = async (doc, buffer) => {
    try {
        const extractedText = await parsePDF(buffer);
        // create chunks
        const chunks = await chunkText(extractedText, 500, 20);

        doc.chunks = chunks.map((c) => c.content);
        doc.status = "ready";

        // insert in chunk collection for vector search
        const chunkDocs = chunks.map(c => ({
            documentId: doc._id,
            content: c.content,
            embedding: c.embedding
        }));

        await Chunk.insertMany(chunkDocs);

    } catch (err) {
        console.error("Document processing failed:", err);
        doc.status = "failed";
    }
    await doc.save();
};

export const getDocument = async (req, res, next) => {
    try {
        const doc = await Document.findOne({
            userId: req.user._id,
            _id: req.params.id,
        }).select('-chunks -userId -summary');

        if (!doc) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statuscode: 404
            });
        }

        await Document.updateOne(
            { _id: doc._id },
            { $set: { lastAccessed: new Date() } }
        );

        const quizCount = await Quiz.countDocuments({ userId: req.user._id, documentId: req.params.id });


        const getCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: doc.fileKey,
        });

        // Generate Pre-Signed URL (6 hrs)
        const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 21600 });

        res.status(200).json({
            success: true,
            data: {
                ...doc.toObject(),
                filePath: signedUrl,
                quizCount,
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getDocuments = async (req, res, next) => {
    try {
        const doc = await Document.aggregate([
            {
                $match: { userId: req.user._id }
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
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statuscode: 404
            });
        }

        // Delete doc from s3
        if (doc.fileKey) {
            await s3.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: doc.fileKey,
            }));
        }

        // Delete quizzes, chat history , chunks
        await Quiz.deleteMany({ documentId: doc._id });
        await Chat.deleteMany({ documentId: doc._id });
        await Chunk.deleteMany({ documentId: doc._id });

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}
