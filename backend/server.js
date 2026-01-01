import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

// dirname alternative for ES6 module
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();

connectDB();

app.use(
    cors({
        origin:'*',
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Static folder for document uploads
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/activity", activityRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})