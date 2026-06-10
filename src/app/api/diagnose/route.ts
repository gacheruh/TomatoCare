import { NextRequest, NextResponse } from 'next/server';
import { genAI, MODEL_NAMES } from '@/lib/gemini';

// ─── Pre-translated advisory database (English + Swahili) ─────────────────────
// All translations are baked in at build time — zero translation latency at runtime.
const ADVISORY_DATABASE: Record<string, {
  symptoms: string; treatment: string; prevention: string;
  symptoms_sw: string; treatment_sw: string; prevention_sw: string;
}> = {
  "Bacterial spot": {
    symptoms: "Small, water-soaked spots on leaves that turn brown or black; leaves may yellow and fall off. Fruit shows raised, scab-like spots.",
    treatment: "Apply copper-based fungicides. Prune lower branches to improve air circulation. Avoid overhead watering.",
    prevention: "Use certified disease-free seeds, practice crop rotation, and clean tools/stakes regularly.",
    symptoms_sw: "Madoa madogo yenye maji kwenye majani yanayogeuka kahawia au meusi; majani yanaweza kugeuka njano na kuanguka. Tunda linaonyesha madoa yaliyoinuliwa kama ukurutu.",
    treatment_sw: "Tumia dawa za ukungu zenye shaba. Kata matawi ya chini ili kuboresha mzunguko wa hewa. Epuka kumwagilia kutoka juu.",
    prevention_sw: "Tumia mbegu zilizohakikishwa zisizo na magonjwa, fanya mzunguko wa mazao, na safisha zana/vigingi mara kwa mara."
  },
  "Early blight": {
    symptoms: "Dark brown spots with concentric rings ('target' appearance) on older leaves. Lower leaves yellow and drop.",
    treatment: "Apply organic copper spray or chlorothalonil. Remove infected lower leaves early in the season.",
    prevention: "Provide proper spacing for airflow, mulch the soil to prevent spore splash-back, and rotate crops.",
    symptoms_sw: "Madoa ya kahawia giza yenye miduara (mwonekano wa 'shabaha') kwenye majani ya zamani. Majani ya chini hugeuka njano na kuanguka.",
    treatment_sw: "Tumia dawa ya shaba ya kikaboni au chlorothalonil. Ondoa majani ya chini yaliyoathirika mapema msimu.",
    prevention_sw: "Toa nafasi sahihi kwa mzunguko wa hewa, weka matandazo ya udongo kuzuia kurukaruka kwa spore, na fanya mzunguko wa mazao."
  },
  "Late blight": {
    symptoms: "Large, dark, water-soaked lesions on leaves and stems that rapidly turn black. White fungal growth appears under wet conditions.",
    treatment: "Apply copper fungicides immediately. Destroy heavily infected plants to prevent airborne spread to nearby farms.",
    prevention: "Plant resistant varieties, avoid overhead watering, and ensure good field drainage.",
    symptoms_sw: "Vidonda vikubwa, vya giza, vyenye maji kwenye majani na mashina vinavyogeuka haraka kuwa meusi. Ukuaji wa ukungu mweupe huonekana katika hali ya mvua.",
    treatment_sw: "Tumia dawa za ukungu zenye shaba mara moja. Angamiza mimea iliyoathiriwa sana kuzuia kuenea angani kwenye mashamba jirani.",
    prevention_sw: "Panda aina zinazostahimili magonjwa, epuka kumwagilia kutoka juu, na hakikisha mifereji mizuri ya shamba."
  },
  "Leaf Mold": {
    symptoms: "Pale green or yellow spots on the upper leaf surface, with olive-green to purple velvety mold growth underneath.",
    treatment: "Apply copper fungicides or sulfur-based sprays. Increase greenhouse ventilation.",
    prevention: "Keep humidity low (below 85%), space plants properly, and prune lower leaves to improve ventilation.",
    symptoms_sw: "Madoa ya kijani kibichi au njano kwenye uso wa juu wa jani, na ukuaji wa ukungu laini wa kijani-zeituni hadi zambarau chini.",
    treatment_sw: "Tumia dawa za ukungu zenye shaba au dawa zenye sulfuri. Ongeza uingizaji hewa wa chafu.",
    prevention_sw: "Weka unyevu chini (chini ya 85%), panda mimea kwa nafasi nzuri, na kata majani ya chini ili kuboresha uingizaji hewa."
  },
  "Septoria leaf spot": {
    symptoms: "Numerous small, circular spots with dark borders and grey centers. Spreads from lower leaves upwards.",
    treatment: "Apply organic copper fungicides. Remove and destroy infected leaves immediately.",
    prevention: "Mulch around the base of the plant, water at the soil level, and keep the farm free of solanaceous weeds.",
    symptoms_sw: "Madoa mengi madogo, ya mviringo yenye mipaka ya giza na vituo vya kijivu. Huenea kutoka majani ya chini kwenda juu.",
    treatment_sw: "Tumia dawa za ukungu za kikaboni zenye shaba. Ondoa na angamiza majani yaliyoathiriwa mara moja.",
    prevention_sw: "Weka matandazo karibu na msingi wa mmea, mwagilia kwa kiwango cha udongo, na weka shamba lisilo na magugu ya solanaceae."
  },
  "Spider mites Two-spotted spider mite": {
    symptoms: "Fine yellow speckling on leaves. Leaves turn bronze, dry up, and fall. Fine webbing is visible under leaves.",
    treatment: "Apply neem oil or insecticidal soap. Introduce natural predators like predatory mites.",
    prevention: "Keep plants well-watered (mites thrive in dry conditions) and remove weeds surrounding the plot.",
    symptoms_sw: "Madoa madogo ya njano kwenye majani. Majani yanageuka rangi ya shaba, kukauka, na kuanguka. Nyuzi nyembamba zinaonekana chini ya majani.",
    treatment_sw: "Tumia mafuta ya neem au sabuni ya kuua wadudu. Wasilisha wawindaji wa asili kama sarafu za kuwinda.",
    prevention_sw: "Weka mimea ikiwa na maji mengi (sarafu hustawi katika hali kame) na ondoa magugu yanayozunguka shamba."
  },
  "Target Spot": {
    symptoms: "Small, circular, dark brown spots on leaves that expand and develop concentric rings, similar to early blight but smaller.",
    treatment: "Apply systemic fungicides. Prune lower foliage to enhance airflow.",
    prevention: "Maintain crop rotation, use clean planting material, and manage weed hosts.",
    symptoms_sw: "Madoa madogo, ya mviringo, ya kahawia giza kwenye majani yanayopanuka na kukuza miduara, sawa na blight ya mapema lakini ndogo.",
    treatment_sw: "Tumia dawa za ukungu za kimfumo. Kata majani ya chini ili kuboresha mzunguko wa hewa.",
    prevention_sw: "Dumisha mzunguko wa mazao, tumia nyenzo safi za kupanda, na dhibiti magugu yanayohifadhi magonjwa."
  },
  "Tomato Yellow Leaf Curl Virus": {
    symptoms: "Severe stunting, leaves curling upwards and turning yellow. Plant stops growing and fruit production drops drastically.",
    treatment: "No cure for viral infection. Remove and destroy infected plants immediately to prevent spread.",
    prevention: "Control silverleaf whitefly vector using neem oil, insect nets, and yellow sticky traps.",
    symptoms_sw: "Udumavu mkubwa, majani yakijikunja juu na kugeuka njano. Mmea huacha kukua na uzalishaji wa matunda hushuka sana.",
    treatment_sw: "Hakuna tiba ya maambukizi ya virusi. Ondoa na angamiza mimea iliyoathiriwa mara moja kuzuia kuenea.",
    prevention_sw: "Dhibiti nzi weupe wa silverleaf kwa kutumia mafuta ya neem, nyavu za wadudu, na mitego ya njano ya kunata."
  },
  "Tomato mosaic virus": {
    symptoms: "Mottled green and yellow patterns (mosaic) on leaves. Leaves may look blistered or shoestring-like.",
    treatment: "No cure for viral infection. Promptly remove and burn/bury infected plants. Wash hands with soap after handling.",
    prevention: "Avoid using tobacco products near plants, clean tools with disinfectant, and plant resistant tomato varieties.",
    symptoms_sw: "Mifumo ya kijani na njano iliyochanganyika (mosaic) kwenye majani. Majani yanaweza kuonekana yenye malengelenge au kama uzi wa kiatu.",
    treatment_sw: "Hakuna tiba ya maambukizi ya virusi. Ondoa haraka na choma/zika mimea iliyoathiriwa. Osha mikono kwa sabuni baada ya kushughulikia.",
    prevention_sw: "Epuka kutumia bidhaa za tumbaku karibu na mimea, safisha zana kwa dawa ya kuua vijidudu, na panda aina za nyanya zinazostahimili magonjwa."
  },
  "healthy": {
    symptoms: "No symptoms. Foliage is green, upright, and showing robust growth.",
    treatment: "No treatment required. Maintain regular watering and nutrient feed schedules.",
    prevention: "Continue practicing good hygiene, crop rotation, and routine monitoring.",
    symptoms_sw: "Hakuna dalili. Majani ni ya kijani, imara, na yanaonyesha ukuaji thabiti.",
    treatment_sw: "Hakuna matibabu yanayohitajika. Endelea na ratiba za kawaida za kumwagilia na kulisha virutubisho.",
    prevention_sw: "Endelea kufanya usafi mzuri, mzunguko wa mazao, na ufuatiliaji wa kawaida."
  }
};

// Known disease classes from the CNN model
const KNOWN_DISEASES = Object.keys(ADVISORY_DATABASE);

// Toggle: set to true to bypass the CNN model and use Gemini directly for all diagnoses
const USE_GEM_ONLY = true;

// ─── GET handler: lightweight pre-warm endpoint ────────────────────────────────
// Called on dashboard/diagnose page mount to wake up the HuggingFace space
// before the user even submits an image.
export async function GET() {
  if (USE_GEM_ONLY) {
    return NextResponse.json({ status: 'gem only' });
  }

  const backendUrl = process.env.MODEL_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ status: 'no_backend_configured' });
  }

  // Fire-and-forget ping — we don't await the result
  fetch(backendUrl, { method: 'GET' }).catch(() => {
    // Silently ignore — this is best-effort pre-warming only
  });

  return NextResponse.json({ status: 'warming' });
}

// ─── Helper: Call the CNN backend ─────────────────────────────────────────────
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

// ─── Helper: Lightweight Gemini validator (verdict + corrected disease only) ───
// Only called when CNN confidence < 85%. Prompt is minimal so response is fast.
// 5-second timeout — if Gemini is slow, trust the CNN result.
interface GeminiValidation {
  verdict: 'agree' | 'corrected' | 'not_tomato';
  correctedDisease?: string;
  confidence?: number;
}

async function validateWithGemini(base64Data: string, cnnPrediction: string): Promise<GeminiValidation | null> {
  const prompt = `You are an expert plant pathologist. A CNN model predicted this tomato leaf image is: "${cnnPrediction}".

Is this prediction correct? Respond with ONLY valid JSON (no markdown, no code fences):
{
  "verdict": "agree" | "corrected" | "not_tomato",
  "correctedDisease": "correct disease name only if verdict is corrected",
  "confidence": 85
}

Rules:
- If NOT a tomato/plant leaf image, set verdict to "not_tomato"
- If CNN prediction is correct, set verdict to "agree"
- If CNN prediction is wrong, set verdict to "corrected" and provide correctedDisease
- Known diseases: ${KNOWN_DISEASES.join(', ')}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    let result;
    let lastError;

    for (const modelName of MODEL_NAMES) {
      try {
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
        console.warn(`[CNN Validator] Model ${modelName} failed:`, err.message || err);
        lastError = err;
      }
    }

    clearTimeout(timeout);

    if (!result) throw lastError || new Error('All Gemini models failed validation');

    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed: GeminiValidation = JSON.parse(cleanText);

    console.log(`[CNN Validator] Verdict: "${parsed.verdict}"${parsed.correctedDisease ? ` → ${parsed.correctedDisease}` : ''}`);
    return parsed;

  } catch (err: any) {
    clearTimeout(timeout);
    console.warn('[CNN Validator] Validation failed, will trust CNN:', err.message || err);
    return null;
  }
}

// ─── Helper: Gemini classify-only fallback (when CNN is unavailable) ──────────
// Asks Gemini to identify only the disease name, then maps it to the
// pre-translated ADVISORY_DATABASE. No Swahili generation needed at runtime.
async function runGeminiClassifyFallback(base64Data: string): Promise<{ diseaseName: string; confidence: number } | null> {
  const prompt = `You are an expert plant pathologist specializing in tomato diseases.

Analyze this image and identify the disease. Respond with ONLY valid JSON (no markdown, no code fences):
{
  "diseaseName": "exact disease name from the list below",
  "confidence": 85
}

Known tomato diseases (use EXACTLY one of these names):
${KNOWN_DISEASES.join('\n')}

If the image is NOT a tomato/plant leaf, use diseaseName "not_tomato".
If the plant looks healthy, use diseaseName "healthy".`;

  let result;
  let lastError;

  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
          ]
        }]
      });
      break;
    } catch (err: any) {
      console.warn(`[CNN Fallback] Model ${modelName} failed:`, err.message || err);
      lastError = err;
    }
  }

  if (!result) {
    throw lastError || new Error('All Gemini models failed classification');
  }

  const response = await result.response;
  const text = response.text();
  const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    console.error('[CNN Fallback] JSON parse error:', cleanText);
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

    // ── Optional Bypass: Use Gemini-only mode directly ──────────────────────
    if (USE_GEM_ONLY) {
      console.log('[Pipeline] calling CNN');
      const geminiResult = await runGeminiClassifyFallback(base64Data);

      if (!geminiResult) {
        return NextResponse.json({ error: 'Gemini classification failed. Please try again.' }, { status: 500 });
      }

      if (geminiResult.diseaseName === 'not_tomato') {
        return NextResponse.json({
          diseaseName: 'Not a Tomato Leaf',
          confidence: 0,
          symptoms: 'The uploaded image does not appear to be a tomato plant leaf. Please upload a clear photo of a tomato leaf for accurate diagnosis.',
          treatment: 'N/A',
          prevention: 'Ensure you photograph the affected tomato leaf clearly, with good lighting and minimal background clutter.',
          symptoms_sw: 'Picha iliyopakiwa haionekani kuwa jani la mmea wa nyanya. Tafadhali pakia picha wazi ya jani la nyanya kwa uchunguzi sahihi.',
          treatment_sw: 'Haihusiki',
          prevention_sw: 'Hakikisha unapiga picha ya jani la nyanya lililoathirika kwa uwazi, na mwanga mzuri.',
          isRejection: true,
        });
      }

      const fallbackAdvisory = ADVISORY_DATABASE[geminiResult.diseaseName] ?? ADVISORY_DATABASE['healthy'];
      console.log(`[Pipeline] CNN ONLY RESULT → "${geminiResult.diseaseName}"`);
      return NextResponse.json({
        diseaseName: geminiResult.diseaseName,
        confidence: geminiResult.confidence,
        symptoms: fallbackAdvisory.symptoms,
        treatment: fallbackAdvisory.treatment,
        prevention: fallbackAdvisory.prevention,
        symptoms_sw: fallbackAdvisory.symptoms_sw,
        treatment_sw: fallbackAdvisory.treatment_sw,
        prevention_sw: fallbackAdvisory.prevention_sw,
      });
    }

    // ── Step 1: Run CNN first (sequential, not parallel) ────────────────────
    const cnn = await callCNNBackend(base64Data, mimeType);

    // ── Step 2: CNN succeeded ───────────────────────────────────────────────
    if (cnn) {
      const advisory = ADVISORY_DATABASE[cnn.diseaseName] ?? ADVISORY_DATABASE['healthy'];

      // Case A: High confidence (≥ 85%) — skip Gemini entirely, serve from DB instantly
      if (cnn.confidence >= 85) {
        console.log(`[Pipeline] HIGH CONFIDENCE (${cnn.confidence}%) → skipping CNN validator, serving DB advisory`);
        return NextResponse.json({
          diseaseName: cnn.diseaseName,
          confidence: cnn.confidence,
          symptoms: advisory.symptoms,
          treatment: advisory.treatment,
          prevention: advisory.prevention,
          symptoms_sw: advisory.symptoms_sw,
          treatment_sw: advisory.treatment_sw,
          prevention_sw: advisory.prevention_sw,
        });
      }

      // Case B: Low confidence (< 85%) — call lightweight Gemini validator
      console.log(`[Pipeline] LOW CONFIDENCE (${cnn.confidence}%) → calling CNN validator`);
      const validation = await validateWithGemini(base64Data, cnn.diseaseName);

      // Gemini says not a tomato leaf
      if (validation?.verdict === 'not_tomato') {
        console.log('[Pipeline] NOT A TOMATO LEAF (CNN rejected)');
        return NextResponse.json({
          diseaseName: 'Not a Tomato Leaf',
          confidence: 0,
          symptoms: 'The uploaded image does not appear to be a tomato plant leaf. Please upload a clear photo of a tomato leaf for accurate diagnosis.',
          treatment: 'N/A',
          prevention: 'Ensure you photograph the affected tomato leaf clearly, with good lighting and minimal background clutter.',
          symptoms_sw: 'Picha iliyopakiwa haionekani kuwa jani la mmea wa nyanya. Tafadhali pakia picha wazi ya jani la nyanya kwa uchunguzi sahihi.',
          treatment_sw: 'Haihusiki',
          prevention_sw: 'Hakikisha unapiga picha ya jani la nyanya lililoathirika kwa uwazi, na mwanga mzuri.',
          isRejection: true,
        });
      }

      // Gemini corrected CNN → use corrected disease, map to DB
      if (validation?.verdict === 'corrected' && validation.correctedDisease) {
        const correctedName = validation.correctedDisease;
        const correctedAdvisory = ADVISORY_DATABASE[correctedName] ?? advisory;
        console.log(`[Pipeline] CNN CORRECTED CNN → "${correctedName}" (was "${cnn.diseaseName}")`);
        return NextResponse.json({
          diseaseName: correctedName,
          confidence: validation.confidence ?? cnn.confidence,
          symptoms: correctedAdvisory.symptoms,
          treatment: correctedAdvisory.treatment,
          prevention: correctedAdvisory.prevention,
          symptoms_sw: correctedAdvisory.symptoms_sw,
          treatment_sw: correctedAdvisory.treatment_sw,
          prevention_sw: correctedAdvisory.prevention_sw,
        });
      }

      // Gemini agreed or timed out → trust CNN, serve from DB
      console.log(`[Pipeline] CNN TRUSTED (${validation?.verdict === 'agree' ? 'CNN agreed' : 'CNN unavailable'}) → "${cnn.diseaseName}"`);
      return NextResponse.json({
        diseaseName: cnn.diseaseName,
        confidence: validation?.confidence ?? cnn.confidence,
        symptoms: advisory.symptoms,
        treatment: advisory.treatment,
        prevention: advisory.prevention,
        symptoms_sw: advisory.symptoms_sw,
        treatment_sw: advisory.treatment_sw,
        prevention_sw: advisory.prevention_sw,
      });
    }

    // ── Step 3: CNN failed → Gemini classify-only fallback ──────────────────
    console.log('[Pipeline] CNN FAILED → running CNN classify-only fallback');
    const geminiResult = await runGeminiClassifyFallback(base64Data);

    if (!geminiResult) {
      return NextResponse.json({ error: 'All AI models failed. Please try again.' }, { status: 500 });
    }

    if (geminiResult.diseaseName === 'not_tomato') {
      return NextResponse.json({
        diseaseName: 'Not a Tomato Leaf',
        confidence: 0,
        symptoms: 'The uploaded image does not appear to be a tomato plant leaf. Please upload a clear photo of a tomato leaf for accurate diagnosis.',
        treatment: 'N/A',
        prevention: 'Ensure you photograph the affected tomato leaf clearly, with good lighting and minimal background clutter.',
        symptoms_sw: 'Picha iliyopakiwa haionekani kuwa jani la mmea wa nyanya. Tafadhali pakia picha wazi ya jani la nyanya kwa uchunguzi sahihi.',
        treatment_sw: 'Haihusiki',
        prevention_sw: 'Hakikisha unapiga picha ya jani la nyanya lililoathirika kwa uwazi, na mwanga mzuri.',
        isRejection: true,
      });
    }

    const fallbackAdvisory = ADVISORY_DATABASE[geminiResult.diseaseName] ?? ADVISORY_DATABASE['healthy'];
    console.log(`[Pipeline] CNN FALLBACK RESULT → "${geminiResult.diseaseName}"`);
    return NextResponse.json({
      diseaseName: geminiResult.diseaseName,
      confidence: geminiResult.confidence,
      symptoms: fallbackAdvisory.symptoms,
      treatment: fallbackAdvisory.treatment,
      prevention: fallbackAdvisory.prevention,
      symptoms_sw: fallbackAdvisory.symptoms_sw,
      treatment_sw: fallbackAdvisory.treatment_sw,
      prevention_sw: fallbackAdvisory.prevention_sw,
    });

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
