"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { ResultBox } from "./result-box";
import type { Client } from "@/lib/types";

export function CoverLetterTool({ clients }: { clients: Client[] }) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    const client = clients.find((c) => c.id === clientId);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client?.nombre_contacto,
          company: client?.empresa,
          contactRole: client?.cargo,
          trainingTitle,
          trainerName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo generar la carta.");
        return;
      }
      setResult(data.result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" /> Carta de presentación personalizada
        </CardTitle>
        <CardDescription>Genera una carta breve para acompañar el envío de la propuesta a un cliente específico.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>Cliente</Label>
            <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.empresa}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Título de la capacitación</Label>
            <Input value={trainingTitle} onChange={(e) => setTrainingTitle(e.target.value)} />
          </div>
          <div>
            <Label>Nombre del entrenador</Label>
            <Input value={trainerName} onChange={(e) => setTrainerName(e.target.value)} />
          </div>
        </div>
        <Button onClick={handleGenerate} loading={loading}>
          Generar carta
        </Button>
        <ResultBox text={result} />
      </CardContent>
    </Card>
  );
}
