import { parsePDFStream } from "../utils/pdfParser.js";
import Document from "../models/document.js";
import { chunkText } from "../utils/textChunker.js";
import Quiz from '../models/quiz.js';
import Chat from '../models/chat.js';
import Chunk from "../models/chunk.js";
import { formatFileSize } from '../utils/fileSizeFormatter.js';
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import pLimit from "p-limit";

// Max 3 concurrent parsing
const parseLimit = pLimit(3);

export const getUploadUrl = async (req, res, next) => {
    try {
        const { fileName, fileType } = req.body;

        if (!fileName || !fileType) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        if (fileType !== "application/pdf") {
            return res.status(400).json({
                success: false,
                error: "Document should be in PDF format"
            });
        }

        const fileKey = `${req.user._id}/${Date.now()}-${fileName}`;

        // Create presigned POST policy limiting size to 10MB and enforcing content type
        const { url, fields } = await createPresignedPost(s3, {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Conditions: [
                ["content-length-range", 0, 10 * 1024 * 1024],
                ["starts-with", "$Content-Type", "application/pdf"],
                ["starts-with", "$key", `${req.user._id}`]
            ],
            Fields: {
                "Content-Type": fileType
            }
        }, { expiresIn: 300 }); // expires in 5 min

        res.status(201).json({
            success: true,
            data: {
                uploadUrl: { url, fields },
                fileKey
            }
        });

    } catch (error) {
        next(error);
    }
}

export const processDocument = async (req, res, next) => {
    try {
        const { fileName, fileSize, fileKey, title } = req.body;

        if (!fileName || !fileSize || !fileKey || !title) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const doc = await Document.create({
            userId: req.user._id,
            fileName,
            fileKey,
            fileSize: formatFileSize(fileSize),
            title,
            status: 'processing'
        });

        parseLimit(() => startParsing(doc._id, doc.fileKey));

        res.status(200).json({
            success: true,
            data: {
                ...doc.toObject(),
                quizCount: 0
            }
        });
    } catch (error) {
        next(error);
    }
};

const startParsing = async (documentId, fileKey) => {
    let doc
    try {
        doc = await Document.findById(documentId);
        if (!doc) return

        const { Body } = await s3.send(new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        }));

        const extractedText = await parsePDFStream(Body);
        // create chunks
        const chunks = await chunkText(extractedText, 500, 20);

        doc.chunks = chunks.map((c) => c.content);
        doc.status = "ready";

        // insert in chunk collection for vector search
        const chunkDocs = chunks.map(c => ({
            documentId,
            content: c.content,
            embedding: c.embedding
        }));

        await Chunk.insertMany(chunkDocs);

    } catch (err) {
        console.error("Document processing failed:", err);
        if (doc) doc.status = "failed";
    }
    if (doc) await doc.save();
}

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
