"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pencil,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  Plus,
  FileText,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/input";
import { Label, Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ClientFormModal } from "./client-form-modal";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, formatDateTime, formatMoneyByCurrency } from "@/lib/utils";
import type { Client, ClientNote, Proposal } from "@/lib/types";

export function ClientDetail({
  client,
  proposals,
  notes,
  currentUserId,
}: {
  client: Client;
  proposals: Proposal[];
  notes: ClientNote[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [followUp, setFollowUp] = useState(client.proximo_seguimiento?.slice(0, 10) ?? "");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    const supabase = createClient();
    const { error } = await supabase.from("client_notes").insert({
      client_id: client.id,
      nota: noteText.trim(),
      created_by: currentUserId,
    });
    await supabase
      .from("clients")
      .update({ ultimo_contacto: new Date().toISOString() })
      .eq("id", client.id);
    setSavingNote(false);
    if (error) {
      toast.error("No se pudo guardar la nota.");
      return;
    }
    setNoteText("");
    toast.success("Nota agregada.");
    router.refresh();
  }

  async function saveFollowUp() {
    setSavingFollowUp(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("clients")
      .update({ proximo_seguimiento: followUp || null })
      .eq("id", client.id);
    setSavingFollowUp(false);
    if (error) {
      toast.error("No se pudo actualizar el seguimiento.");
      return;
    }
    toast.success("Próximo seguimiento actualizado.");
    router.refresh();
  }

  const totalMonto = formatMoneyByCurrency(
    Array.from(
      proposals
        .reduce((map, p) => {
          const amount = p.precio_promocional ?? p.precio_normal ?? 0;
          if (!amount) return map;
          map.set(p.moneda, (map.get(p.moneda) ?? 0) + amount);
          return map;
        }, new Map<string, number>())
        .entries(),
    ).map(([currency, amount]) => ({ currency, amount })),
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{client.empresa}</h2>
                <p className="text-sm text-muted">{client.nombre_contacto}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {client.cargo && (
                <div className="flex items-center gap-2.5 text-muted">
                  <Briefcase className="h-4 w-4 shrink-0" /> {client.cargo}
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2.5 text-muted">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${client.email}`} className="hover:text-primary truncate">{client.email}</a>
                </div>
              )}
              {client.celular && (
                <div className="flex items-center gap-2.5 text-muted">
                  <Phone className="h-4 w-4 shrink-0" /> {client.celular}
                </div>
              )}
              {client.whatsapp && (
                <div className="flex items-center gap-2.5 text-muted">
                  <MessageCircle className="h-4 w-4 shrink-0" /> {client.whatsapp}
                </div>
              )}
              {(client.ciudad || client.pais) && (
                <div className="flex items-center gap-2.5 text-muted">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {[client.ciudad, client.pais].filter(Boolean).join(", ")}
                </div>
              )}
            </div>

            {client.observaciones && (
              <div className="mt-5 rounded-xl bg-surface-2 p-3.5 text-sm text-muted">
                {client.observaciones}
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
              <div>
                <p className="text-muted text-xs">Cotizaciones</p>
                <p className="font-semibold">{proposals.length}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Monto total</p>
                <p className="font-semibold">{totalMonto}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Cliente desde</p>
                <p className="font-semibold">{formatDate(client.created_at)}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Último contacto</p>
                <p className="font-semibold">{formatDate(client.ultimo_contacto)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarClock className="h-4 w-4" /> Próximo seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="followup">Fecha</Label>
              <Input id="followup" type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
            </div>
            <Button onClick={saveFollowUp} loading={savingFollowUp} variant="secondary">
              Guardar
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Tabs defaultValue="cotizaciones">
          <TabsList>
            <TabsTrigger value="cotizaciones">Cotizaciones</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="cotizaciones" className="mt-4">
            <Card className="p-0 overflow-hidden">
              {proposals.length === 0 ? (
                <EmptyState icon={FileText} title="Sin cotizaciones" description="Este cliente aún no tiene propuestas creadas." />
              ) : (
                <div className="divide-y divide-border">
                  {proposals.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/cotizaciones/${p.id}`}
                      className="flex items-center justify-between gap-3 p-4 hover:bg-surface-2/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.titulo}</p>
                        <p className="text-xs text-muted">
                          {p.numero} · {formatDate(p.fecha)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-medium">
                          {formatCurrency(p.precio_promocional ?? p.precio_normal, p.moneda)}
                        </span>
                        <StatusBadge status={p.estado} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notas" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <form onSubmit={addNote} className="flex items-start gap-2">
                  <Textarea
                    placeholder="Escribe una nota de seguimiento…"
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" loading={savingNote} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {notes.length === 0 ? (
              <Card>
                <EmptyState title="Sin notas" description="Registra observaciones y avances de la relación comercial." />
              </Card>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <Card key={n.id} className="p-4">
                    <p className="text-sm">{n.nota}</p>
                    <p className="mt-2 text-xs text-muted">{formatDateTime(n.created_at)}</p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ClientFormModal open={editOpen} onClose={() => setEditOpen(false)} client={client} currentUserId={currentUserId} />
    </div>
  );
}
