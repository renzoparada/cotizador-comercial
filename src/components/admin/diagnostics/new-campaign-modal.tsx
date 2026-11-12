"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function campaignUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/diagnostico/${slug}`;
}

/** Botón + modal para crear un diagnóstico 360° vinculado a un cliente. */
export function NewCampaignButton({
  clients,
  fixedClientId,
  currentUserId,
  variant = "primary",
}: {
  clients?: { id: string; empresa: string }[];
  fixedClientId?: string;
  currentUserId: string;
  variant?: "primary" | "outline";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState(fixedClientId ?? "");
  const [titulo, setTitulo] = useState("Diagnóstico Empresarial 360°");
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) {
      toast.error("Seleccione un cliente.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("diagnostic_campaigns")
      .insert({ client_id: clientId, owner_id: currentUserId, titulo: titulo.trim() || "Diagnóstico Empresarial 360°", notas: notas.trim() || null })
      .select("id")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("No se pudo crear el diagnóstico.", { description: error?.message });
      return;
    }
    toast.success("Diagnóstico creado", { description: "Comparta el enlace con los participantes." });
    setOpen(false);
    router.push(`/admin/diagnosticos/${data.id}`);
  }

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Nuevo diagnóstico
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo diagnóstico 360°" description="Se generará un enlace para que los participantes de la empresa respondan.">
        <form onSubmit={create} className="space-y-4">
          {!fixedClientId && (
            <div>
              <Label htmlFor="dc-client">Cliente</Label>
              <Select id="dc-client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Seleccione…</option>
                {(clients ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.empresa}
                  </option>
                ))}
              </Select>
              {clients?.length === 0 && <p className="mt-1.5 text-xs text-muted">Primero registre un cliente en la sección Clientes.</p>}
            </div>
          )}
          <div>
            <Label htmlFor="dc-title">Título</Label>
            <Input id="dc-title" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dc-notes">Notas internas (opcional)</Label>
            <Textarea id="dc-notes" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Objetivo del diagnóstico, participantes esperados…" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Crear diagnóstico
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
