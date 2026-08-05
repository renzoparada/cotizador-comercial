import { generateJson } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

export interface FullProposalAi {
  title: string;
  subtitle: string;
  description_html: string;
  objectives: string[];
  benefits: string[];
  agenda: { titulo: string; descripcion: string; temas: string[] }[];
  methodology: string[];
  includes: string[];
  bonus: string[];
  duration: { horas: string; modalidad: "Presencial" | "Virtual" | "Híbrida" };
}

export const POST = withAiRoute(async (body) => {
  const { trainingType, audience } = body as { trainingType?: string; audience?: string };
  if (!trainingType?.trim()) throw new Error("Describe el tipo de capacitación.");

  const proposal = await generateJson<FullProposalAi>(
    "Eres un diseñador instruccional y redactor comercial senior de una empresa de capacitación, entrenamiento y consultoría corporativa. Respondes siempre en español, con contenido profesional y persuasivo.",
    `Genera una propuesta comercial completa para una capacitación sobre: "${trainingType}"${
      audience ? `, dirigida a: ${audience}` : ""
    }.

Responde con JSON exacto de esta forma:
{
  "title": string,
  "subtitle": string (una frase de impacto),
  "description_html": string (2 párrafos en HTML simple con <p>),
  "objectives": string[] (4-6 objetivos),
  "benefits": string[] (4-6 beneficios cortos),
  "agenda": [{"titulo": string, "descripcion": string, "temas": string[]}] (3-5 módulos),
  "methodology": string[] (3-6 técnicas, ej. Taller, Coaching, Gamificación),
  "includes": string[] (3-6 elementos incluidos),
  "bonus": string[] (1-3 bonus adicionales),
  "duration": {"horas": string (ej. "16 horas"), "modalidad": "Presencial" | "Virtual" | "Híbrida"}
}`,
  );

  return proposal;
});
