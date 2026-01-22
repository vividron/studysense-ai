import {PDFParse} from 'Pdf-parse';
import { AppError } from './AppError.js';

export const parsePDF = async (fileUrl) => {
    try {
        const parser = new PDFParse({url: fileUrl});
    
        const result = await parser.getText();
        await parser.destroy();
        return result.text;

    } catch (error) {
        throw new AppError("Failed to extract text from pdf.", "pdf", 400, error);
    }
}