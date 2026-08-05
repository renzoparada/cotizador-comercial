import { generateJson } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

interface AgendaModuleAi {
  titulo: string;
  descripcion: string;
  temas: string[];
}

export const POST = withAiRoute(async (body) => {
  const { title, duration } = body as { title?: string; duration?: string };

  const agenda = await generateJson<AgendaModuleAi[]>(
    "Eres un diseñador instruccional experto en capacitaciones corporativas. Respondes siempre en español.",
    `Genera un temario estructurado en 3 a 5 módulos para una capacitación titulada "${title || "Capacitación empresarial"}"${
      duration ? ` con una duración total de ${duration}` : ""
    }. Responde con un arreglo JSON de objetos con esta forma exacta: [{"titulo": string, "descripcion": string (1 frase), "temas": string[] (3 a 5 temas cortos)}].`,
  );

  return agenda;
});
