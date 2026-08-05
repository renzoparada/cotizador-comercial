import { generateText } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

const TONE_LABEL: Record<string, string> = {
  ejecutivo: "ejecutivo y directo, orientado a resultados de negocio",
  comercial: "comercial y persuasivo, resaltando beneficios y urgencia",
  corporativo: "corporativo y formal, cuidando cada palabra",
};

export const POST = withAiRoute(async (body) => {
  const { text, tone } = body as { text?: string; tone?: string };
  if (!text?.trim()) throw new Error("Falta el texto a reescribir.");

  const toneDesc = TONE_LABEL[tone ?? "ejecutivo"] ?? TONE_LABEL.ejecutivo;

  const rewritten = await generateText(
    `Eres un editor experto en comunicación comercial B2B en español. Reescribe el texto que te dan en un tono ${toneDesc}, conservando el significado y el formato HTML si lo tiene, pero mejorando la redacción.`,
    text,
  );

  return rewritten;
});
