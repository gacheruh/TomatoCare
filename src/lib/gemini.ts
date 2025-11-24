import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "dummy-key");
export const MODEL_NAME = "gemini-2.5-flash-preview-09-2025"; // Using standard 1.5 Flash model
// export const model = genAI.getGenerativeModel({ model: MODEL_NAME });
