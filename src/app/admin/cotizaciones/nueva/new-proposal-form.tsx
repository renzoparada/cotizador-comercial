"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { generateProposalCode } from "@/lib/utils";
import { EMPTY_PROPOSAL_CONTENT } from "@/lib/types";
import type { Client } from "@/lib/types";

export function NewProposalForm({
  clients,
  currentUserId,
  defaultClientId,
}: {
  clients: Client[];
  currentUserId: string;
  defaultClientId?: string;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(defaultClientId ?? clients[0]?.id ?? "");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!clientId) {
      toast.error("Selecciona un cliente para continuar.");
      return;
    }
    setCreating(true);
    const supabase = createClient();
    const client = clients.find((c) => c.id === clientId);

    let attempt = 0;
    let lastError: string | null = null;

    while (attempt < 5) {
      const slug = generateProposalCode();
      const { data, error } = await supabase
        .from("proposals")
        .insert({
          client_id: clientId,
          owner_id: currentUserId,
          slug,
          titulo: client ? `Propuesta para ${client.empresa}` : "Nueva propuesta comercial",
          content: {
            ...EMPTY_PROPOSAL_CONTENT,
            header: {
              ...EMPTY_PROPOSAL_CONTENT.header,
              title: client ? `Propuesta para ${client.empresa}` : "Nueva propuesta comercial",
            },
          },
        })
        .select("id")
        .single();

      if (!error && data) {
        router.push(`/admin/cotizaciones/${data.id}`);
        return;
      }

      lastError = error?.message ?? "Error desconocido";
      attempt += 1;
    }

    setCreating(false);
    toast.error("No se pudo crear la cotización: " + lastError);
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building2 className="mx-auto mb-3 h-8 w-8 text-muted" />
          <p className="font-medium">Primero necesitas un cliente</p>
          <p className="mt-1 text-sm text-muted">Crea un cliente para poder generar una propuesta comercial.</p>
          <Button className="mt-4" onClick={() => router.push("/admin/clientes")}>
            Ir a Clientes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg">
      <CardContent className="p-6">
        <Label htmlFor="client">Cliente</Label>
        <Select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.empresa} — {c.nombre_contacto}
            </option>
          ))}
        </Select>
        <p className="mt-2 text-xs text-muted">
          Se creará la cotización en estado <strong>Borrador</strong>. Podrás construir la propuesta a continuación.
        </p>
        <Button className="mt-5 w-full" onClick={handleCreate} loading={creating}>
          Continuar al constructor <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
