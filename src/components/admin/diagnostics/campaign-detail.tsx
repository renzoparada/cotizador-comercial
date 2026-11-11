"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, ExternalLink, Eye, MessageCircle, Printer, Trash2, Upload, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import { LEVELS } from "@/lib/diagnostic/questions";
import { maturityFor } from "@/lib/diagnostic/catalog";
import { computeScores, rowToResponse, sanitizeAnswers, sanitizeInfo } from "@/lib/diagnostic/sanitize";
import { isResponse } from "@/lib/diagnostic/storage";
import { averageScore, type CampaignWithResponses } from "@/lib/queries/diagnostics";
import { TeamReportView } from "@/components/diagnostic/team-report";

export function CampaignDetail({ campaign, publicUrl }: { campaign: CampaignWithResponses; publicUrl: string }) {
  const router = useRouter();
  const [abierta, setAbierta] = useState(campaign.abierta);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const url = publicUrl;

  const completed = useMemo(() => campaign.responses.filter((r) => r.completed_at), [campaign.responses]);
  const responses = useMemo(() => completed.map(rowToResponse), [completed]);
  const avg = averageScore(campaign.responses);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    } catch {
      window.prompt("Copie este enlace:", url);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hola, le comparto el cuestionario de ${campaign.titulo} para ${campaign.client?.empresa ?? "la empresa"}. Toma unos 15 minutos y sus respuestas son confidenciales: ${url}`,
  );

  async function toggle(v: boolean) {
    setAbierta(v);
    const { error } = await createClient().from("diagnostic_campaigns").update({ abierta: v, updated_at: new Date().toISOString() }).eq("id", campaign.id);
    if (error) {
      setAbierta(!v);
      toast.error("No se pudo actualizar el estado.");
      return;
    }
    toast.success(v ? "Diagnóstico abierto: se aceptan respuestas" : "Diagnóstico cerrado: no se aceptan más respuestas");
    router.refresh();
  }

  async function removeResponse(id: string) {
    if (!window.confirm("¿Eliminar las respuestas de este participante?")) return;
    const { error } = await createClient().from("diagnostic_responses").delete().eq("id", id);
    if (error) {
      toast.error("No se pudo eliminar.");
      return;
    }
    toast.success("Respuesta eliminada");
    router.refresh();
  }

  async function removeCampaign() {
    if (!window.confirm("¿Eliminar este diagnóstico y todas sus respuestas? Esta acción no se puede deshacer.")) return;
    setBusy(true);
    const { error } = await createClient().from("diagnostic_campaigns").delete().eq("id", campaign.id);
    setBusy(false);
    if (error) {
      toast.error("No se pudo eliminar el diagnóstico.");
      return;
    }
    toast.success("Diagnóstico eliminado");
    router.push(campaign.client ? `/admin/clientes/${campaign.client.id}` : "/admin/diagnosticos");
    router.refresh();
  }

  /** Importa archivos JSON exportados desde el modo libre (/diagnostico). */
  async function importFiles(files: FileList | null) {
    if (!files?.length) return;
    const rows: Record<string, unknown>[] = [];
    for (const f of Array.from(files)) {
      try {
        const data = JSON.parse(await f.text());
        for (const x of Array.isArray(data) ? data : [data]) {
          if (!isResponse(x)) continue;
          const answers = sanitizeAnswers(x.answers);
          const { global, dimensions } = computeScores(answers);
          rows.push({
            campaign_id: campaign.id,
            info: { ...sanitizeInfo(x.info), company: campaign.client?.empresa ?? x.info.company },
            answers,
            global_score: global,
            dimension_scores: dimensions,
            completed_at: x.completedAt ?? new Date().toISOString(),
            user_agent: "importado",
          });
        }
      } catch {
        toast.error(`No se pudo leer ${f.name}`);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
    if (!rows.length) {
      toast.error("No se encontraron respuestas válidas.");
      return;
    }
    const { error } = await createClient().from("diagnostic_responses").insert(rows);
    if (error) {
      toast.error("No se pudieron importar las respuestas.", { description: error.message });
      return;
    }
    toast.success(`${rows.length} respuesta(s) importadas`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="no-print">
        <CardContent className="grid gap-5 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted">Enlace para los participantes</p>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-surface-2 px-3 py-2 text-sm">{url}</code>
              <Button variant="outline" size="icon" onClick={copy} aria-label="Copiar enlace">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-surface-2">
                <MessageCircle className="h-3.5 w-3.5" /> Enviar por WhatsApp
              </a>
              <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-surface-2">
                <ExternalLink className="h-3.5 w-3.5" /> Abrir cuestionario
              </a>
              <input ref={fileRef} type="file" accept="application/json,.json" multiple hidden onChange={(e) => importFiles(e.target.files)} />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" /> Importar JSON
              </Button>
            </div>
            {campaign.notas && <p className="mt-4 rounded-xl bg-surface-2 p-3 text-sm text-muted">{campaign.notas}</p>}
          </div>
          <div className="flex flex-row items-start gap-6 lg:flex-col lg:items-end">
            <label className="flex items-center gap-3 text-sm">
              <span>{abierta ? "Recibiendo respuestas" : "Cerrado"}</span>
              <Switch checked={abierta} onCheckedChange={toggle} />
            </label>
            <div className="text-right text-sm">
              <p className="text-muted">Participantes</p>
              <p className="text-2xl font-semibold">{completed.length}</p>
            </div>
            {avg !== null && (
              <div className="text-right text-sm">
                <p className="text-muted">Índice promedio</p>
                <p className="text-2xl font-semibold" style={{ color: maturityFor(avg).color }}>
                  {avg}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={completed.length ? "consolidado" : "participantes"}>
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
            <TabsTrigger value="participantes">Participantes ({completed.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} disabled={!completed.length}>
              <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={removeCampaign} loading={busy} className="text-danger">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar
            </Button>
          </div>
        </div>

        <TabsContent value="consolidado">
          {responses.length ? (
            <TeamReportView responses={responses} />
          ) : (
            <Card className="mt-6">
              <EmptyState icon={Users} title="Aún no hay respuestas" description="Comparta el enlace con accionistas, dirección, mandos medios y equipo. El consolidado aparecerá aquí." />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participantes" className="mt-6">
          <Card className="overflow-hidden p-0">
            {campaign.responses.length === 0 ? (
              <EmptyState icon={Users} title="Sin participantes" description="Todavía nadie ha respondido este diagnóstico." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2 text-left text-xs text-muted">
                    <tr>
                      <th className="p-3">Participante</th>
                      <th className="p-3">Nivel</th>
                      <th className="p-3 text-right">Índice</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.responses.map((r) => {
                      const level = LEVELS.find((l) => l.id === r.info?.level)?.label ?? "—";
                      return (
                        <tr key={r.id} className="border-t border-border">
                          <td className="p-3">
                            <p className="font-medium">{r.info?.name || "Anónimo"}</p>
                            <p className="text-xs text-muted">{r.info?.role || "—"}</p>
                          </td>
                          <td className="p-3 text-muted">{level}</td>
                          <td className="p-3 text-right font-semibold tabular-nums" style={{ color: r.global_score !== null ? maturityFor(r.global_score).color : undefined }}>
                            {r.global_score ?? "—"}
                          </td>
                          <td className="p-3">
                            <Badge tone={r.completed_at ? "success" : "warning"}>{r.completed_at ? "Completado" : "En progreso"}</Badge>
                          </td>
                          <td className="whitespace-nowrap p-3 text-muted">{formatDateTime(r.updated_at)}</td>
                          <td className="p-3">
                            <div className="flex justify-end gap-1">
                              <Link href={`/admin/diagnosticos/${campaign.id}/respuestas/${r.id}`} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-foreground" aria-label="Ver informe">
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button onClick={() => removeResponse(r.id)} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-danger" aria-label="Eliminar">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
