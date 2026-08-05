"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = [
  { key: "ejecutivo", label: "Ejecutivo" },
  { key: "comercial", label: "Comercial" },
  { key: "corporativo", label: "Corporativo" },
];

export function RewriteToneButtons({ text, onResult }: { text: string; onResult: (html: string) => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function rewrite(tone: string) {
    if (!text.trim()) {
      toast.error("Escribe primero un texto para reescribir.");
      return;
    }
    setLoading(tone);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo reescribir el texto.");
        return;
      }
      onResult(data.result);
      toast.success(`Reescrito en tono ${tone}.`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <Wand2 className="h-3.5 w-3.5 text-muted" />
      {TONES.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => rewrite(t.key)}
          disabled={loading !== null}
          className={cn(
            "rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-50 cursor-pointer",
            loading === t.key && "border-gold text-gold",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
