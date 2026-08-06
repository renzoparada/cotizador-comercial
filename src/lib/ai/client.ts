import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export class AiNotConfiguredError extends Error {
  constructor() {
    super("Los extras de IA no están configurados. Agrega GEMINI_API_KEY en las variables de entorno.");
    this.name = "AiNotConfiguredError";
  }
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

/** Pide a Gemini una respuesta en JSON puro (modo JSON nativo) y la parsea. */
export async function generateJson<T>(system: string, prompt: string): Promise<T> {
  const client = getGeminiClient();
  if (!client) throw new AiNotConfiguredError();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
    },
  });

  const text = (response.text ?? "").trim();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("La IA devolvió una respuesta con formato inesperado.");
  }
}

export async function generateText(system: string, prompt: string): Promise<string> {
  const client = getGeminiClient();
  if (!client) throw new AiNotConfiguredError();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: system,
    },
  });

  return (response.text ?? "").trim();
}
