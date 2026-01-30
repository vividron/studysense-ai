import { PDFParse } from "pdf-parse";
import { AppError } from "./AppError.js";

export function parsePDFStream(pdfStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    pdfStream.on("data", chunk => {
      chunks.push(chunk);
    });

    pdfStream.on("end", async () => {
      try {
        // Convert collected chunks into buffer
        const buffer = Buffer.concat(chunks);

        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        await parser.destroy();

        resolve(result.text);
      } catch (error) {
        reject(new AppError("Failed to extract text from pdf.", "pdf", 400, error));
      }
    });

    pdfStream.on("error", (err) => {
      reject(new AppError("Failed to read PDF stream.", "pdf", 400, err));
    });
  });
}
