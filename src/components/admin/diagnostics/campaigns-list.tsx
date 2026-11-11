"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Link2, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { maturityFor } from "@/lib/diagnostic/catalog";
import { averageScore, type CampaignListItem } from "@/lib/queries/diagnostics";
import { campaignUrl } from "./new-campaign-modal";

export function CampaignsList({ campaigns, showClient = true, emptyAction }: { campaigns: CampaignListItem[]; showClient?: boolean; emptyAction?: React.ReactNode }) {
  if (!campaigns.length) {
    return (
      <EmptyState
        icon={Radar}
        title="Sin diagnósticos"
        description="Cree un diagnóstico 360°, comparta el enlace con la empresa y vea el consolidado aquí."
        action={emptyAction}
      />
    );
  }

  const copy = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(campaignUrl(slug));
      toast.success("Enlace copiado");
    } catch {
      window.prompt("Copie este enlace:", campaignUrl(slug));
    }
  };

  return (
    <div className="divide-y divide-border">
      {campaigns.map((c) => {
        const done = c.responses.filter((r) => r.completed_at).length;
        const avg = averageScore(c.responses);
        const level = avg === null ? null : maturityFor(avg);
        return (
          <div key={c.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-surface-2/50">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
              style={level ? { color: level.color, background: `color-mix(in srgb, ${level.color} 12%, transparent)` } : undefined}
            >
              {avg ?? "—"}
            </div>
            <Link href={`/admin/diagnosticos/${c.id}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{showClient ? c.client?.empresa ?? "Cliente eliminado" : c.titulo}</p>
              <p className="truncate text-xs text-muted">
                {showClient ? `${c.titulo} · ` : ""}
                {done} participante(s) · {formatDate(c.created_at)}
                {level ? ` · ${level.name}` : ""}
              </p>
            </Link>
            <Badge tone={c.abierta ? "success" : "neutral"}>{c.abierta ? "Abierto" : "Cerrado"}</Badge>
            <button onClick={() => copy(c.slug)} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-foreground" aria-label="Copiar enlace" title="Copiar enlace">
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
