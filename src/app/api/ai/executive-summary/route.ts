import { generateText } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

export const POST = withAiRoute(async (body) => {
  const { title, objectives, agendaTitles, duration, price } = body as {
    title?: string;
    objectives?: string[];
    agendaTitles?: string[];
    duration?: string;
    price?: string;
  };

  const summary = await generateText(
    "Eres un consultor que resume propuestas comerciales de capacitación en un formato ejecutivo (para un gerente ocupado), en español, en no más de 120 palabras, con viñetas breves.",
    `Resume esta propuesta en formato ejecutivo:\nTítulo: ${title || "—"}\nDuración: ${duration || "—"}\nObjetivos: ${
      (objectives ?? []).join("; ") || "—"
    }\nTemario: ${(agendaTitles ?? []).join(", ") || "—"}\nInversión: ${price || "—"}`,
  );

  return summary;
});
