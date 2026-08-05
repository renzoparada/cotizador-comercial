import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

/** Pide a Claude una respuesta en JSON puro y la parsea. Lanza si no hay API key configurada. */
export async function generateJson<T>(system: string, prompt: string): Promise<T> {
  const client = getAnthropicClient();
  if (!client) {
    throw new AiNotConfiguredError();
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `${system}\n\nResponde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown ni bloques de código.`,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("La IA devolvió una respuesta con formato inesperado.");
  }
}

export async function generateText(system: string, prompt: string): Promise<string> {
  const client = getAnthropicClient();
  if (!client) {
    throw new AiNotConfiguredError();
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super("Los extras de IA no están configurados. Agrega ANTHROPIC_API_KEY en las variables de entorno.");
    this.name = "AiNotConfiguredError";
  }
}
