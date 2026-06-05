import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "dummy-key");
export const MODEL_NAMES = [
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
];
export const MODEL_NAME = MODEL_NAMES[0]; // Default model
// export const model = genAI.getGenerativeModel({ model: MODEL_NAME });
