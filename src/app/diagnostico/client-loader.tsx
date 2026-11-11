"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// La app vive en el navegador (respuestas en localStorage), por eso se omite el prerender.
const DiagnosticApp = dynamic(() => import("@/components/diagnostic/diagnostic-app").then((m) => m.DiagnosticApp), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-muted">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  ),
});

export function ClientLoader() {
  return <DiagnosticApp />;
}
