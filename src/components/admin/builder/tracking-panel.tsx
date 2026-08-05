import { Eye, MousePointerClick, Monitor, Globe2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import type { ProposalEvent, ProposalView } from "@/lib/types";

const EVENT_LABEL: Record<string, string> = {
  enviada: "Enviada",
  vista: "Vista",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
};

export function TrackingPanel({
  views,
  events,
  viewCount,
  firstViewedAt,
  lastViewedAt,
}: {
  views: ProposalView[];
  events: ProposalEvent[];
  viewCount: number;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted">Veces vista</p>
          <p className="mt-1 text-2xl font-semibold">{viewCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Primera apertura</p>
          <p className="mt-1 text-sm font-medium">{formatDateTime(firstViewedAt)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Última apertura</p>
          <p className="mt-1 text-sm font-medium">{formatDateTime(lastViewedAt)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <MousePointerClick className="h-4 w-4" /> Línea de tiempo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <EmptyState className="py-10" title="Aún sin actividad" description="Cuando el cliente abra el enlace verás cada evento aquí." />
          ) : (
            <div className="divide-y divide-border">
              {events.map((e) => (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {e.tipo === "aceptada" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : e.tipo === "rechazada" ? (
                      <XCircle className="h-4 w-4 text-danger" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{EVENT_LABEL[e.tipo] ?? e.tipo}</p>
                    <p className="text-xs text-muted">{formatDateTime(e.created_at)}</p>
                  </div>
                  {e.ip && <span className="text-xs text-muted">{e.ip}</span>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Globe2 className="h-4 w-4" /> Visitas detalladas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {views.length === 0 ? (
            <EmptyState className="py-10" title="Sin visitas" description="Comparte el enlace para empezar a recibir visitas." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-5 py-2.5 font-medium">Fecha</th>
                    <th className="px-5 py-2.5 font-medium">Dispositivo</th>
                    <th className="px-5 py-2.5 font-medium">Navegador</th>
                    <th className="px-5 py-2.5 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {views.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-2.5 text-muted">{formatDateTime(v.viewed_at)}</td>
                      <td className="px-5 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <Monitor className="h-3.5 w-3.5 text-muted" /> {v.device}
                        </span>
                      </td>
                      <td className="px-5 py-2.5">{v.browser}</td>
                      <td className="px-5 py-2.5 text-muted">{v.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
