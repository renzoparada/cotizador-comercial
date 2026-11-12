"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  Send,
  Trash2,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import type { ProposalStatus } from "@/lib/types";

export function ProposalToolbar({
  proposalId,
  slug,
  estado,
  saveState,
  onStatusChange,
}: {
  proposalId: string;
  slug: string;
  estado: ProposalStatus;
  saveState: "saved" | "saving" | "idle";
  onStatusChange: (estado: ProposalStatus) => void;
}) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const publicUrl =
    (process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || (typeof window !== "undefined" ? window.location.origin : "")) +
    `/cotizacion/${slug}`;

  async function handleSend() {
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.rpc("mark_proposal_sent", { p_id: proposalId });
    setSending(false);
    if (error) {
      toast.error("No se pudo enviar la cotización: " + error.message);
      return;
    }
    onStatusChange("enviada");
    navigator.clipboard.writeText(publicUrl).catch(() => {});
    toast.success("Cotización enviada. Copiamos el enlace — pégalo en WhatsApp, correo o donde prefieras para compartirlo con tu cliente.", {
      duration: 6000,
    });
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("proposals").delete().eq("id", proposalId);
    setDeleting(false);
    if (error) {
      toast.error("No se pudo eliminar: " + error.message);
      return;
    }
    toast.success("Cotización eliminada.");
    router.push("/admin/cotizaciones");
  }

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Enlace copiado al portapapeles.");
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Link href="/admin/cotizaciones" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Cotizaciones
      </Link>
      <div className="flex-1" />

      <span className="hidden items-center gap-1.5 text-xs text-muted sm:flex">
        {saveState === "saving" && (
          <>
            <Loader2 className="h-3 w-3 animate-spin" /> Guardando…
          </>
        )}
        {saveState === "saved" && (
          <>
            <Check className="h-3 w-3 text-success" /> Guardado
          </>
        )}
      </span>

      <StatusBadge status={estado} />

      <Button variant="outline" size="sm" onClick={copyLink}>
        <Copy className="h-3.5 w-3.5" /> Copiar enlace
      </Button>

      {estado !== "borrador" && (
        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3.5 w-3.5" /> Ver pública
          </Button>
        </a>
      )}

      {(estado === "borrador" || estado === "enviada") && (
        <Button size="sm" onClick={handleSend} loading={sending}>
          <Send className="h-3.5 w-3.5" /> {estado === "borrador" ? "Enviar" : "Reenviar"}
        </Button>
      )}

      <Button variant="danger" size="icon" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Eliminar cotización"
        description="Esta acción no se puede deshacer. Se eliminarán también sus visitas y eventos registrados."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Eliminar definitivamente
            </Button>
          </>
        }
      />
    </div>
  );
}
