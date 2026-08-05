import { generateJson } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

interface CrossSellItem {
  titulo: string;
  motivo: string;
}

export const POST = withAiRoute(async (body) => {
  const { title } = body as { title?: string };

  const suggestions = await generateJson<CrossSellItem[]>(
    "Eres un estratega comercial de una empresa de capacitación, entrenamiento y consultoría. Respondes en español.",
    `Basándote en esta capacitación: "${title || "Capacitación empresarial"}", sugiere 3 capacitaciones o servicios adicionales de cross-selling que complementen bien la propuesta original. Responde con JSON: [{"titulo": string, "motivo": string (1 frase)}].`,
  );

  return suggestions;
});
