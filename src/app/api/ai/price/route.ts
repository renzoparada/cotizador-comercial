import { generateJson } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

interface PriceSuggestion {
  precio_normal: number;
  precio_promocional: number;
  justificacion: string;
}

export const POST = withAiRoute(async (body) => {
  const { duration, modality, participants } = body as {
    duration?: string;
    modality?: string;
    participants?: number;
  };

  const suggestion = await generateJson<PriceSuggestion>(
    "Eres un consultor comercial experto en pricing de capacitaciones y consultorías en Latinoamérica. Respondes siempre en español, con montos en USD razonables para el mercado corporativo.",
    `Sugiere un precio normal y un precio promocional (en USD) para una capacitación con duración "${duration || "16 horas"}", modalidad "${
      modality || "Presencial"
    }"${participants ? ` para aproximadamente ${participants} participantes` : ""}. Responde con JSON: {"precio_normal": number, "precio_promocional": number, "justificacion": string (1-2 frases explicando el criterio)}.`,
  );

  return suggestion;
});
