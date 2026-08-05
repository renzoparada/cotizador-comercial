"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { generateProposalCode } from "@/lib/utils";
import { EMPTY_PROPOSAL_CONTENT } from "@/lib/types";
import type { Client } from "@/lib/types";
import type { FullProposalAi } from "@/app/api/ai/full-proposal/route";

export function FullProposalTool({ clients, currentUserId }: { clients: Client[]; currentUserId: string }) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [trainingType, setTrainingType] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<FullProposalAi | null>(null);

  async function handleGenerate() {
    if (!trainingType.trim()) {
      toast.error("Describe el tipo de capacitación.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/full-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingType, audience }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo generar la propuesta.");
        return;
      }
      setPreview(data.result as FullProposalAi);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!preview || !clientId) return;
    setLoading(true);
    const supabase = createClient();
    const client = clients.find((c) => c.id === clientId);

    const content = {
      ...EMPTY_PROPOSAL_CONTENT,
      header: { ...EMPTY_PROPOSAL_CONTENT.header, title: preview.title, subtitle: preview.subtitle },
      description: { html: preview.description_html },
      objectives: preview.objectives.map((text) => ({ id: crypto.randomUUID(), text })),
      benefits: preview.benefits.map((text) => ({ id: crypto.randomUUID(), icon: "check", text })),
      agenda: preview.agenda.map((m) => ({ id: crypto.randomUUID(), ...m })),
      methodology: { items: preview.methodology },
      includes: preview.includes.map((text) => ({ id: crypto.randomUUID(), text })),
      bonus: preview.bonus.map((text) => ({ id: crypto.randomUUID(), text })),
      duration: preview.duration,
    };

    const { data, error } = await supabase
      .from("proposals")
      .insert({
        client_id: clientId,
        owner_id: currentUserId,
        slug: generateProposalCode(),
        titulo: preview.title,
        content,
      })
      .select("id")
      .single();

    setLoading(false);
    if (error || !data) {
      toast.error("No se pudo crear la cotización: " + error?.message);
      return;
    }
    toast.success(`Propuesta creada para ${client?.empresa ?? "el cliente"}.`);
    router.push(`/admin/cotizaciones/${data.id}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" /> Generar propuesta completa
        </CardTitle>
        <CardDescription>
          Describe el tipo de capacitación y la IA redactará título, descripción, objetivos, temario, metodología e incluye.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Tipo de capacitación</Label>
            <Input value={trainingType} onChange={(e) => setTrainingType(e.target.value)} placeholder="Ej. Liderazgo de equipos remotos" />
          </div>
          <div>
            <Label>Audiencia (opcional)</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ej. Mandos medios y supervisores" />
          </div>
        </div>
        <Button onClick={handleGenerate} loading={loading} variant="gold">
          <Sparkles className="h-4 w-4" /> Generar con IA
        </Button>

        {preview && (
          <div className="mt-2 space-y-4 rounded-xl border border-border bg-surface-2 p-4">
            <div>
              <p className="text-lg font-semibold">{preview.title}</p>
              <p className="text-sm text-muted">{preview.subtitle}</p>
            </div>
            <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: preview.description_html }} />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted">Objetivos</p>
              <ul className="list-disc pl-5 text-sm">
                {preview.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted">Temario</p>
              <ul className="list-disc pl-5 text-sm">
                {preview.agenda.map((m, i) => (
                  <li key={i}>{m.titulo}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              <Label>Crear cotización para el cliente</Label>
              <div className="flex gap-2">
                <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.empresa}
                    </option>
                  ))}
                </Select>
                <Button onClick={handleCreate} loading={loading}>
                  Crear <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
