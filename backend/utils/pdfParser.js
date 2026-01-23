import {PDFParse} from 'pdf-parse';
import { AppError } from './AppError.js';

export const parsePDF = async (dataBuffer) => {
    try {
        const parser = new PDFParse({data: dataBuffer});
    
        const result = await parser.getText();
        await parser.destroy();
        return result.text;

    } catch (error) {
        throw new AppError("Failed to extract text from pdf.", "pdf", 400, error);
    }
}