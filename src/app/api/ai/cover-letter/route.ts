import { generateText } from "@/lib/ai/client";
import { withAiRoute } from "@/lib/ai/route-helper";

export const POST = withAiRoute(async (body) => {
  const { clientName, company, contactRole, trainingTitle, trainerName } = body as {
    clientName?: string;
    company?: string;
    contactRole?: string;
    trainingTitle?: string;
    trainerName?: string;
  };

  const letter = await generateText(
    "Eres un asesor comercial senior redactando cartas de presentación personalizadas y cálidas, en español, para propuestas de capacitación corporativa. Máximo 180 palabras.",
    `Escribe una carta de presentación breve dirigida a ${clientName || "el cliente"}${
      contactRole ? `, ${contactRole}` : ""
    } de ${company || "la empresa"}, presentando la propuesta "${trainingTitle || "la capacitación"}"${
      trainerName ? `, facilitada por ${trainerName}` : ""
    }. Tono cercano pero profesional. Cierra invitando a revisar la propuesta adjunta.`,
  );

  return letter;
});
