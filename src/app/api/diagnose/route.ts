import { NextRequest, NextResponse } from 'next/server';
import { genAI, MODEL_NAME } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Remove base64 header if present
        const base64Data = image.split(',')[1];

        const prompt = `
      Analyze this plant image and identify any diseases or pests. 
      Provide the output in the following JSON format ONLY, without markdown code blocks:
      {
        "diseaseName": "Name of the disease or 'Healthy'",
        "confidence": "Confidence score as a percentage (number only)",
        "symptoms": "Brief summary of visible symptoms",
        "treatment": "Recommended chemical and organic treatments",
        "prevention": "Tips to prevent future occurrence"
      }
    `;

        // Use the shared model name
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(cleanText);
            return NextResponse.json(jsonResponse);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Diagnosis API Error Details:', error);
        if (error.status === 404) {
            return NextResponse.json({ error: 'AI Model not found. Check API key and model availability.' }, { status: 500 });
        }
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            details: error.toString()
        }, { status: 500 });
    }
}
