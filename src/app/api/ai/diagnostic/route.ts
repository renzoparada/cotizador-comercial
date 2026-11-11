import { generateJson } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

const SYSTEM = `Eres un consultor senior de estrategia y desarrollo organizacional para empresas latinoamericanas.
Recibes los resultados de un diagnóstico empresarial 360° (no financiero) y redactas, en español neutro, un informe preliminar claro, honesto y accionable.
No inventes datos que no estén en la información recibida. Habla de la organización, nunca de personas.
Responde SOLO con JSON con esta forma:
{
  "resumen": "3–5 oraciones de resumen ejecutivo",
  "hallazgos": ["4–6 hallazgos clave"],
  "causas_raiz": ["3–4 causas raíz probables, conectando síntomas"],
  "recomendaciones": [{"accion": "acción concreta", "plazo": "0–30 días | 1–3 meses | 3–12 meses", "impacto": "Alto | Medio"}],
  "preguntas_profundizar": ["5 preguntas abiertas para una entrevista de profundización con la dirección"]
}`;

export const POST = withAiRoute(async (body) => {
  const prompt = `Datos del diagnóstico:\n${JSON.stringify(body, null, 2).slice(0, 12000)}`;
  return generateJson(SYSTEM, prompt);
});
