"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiAssistButton<T = unknown>({
  action,
  context,
  onResult,
  label = "Generar con IA",
}: {
  action: string;
  context: Record<string, unknown>;
  onResult: (result: T) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "No se pudo generar el contenido con IA.");
        return;
      }

      onResult(data.result);
      toast.success("Contenido generado con IA.");
    } catch {
      toast.error("Error de conexión al generar con IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="gold" size="sm" onClick={handleClick} loading={loading}>
      <Sparkles className="h-3.5 w-3.5" /> {label}
    </Button>
  );
}
