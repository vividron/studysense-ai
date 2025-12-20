import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

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
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})