import Link from "next/link";
import { Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProposalWithClient } from "@/lib/types";

export function ProposalsTable({ proposals }: { proposals: ProposalWithClient[] }) {
  if (proposals.length === 0) {
    return (
      <Card>
        <EmptyState icon={FileText} title="Sin cotizaciones" description="Crea tu primera propuesta comercial para empezar." />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Número</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Título</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Monto</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Vistas</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/admin/cotizaciones/${p.id}`} className="font-medium text-primary hover:underline">
                    {p.numero}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/cotizaciones/${p.id}`} className="flex items-center gap-2.5">
                    <Avatar name={p.client?.empresa} size={28} />
                    <span className="truncate">{p.client?.empresa ?? "Sin cliente"}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 max-w-[220px] truncate text-muted">{p.titulo}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.estado} />
                </td>
                <td className="px-5 py-3 font-medium">{formatCurrency(p.precio_promocional ?? p.precio_normal, p.moneda)}</td>
                <td className="px-5 py-3 text-muted">{formatDate(p.fecha)}</td>
                <td className="px-5 py-3 text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {p.view_count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
