import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'ai'],
                required: true
            },

            content: {
                type: String,
                requried: true
            },
            timestamp: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

// Compound index for fast queries
chatSchema.index({userId: 1, documentId: 1});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;