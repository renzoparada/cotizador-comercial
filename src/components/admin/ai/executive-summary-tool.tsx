"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import { ResultBox } from "./result-box";
import { formatCurrency } from "@/lib/utils";
import type { ProposalWithClient } from "@/lib/types";

export function ExecutiveSummaryTool({ proposals }: { proposals: ProposalWithClient[] }) {
  const [proposalId, setProposalId] = useState(proposals[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) {
      toast.error("Selecciona una cotización.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/executive-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proposal.content.header.title,
          objectives: proposal.content.objectives.map((o) => o.text),
          agendaTitles: proposal.content.agenda.map((a) => a.titulo),
          duration: proposal.content.duration.horas,
          price: formatCurrency(proposal.precio_promocional ?? proposal.precio_normal, proposal.moneda),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo generar el resumen.");
        return;
      }
      setResult(data.result);
    } finally {
      setLoading(false);
    }
  }

  if (proposals.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Resumen ejecutivo
        </CardTitle>
        <CardDescription>Convierte una propuesta ya creada en un resumen corto y directo, ideal para enviar por correo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Cotización</Label>
          <Select value={proposalId} onChange={(e) => setProposalId(e.target.value)}>
            {proposals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.numero} — {p.client?.empresa ?? "Sin cliente"}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleGenerate} loading={loading}>
          Generar resumen
        </Button>
        <ResultBox text={result} />
      </CardContent>
    </Card>
  );
}
