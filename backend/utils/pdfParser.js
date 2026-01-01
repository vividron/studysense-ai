import fs from 'fs/promises';
import {PDFParse} from 'Pdf-parse';

export const parsePDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const parser = new PDFParse({data: new Uint8Array(dataBuffer)});
    
        const result = await parser.getText();
        await parser.destroy();
        return result.text;

    } catch (error) {
        console.error("PDf parsing error");
        const err = new Error("Failed to extract text from pdf.");
        err.statusCode = 400;
        throw err;
    }
}