"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
  currentUserId: string;
}

const emptyForm = {
  empresa: "",
  nombre_contacto: "",
  cargo: "",
  celular: "",
  whatsapp: "",
  email: "",
  ciudad: "",
  pais: "",
  observaciones: "",
};

export function ClientFormModal({ open, onClose, client, currentUserId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(() =>
    client
      ? {
          empresa: client.empresa,
          nombre_contacto: client.nombre_contacto,
          cargo: client.cargo ?? "",
          celular: client.celular ?? "",
          whatsapp: client.whatsapp ?? "",
          email: client.email ?? "",
          ciudad: client.ciudad ?? "",
          pais: client.pais ?? "",
          observaciones: client.observaciones ?? "",
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.empresa.trim() || !form.nombre_contacto.trim()) {
      toast.error("La empresa y el nombre de contacto son obligatorios.");
      return;
    }
    setSaving(true);
    const supabase = createClient();

    const payload = {
      ...form,
      cargo: form.cargo || null,
      celular: form.celular || null,
      whatsapp: form.whatsapp || null,
      email: form.email || null,
      ciudad: form.ciudad || null,
      pais: form.pais || null,
      observaciones: form.observaciones || null,
    };

    const { error } = client
      ? await supabase.from("clients").update(payload).eq("id", client.id)
      : await supabase.from("clients").insert({ ...payload, owner_id: currentUserId });

    setSaving(false);

    if (error) {
      toast.error("No se pudo guardar el cliente: " + error.message);
      return;
    }

    toast.success(client ? "Cliente actualizado." : "Cliente creado.");
    onClose();
    router.refresh();
    if (!client) setForm(emptyForm);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={client ? "Editar cliente" : "Nuevo cliente"}
      description="Datos de la empresa y persona de contacto."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="empresa">Empresa *</Label>
            <Input id="empresa" required value={form.empresa} onChange={(e) => update("empresa", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="nombre_contacto">Nombre del contacto *</Label>
            <Input
              id="nombre_contacto"
              required
              value={form.nombre_contacto}
              onChange={(e) => update("nombre_contacto", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" value={form.cargo} onChange={(e) => update("cargo", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="celular">Celular</Label>
            <Input id="celular" value={form.celular} onChange={(e) => update("celular", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input id="ciudad" value={form.ciudad} onChange={(e) => update("ciudad", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pais">País</Label>
            <Input id="pais" value={form.pais} onChange={(e) => update("pais", e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            rows={3}
            value={form.observaciones}
            onChange={(e) => update("observaciones", e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {client ? "Guardar cambios" : "Crear cliente"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
