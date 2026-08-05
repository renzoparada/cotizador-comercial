"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Suggestion {
  titulo: string;
  motivo: string;
}

export function CrossSellTool() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  async function handleGenerate() {
    if (!title.trim()) {
      toast.error("Escribe el título de la capacitación base.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cross-sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo generar sugerencias.");
        return;
      }
      setSuggestions(data.result ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Cross-selling
        </CardTitle>
        <CardDescription>Recomienda capacitaciones adicionales para ofrecer junto con la propuesta actual.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la capacitación base" className="flex-1" />
          <Button onClick={handleGenerate} loading={loading}>
            Sugerir
          </Button>
        </div>
        {suggestions.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {suggestions.map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface-2 p-3.5">
                <p className="text-sm font-medium">{s.titulo}</p>
                <p className="mt-1 text-xs text-muted">{s.motivo}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
