import { generateJson } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

export const POST = withAiRoute(async (body) => {
  const { title } = body as { title?: string };

  const objectives = await generateJson<string[]>(
    "Eres un diseñador instruccional experto en capacitaciones corporativas. Respondes siempre en español.",
    `Genera entre 4 y 6 objetivos de aprendizaje claros, medibles y orientados a resultados para una capacitación titulada "${
      title || "Capacitación empresarial"
    }". Responde con un arreglo JSON de strings, ej: ["Objetivo 1", "Objetivo 2"].`,
  );

  return objectives;
});
