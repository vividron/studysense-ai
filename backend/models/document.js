import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        requried: true,
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// indexing for faster queries
documentSchema.index({userId: 1});

const Document = mongoose.model('Document', documentSchema);

export default Document;