import { generateText } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

export const POST = withAiRoute(async (body) => {
  const { title, subtitle } = body as { title?: string; subtitle?: string };

  const html = await generateText(
    "Eres un redactor comercial experto en capacitaciones, conferencias y consultorías corporativas. Escribes en español, con tono ejecutivo y persuasivo, sin exagerar. Devuelves HTML simple (solo <p>, <strong>, <ul>, <li>), sin markdown, listo para insertarse en una página web.",
    `Escribe una descripción comercial (2-3 párrafos cortos) para una propuesta de capacitación titulada "${title || "Capacitación empresarial"}"${
      subtitle ? ` con el subtítulo "${subtitle}"` : ""
    }. Enfócate en el valor y el impacto para la organización.`,
  );

  return html;
});
