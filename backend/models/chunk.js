import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    }
});

const Chunk = mongoose.model('Chunk', chunkSchema);

export default Chunk;
