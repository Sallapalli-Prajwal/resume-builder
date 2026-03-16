import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.AI_API_KEY;
// Use a model that ListModels confirms supports generateContent, e.g. "models/gemini-2.5-flash"
const defaultModelName =
  process.env.GEMINI_MODEL || 'models/gemini-2.5-flash';

let genAI;
let model;
let currentModelName;

function initializeGeminiModel(modelToUse = defaultModelName) {
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn(
      '[AI Service] GOOGLE_GEMINI_API_KEY / AI_API_KEY is not set. AI endpoints will return 500 errors until it is configured.'
    );
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: modelToUse });
    currentModelName = modelToUse;
    // eslint-disable-next-line no-console
    console.log(`[AI Service] Gemini model initialized: ${modelToUse}`);
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      '[AI Service] Failed to initialize Gemini model:',
      error.message || error
    );
    return false;
  }
}

// Try to initialize on module load
initializeGeminiModel();

async function callLLM({ systemPrompt, userPrompt }) {
  if (!model) {
    const initialized = initializeGeminiModel();
    if (!initialized || !model) {
      const error = new Error('Gemini model is not initialized');
      error.statusCode = 500;
      throw error;
    }
  }

  try {
    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Some models wrap JSON in ```json ... ``` fences; strip those if present.
    const fenceMatch = text.match(/```json([\s\S]*?)```/i);
    if (fenceMatch) {
      text = fenceMatch[1].trim();
    }

    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    const error = new Error(
      `LLM request failed using model "${currentModelName}": ${err.message || err}`
    );
    error.statusCode = 502;
    throw error;
  }
}

export async function rewriteBullet({ bullet, targetRole }) {
  const systemPrompt =
    'You are an expert technical recruiter and resume writer. ' +
    'Rewrite resume bullet points to be specific, impact-focused, and ATS-optimized. ' +
    'Always respond with strict JSON only, no explanations.';

  const userPrompt = `
Given this resume bullet point and target role, produce:
- improvedBullet: a clearer, more impactful version
- atsVersion: an ATS-friendly version (concise, keyword-rich, no special characters)
- keywordsAdded: array of important keywords you incorporated

Return JSON in the following exact shape:
{
  "improvedBullet": "string",
  "atsVersion": "string",
  "keywordsAdded": ["string", "..."]
}

Bullet: "${bullet}"
Target role: "${targetRole}"
`;

  return callLLM({ systemPrompt, userPrompt });
}

export async function generateSummary({ experiences, skills, targetRole }) {
  const systemPrompt =
    'You are an expert resume writer specializing in concise, targeted professional summaries. ' +
    'Always respond with strict JSON only, no explanations.';

  const userPrompt = `
Using the candidate's experience, key skills, and target role, generate a strong 2-4 sentence professional summary.

Return JSON in the following exact shape:
{
  "summary": "string"
}

Experiences:
${experiences}

Key skills:
${skills}

Target role:
${targetRole}
`;

  return callLLM({ systemPrompt, userPrompt });
}

export async function suggestSkills({ resumeText, targetRole }) {
  const systemPrompt =
    'You are an expert in ATS optimization and modern tech stacks. ' +
    'Suggest missing skills and technologies relevant to a target role. ' +
    'Prioritize high-signal, modern, in-demand technologies. ' +
    'Always respond with strict JSON only, no explanations.';

  const userPrompt = `
Based on the existing resume content and the target role, suggest high-impact skills and technologies that the candidate could add.

Return JSON in the following exact shape:
{
  "suggestedSkills": ["string", "..."]
}

Resume content:
${resumeText}

Target role:
${targetRole}
`;

  return callLLM({ systemPrompt, userPrompt });
}

