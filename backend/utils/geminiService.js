import { GoogleGenAI } from "@google/genai";

let ai;

async function getResponse(prompt) {
    if (!ai) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        }
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }
    return await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt
    });
}

// Chat with context of document
export const chat = async(question, context) => {
    const prompt = `You are an AI assistant that answers questions using ONLY the provided context.
    context:
    ${context}

    question:
    ${question}
    
    INSTRUCTIONS:
    - If the answer is NOT present in the context, reply exactly with:
      "Sorry, I was unable to find the answer in the provided Document."
    - Answer Question as standalone facts, not references to a context source`;

    try {
        const answer = await getResponse(prompt);
        console.log(answer.text);
        return answer.text;
    } catch (error) {
        console.log("Gemini error: "+error);
        throw new Error("Failed to process chat request");
    }
}

// Generate summary from document
export const generateSummary = async(text) => {
    const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and Keep the summary clear and structured.
    
    INSTRUCTIONS:
    - Do NOT include any introduction phrases
    - Return ONLY the summary content.

    Text:
    ${text.slice(0,20000)}`;

    try {
        const summary = await getResponse(prompt);
        console.log(summary.text);
        return summary.text;
    } catch (error) {
        console.log("Gemini error: "+error);
        throw new Error("Failed to generate summary");
    }
}

// Generate quiz from the document. 
export const generateQuiz = async (text, numOfQuestion = 10) => {
    const prompt = `Generate exactly ${numOfQuestion} multiple choice questions from the following text.
    Format each question as:
    Q: [Question]
    OP1: [Option 1]
    OP2: [Option 2]
    OP3: [Option 3]
    OP4: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explanation]
    D: [Difficulty: easy, medium, or hard]
    Separate questions with "---"

    Rules:
    - Do NOT use markdown.
    - Do NOT include any extra text
    - options must be distinct and realistic
    - Write explanations as standalone facts, not references to a text source

    Text:
    ${text.substring(0, 15000)}`;

    try {
        const response = await getResponse(prompt);
        console.log(response.text);
        const aiText = response.text;

        const quiz = [];
        const quizString = aiText.split("---");

        for (const qs of quizString) {
            const fieldArray = qs.trim().split('\n');
            let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'Medium';

            for (const field of fieldArray) {
                const trimmed = field.trim();
                if (trimmed.startsWith("Q:")) question = trimmed.slice(2).trim();
                else if (trimmed.startsWith("OP")) options.push(trimmed.slice(3).trim());
                else if (trimmed.startsWith('C:')) correctAnswer = trimmed.slice(2).trim();
                else if (trimmed.startsWith('E:')) explanation = trimmed.slice(2).trim();
                else if (trimmed.startsWith('D:')) {
                    const diff = trimmed.slice(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }

                    if (question && options.length === 4 && correctAnswer) {
                        quiz.push({ question, options, correctAnswer, explanation, difficulty });
                    }
                }
            }
        }
        return quiz;
    } catch (error) {
        console.error("Failed to generate quiz:" + error);
        throw new Error("Failed to generate quiz");
    }
}