import type { Metadata } from "next";
import { ClientLoader } from "./client-loader";

export const metadata: Metadata = {
  title: "Diagnóstico Empresarial 360°",
  description:
    "Evaluación estratégica, comercial y organizacional: descubra los dolores, fallas internas y oportunidades de su empresa sin información financiera.",
};

export default function DiagnosticoPage() {
  return <ClientLoader />;
}
