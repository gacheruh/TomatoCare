import { NextRequest, NextResponse } from 'next/server';
import { genAI, MODEL_NAMES } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'No message provided' }, { status: 400 });
        }

        let result;
        let lastError;

        for (const modelName of MODEL_NAMES) {
            try {
                console.log(`Chat API: trying model ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: "You are AgriDiagnose Assistant, an expert AI agronomist. Your goal is to help farmers diagnose crop diseases, suggest treatments, and provide farming advice. Be helpful, concise, and use markdown formatting (bold, lists) to make your answers easy to read. If you don't know the answer, admit it and suggest consulting a local expert."
                });

                const chat = model.startChat({
                    history: history || [],
                    generationConfig: {
                        maxOutputTokens: 2000, // Increased to prevent cut-offs
                    },
                });

                result = await chat.sendMessage(message);
                break; // Succeeded!
            } catch (err: any) {
                console.warn(`Chat API: model ${modelName} failed, trying fallback. Error:`, err.message || err);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All chat models failed");
        }

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error('Chat API Error Details:', error);
        // Check for 404 specifically which often means model not found or key issue
        if (error.status === 404) {
            return NextResponse.json({ error: 'AI Model not found. Check API key and model availability.' }, { status: 500 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
