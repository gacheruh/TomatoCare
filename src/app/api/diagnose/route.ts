import { NextRequest, NextResponse } from 'next/server';
import { genAI, MODEL_NAMES } from '@/lib/gemini';

// Local expert-validated advisory system mapping for the 10 classes
const ADVISORY_DATABASE: Record<string, { symptoms: string, treatment: string, prevention: string }> = {
  "Bacterial spot": {
    symptoms: "Small, water-soaked spots on leaves that turn brown or black; leaves may yellow and fall off. Fruit shows raised, scab-like spots.",
    treatment: "Apply copper-based fungicides. Prune lower branches to improve air circulation. Avoid overhead watering.",
    prevention: "Use certified disease-free seeds, practice crop rotation, and clean tools/stakes regularly."
  },
  "Early blight": {
    symptoms: "Dark brown spots with concentric rings ('target' appearance) on older leaves. Lower leaves yellow and drop.",
    treatment: "Apply organic copper spray or chlorothalonil. Remove infected lower leaves early in the season.",
    prevention: "Provide proper spacing for airflow, mulch the soil to prevent spore splash-back, and rotate crops."
  },
  "Late blight": {
    symptoms: "Large, dark, water-soaked lesions on leaves and stems that rapidly turn black. White fungal growth appears under wet conditions.",
    treatment: "Apply copper fungicides immediately. Destroy heavily infected plants to prevent airborne spread to nearby farms.",
    prevention: "Plant resistant varieties, avoid overhead watering, and ensure good field drainage."
  },
  "Leaf Mold": {
    symptoms: "Pale green or yellow spots on the upper leaf surface, with olive-green to purple velvety mold growth underneath.",
    treatment: "Apply copper fungicides or sulfur-based sprays. Increase greenhouse ventilation.",
    prevention: "Keep humidity low (below 85%), space plants properly, and prune lower leaves to improve ventilation."
  },
  "Septoria leaf spot": {
    symptoms: "Numerous small, circular spots with dark borders and grey centers. Spreads from lower leaves upwards.",
    treatment: "Apply organic copper fungicides. Remove and destroy infected leaves immediately.",
    prevention: "Mulch around the base of the plant, water at the soil level, and keep the farm free of solanaceous weeds."
  },
  "Spider mites Two-spotted spider mite": {
    symptoms: "Fine yellow speckling on leaves. Leaves turn bronze, dry up, and fall. Fine webbing is visible under leaves.",
    treatment: "Apply neem oil or insecticidal soap. Introduce natural predators like predatory mites.",
    prevention: "Keep plants well-watered (mites thrive in dry conditions) and remove weeds surrounding the plot."
  },
  "Target Spot": {
    symptoms: "Small, circular, dark brown spots on leaves that expand and develop concentric rings, similar to early blight but smaller.",
    treatment: "Apply systemic fungicides. Prune lower foliage to enhance airflow.",
    prevention: "Maintain crop rotation, use clean planting material, and manage weed hosts."
  },
  "Tomato Yellow Leaf Curl Virus": {
    symptoms: "Severe stunting, leaves curling upwards and turning yellow. Plant stops growing and fruit production drops drastically.",
    treatment: "No cure for viral infection. Remove and destroy infected plants immediately to prevent spread.",
    prevention: "Control silverleaf whitefly vector using neem oil, insect nets, and yellow sticky traps."
  },
  "Tomato mosaic virus": {
    symptoms: "Mottled green and yellow patterns (mosaic) on leaves. Leaves may look blistered or shoestring-like.",
    treatment: "No cure for viral infection. Promptly remove and burn/bury infected plants. Wash hands with soap after handling.",
    prevention: "Avoid using tobacco products near plants, clean tools with disinfectant, and plant resistant tomato varieties."
  },
  "healthy": {
    symptoms: "No symptoms. Foliage is green, upright, and showing robust growth.",
    treatment: "No treatment required. Maintain regular watering and nutrient feed schedules.",
    prevention: "Continue practicing good hygiene, crop rotation, and routine monitoring."
  }
};

// Known disease classes from the CNN model
const KNOWN_DISEASES = Object.keys(ADVISORY_DATABASE);

// ─── Helper: Call the CNN backend ───────────────────────────────────────────────
async function callCNNBackend(base64Data: string, mimeType: string): Promise<{ diseaseName: string; confidence: number } | null> {
  const backendUrl = process.env.MODEL_BACKEND_URL;
  if (!backendUrl) return null;

  try {
    console.log(`[CNN] Sending image to ${backendUrl}`);
    const buffer = Buffer.from(base64Data, 'base64');
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, 'leaf.jpg');

    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`[CNN] Prediction: "${result.diseaseName}" (${result.confidence}%)`);
      return { diseaseName: result.diseaseName, confidence: result.confidence };
    } else {
      console.warn(`[CNN] Server returned status ${response.status}`);
      return null;
    }
  } catch (err: any) {
    console.warn('[CNN] Failed to reach backend:', err.message || err);
    return null;
  }
}

// ─── Helper: Gemini validation (silent second opinion) ──────────────────────────
interface GeminiValidation {
  verdict: 'agree' | 'corrected' | 'not_tomato';
  correctedDisease?: string;
  confidence?: number;
  symptoms?: string;
  treatment?: string;
  prevention?: string;
}

async function validateWithGemini(base64Data: string, cnnPrediction?: string): Promise<GeminiValidation | null> {
  const cnnContext = cnnPrediction
    ? `A specialized model predicted this is: "${cnnPrediction}". Evaluate whether this prediction is correct.`
    : `No prior prediction is available. Analyze the image from scratch.`;

  const prompt = `You are an expert plant pathologist specializing in tomato diseases.

${cnnContext}

Analyze this image and respond with ONLY valid JSON (no markdown, no code fences):
{
  "verdict": "agree" | "corrected" | "not_tomato",
  "correctedDisease": "disease name if verdict is corrected",
  "confidence": 85,
  "symptoms": "visible symptoms description",
  "treatment": "recommended treatment",
  "prevention": "prevention tips"
}

Rules:
- If the image is NOT a tomato/plant leaf (e.g. a rock, animal, person, object, non-plant), set verdict to "not_tomato"
- If the prediction is correct, set verdict to "agree" (you can omit correctedDisease, symptoms, treatment, prevention)
- If the prediction is wrong, set verdict to "corrected" and provide the correct disease name and full details
- Known tomato diseases: ${KNOWN_DISEASES.join(', ')}
- For healthy tomato leaves, use disease name "healthy"`;

  // 10-second timeout — if Gemini is slow, we'll trust the CNN
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    let result;
    let lastError;

    for (const modelName of MODEL_NAMES) {
      try {
        console.log(`[Gemini Validator] Trying model ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
            ]
          }],
        });
        break;
      } catch (err: any) {
        if (controller.signal.aborted) throw new Error('Gemini validation timed out');
        console.warn(`[Gemini Validator] Model ${modelName} failed:`, err.message || err);
        lastError = err;
      }
    }

    clearTimeout(timeout);

    if (!result) {
      throw lastError || new Error('All Gemini models failed validation');
    }

    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed: GeminiValidation = JSON.parse(cleanText);

    console.log(`[Gemini Validator] Verdict: "${parsed.verdict}"${parsed.correctedDisease ? ` → ${parsed.correctedDisease}` : ''}`);
    return parsed;

  } catch (err: any) {
    clearTimeout(timeout);
    console.warn('[Gemini Validator] Validation failed, will trust CNN:', err.message || err);
    return null;
  }
}

// ─── Main POST handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const base64Data = image.split(',')[1];
    const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

    // ── Run CNN and Gemini in PARALLEL ──────────────────────────────────────
    const backendUrl = process.env.MODEL_BACKEND_URL;

    const [cnnResult, geminiResult] = await Promise.allSettled([
      callCNNBackend(base64Data, mimeType),
      // Pass CNN prediction context — but since they run in parallel, 
      // we send a general validation prompt first time
      backendUrl 
        ? validateWithGemini(base64Data) // No CNN context yet (parallel)
        : Promise.resolve(null),         // No backend configured, skip parallel Gemini
    ]);

    const cnn = cnnResult.status === 'fulfilled' ? cnnResult.value : null;
    const gemini = geminiResult.status === 'fulfilled' ? geminiResult.value : null;

    console.log(`[Pipeline] CNN: ${cnn ? cnn.diseaseName : 'FAILED'} | Gemini: ${gemini ? gemini.verdict : 'FAILED'}`);

    // ── Decision Logic ──────────────────────────────────────────────────────

    // Case 1: Gemini says it's not a tomato leaf → reject immediately
    if (gemini?.verdict === 'not_tomato') {
      console.log('[Pipeline] Result: NOT A TOMATO LEAF (Gemini rejected)');
      return NextResponse.json({
        diseaseName: 'Not a Tomato Leaf',
        confidence: 0,
        symptoms: 'The uploaded image does not appear to be a tomato plant leaf. Please upload a clear photo of a tomato leaf for accurate diagnosis.',
        treatment: 'N/A',
        prevention: 'Ensure you photograph the affected tomato leaf clearly, with good lighting and minimal background clutter.',
        isRejection: true,
      });
    }

    // Case 2: CNN succeeded
    if (cnn) {
      // Case 2a: Gemini agrees with CNN → use CNN + advisory database
      if (gemini?.verdict === 'agree') {
        console.log(`[Pipeline] Result: CNN CONFIRMED by Gemini → "${cnn.diseaseName}"`);
        const advisory = ADVISORY_DATABASE[cnn.diseaseName] || ADVISORY_DATABASE['healthy'];
        return NextResponse.json({
          diseaseName: cnn.diseaseName,
          confidence: cnn.confidence,
          symptoms: advisory.symptoms,
          treatment: advisory.treatment,
          prevention: advisory.prevention,
        });
      }

      // Case 2b: Gemini corrects CNN → use Gemini's diagnosis
      if (gemini?.verdict === 'corrected' && gemini.correctedDisease) {
        console.log(`[Pipeline] Result: GEMINI CORRECTED CNN → "${gemini.correctedDisease}" (was "${cnn.diseaseName}")`);
        // Try advisory database first for the corrected disease, fall back to Gemini's text
        const advisory = ADVISORY_DATABASE[gemini.correctedDisease];
        return NextResponse.json({
          diseaseName: gemini.correctedDisease,
          confidence: gemini.confidence || cnn.confidence,
          symptoms: advisory?.symptoms || gemini.symptoms || 'See a local agronomist for detailed symptom analysis.',
          treatment: advisory?.treatment || gemini.treatment || 'Consult a local agricultural extension officer for treatment options.',
          prevention: advisory?.prevention || gemini.prevention || 'Practice good crop hygiene and regular monitoring.',
        });
      }

      // Case 2c: Gemini failed or was inconclusive → trust CNN at 98% accuracy
      console.log(`[Pipeline] Result: CNN TRUSTED (Gemini unavailable) → "${cnn.diseaseName}"`);
      const advisory = ADVISORY_DATABASE[cnn.diseaseName] || ADVISORY_DATABASE['healthy'];
      return NextResponse.json({
        diseaseName: cnn.diseaseName,
        confidence: cnn.confidence,
        symptoms: advisory.symptoms,
        treatment: advisory.treatment,
        prevention: advisory.prevention,
      });
    }

    // Case 3: CNN failed but Gemini succeeded → use Gemini as full fallback
    if (gemini) {
      console.log(`[Pipeline] Result: GEMINI FULL FALLBACK`);
      return await runFullGeminiFallback(base64Data);
    }

    // Case 4: Both failed → run a fresh Gemini full diagnosis as last resort
    console.log('[Pipeline] Both CNN and parallel Gemini failed. Running fresh Gemini fallback...');
    return await runFullGeminiFallback(base64Data);

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

// ─── Full Gemini fallback (when CNN is completely unavailable) ───────────────
async function runFullGeminiFallback(base64Data: string): Promise<NextResponse> {
  console.log('[Gemini Fallback] Running full diagnosis...');
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

  let result;
  let lastError;

  for (const modelName of MODEL_NAMES) {
    try {
      console.log(`[Gemini Fallback] Trying model ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
      ]);
      break;
    } catch (err: any) {
      console.warn(`[Gemini Fallback] Model ${modelName} failed:`, err.message || err);
      lastError = err;
    }
  }

  if (!result) {
    throw lastError || new Error('All generative models failed');
  }

  const response = await result.response;
  const text = response.text();
  const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const jsonResponse = JSON.parse(cleanText);
    return NextResponse.json(jsonResponse);
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
  }
}
