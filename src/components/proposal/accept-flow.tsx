"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, PartyPopper, ThumbsDown, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { ProposalStatus } from "@/lib/types";

export function AcceptFlow({ slug, initialStatus }: { slug: string; initialStatus: ProposalStatus }) {
  const [status, setStatus] = useState<ProposalStatus>(initialStatus);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, nombre, cargo }),
      });
      if (!res.ok) throw new Error();
      setStatus("aceptada");
      setConfirmOpen(false);
      toast.success("¡Propuesta aceptada con éxito!");
    } catch {
      toast.error("No se pudo registrar la aceptación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, motivo }),
      });
      if (!res.ok) throw new Error();
      setStatus("rechazada");
      setRejectOpen(false);
      toast.success("Hemos registrado tu respuesta. Gracias por avisarnos.");
    } catch {
      toast.error("No se pudo registrar tu respuesta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "aceptada") {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-success/25 bg-success/10 p-8 text-center">
        <PartyPopper className="mx-auto h-9 w-9 text-success" />
        <p className="mt-3 text-lg font-semibold text-success">¡Propuesta aceptada!</p>
        <p className="mt-1 text-sm text-muted">
          Gracias por tu confianza. Nuestro equipo se pondrá en contacto para coordinar los próximos pasos.
        </p>
      </div>
    );
  }

  if (status === "rechazada") {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface-2 p-8 text-center">
        <p className="text-sm text-muted">Has indicado que esta propuesta no continúa por ahora. Gracias por tu tiempo.</p>
      </div>
    );
  }

  if (status === "vencida") {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-warning/25 bg-warning/10 p-8 text-center">
        <p className="text-sm font-medium text-warning">Esta propuesta ha vencido.</p>
        <p className="mt-1 text-sm text-muted">Contáctanos para solicitar una nueva cotización actualizada.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
        <Button size="lg" className="w-full text-base h-14 rounded-2xl" onClick={() => setConfirmOpen(true)}>
          <CheckCircle2 className="h-5 w-5" />
          Aceptar Cotización
        </Button>
      </motion.div>
      <button
        onClick={() => setRejectOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-danger transition-colors cursor-pointer"
      >
        <ThumbsDown className="h-3.5 w-3.5" /> No estoy interesado por ahora
      </button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar aceptación"
        description="¿Confirma que acepta esta propuesta?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAccept} loading={loading}>
              <CheckCircle2 className="h-4 w-4" /> Aceptar
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Al confirmar, quedará registrada la aceptación de esta propuesta comercial con fecha, hora e IP.
          </p>
          <div>
            <Label htmlFor="nombre">Tu nombre (opcional)</Label>
            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cargo">Cargo (opcional)</Label>
            <Input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
          </div>
        </div>
      </Modal>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Rechazar propuesta"
        description="Cuéntanos brevemente el motivo, nos ayuda a mejorar."
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              <X className="h-4 w-4" /> Cancelar
            </Button>
            <Button variant="danger" onClick={handleReject} loading={loading}>
              Confirmar rechazo
            </Button>
          </>
        }
      >
        <Textarea rows={3} placeholder="Motivo (opcional)" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      </Modal>
    </div>
  );
}
