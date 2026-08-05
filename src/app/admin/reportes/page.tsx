import { createClient } from "@/lib/supabase/server";
import { listProposals } from "@/lib/queries/proposals";
import { getDashboardData } from "@/lib/queries/dashboard";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { MonthlyChart } from "@/components/admin/dashboard/monthly-chart";
import { ExportButtons } from "@/components/admin/proposals/export-buttons";
import { ProposalsFilterBar } from "@/components/admin/proposals/filter-bar";
import { ProposalsTable } from "@/components/admin/proposals/proposals-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FileText, DollarSign, TrendingUp } from "lucide-react";
import type { ProposalStatus } from "@/lib/types";

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [proposals, dashboard] = await Promise.all([
    listProposals(supabase, {
      q: params.q,
      estado: (params.estado as ProposalStatus) || "",
      from: params.from,
      to: params.to,
    }),
    getDashboardData(supabase),
  ]);

  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Analiza tu desempeño comercial y exporta la información a PDF, Excel o CSV."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Cotizaciones totales" value={String(dashboard.total)} icon={FileText} tone="primary" />
        <StatCard label="Monto cotizado" value={formatCurrency(dashboard.montoCotizado)} icon={DollarSign} tone="primary" />
        <StatCard label="Conversión" value={`${dashboard.conversion.toFixed(1)}%`} icon={TrendingUp} tone="gold" />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tendencia mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart data={dashboard.monthly} />
        </CardContent>
      </Card>

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <ProposalsFilterBar />
        <ExportButtons proposals={proposals} />
      </div>

      <ProposalsTable proposals={proposals} />
    </div>
  );
}
