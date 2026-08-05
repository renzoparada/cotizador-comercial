import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/queries/dashboard";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { MonthlyChart } from "@/components/admin/dashboard/monthly-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Building2,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const data = await getDashboardData(supabase);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de tu actividad comercial y conversión de propuestas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de cotizaciones" value={String(data.total)} icon={FileText} tone="primary" />
        <StatCard label="Aceptadas" value={String(data.aceptadas)} icon={CheckCircle2} tone="success" />
        <StatCard label="Rechazadas" value={String(data.rechazadas)} icon={XCircle} tone="danger" />
        <StatCard label="Pendientes" value={String(data.pendientes)} icon={Clock} tone="warning" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Monto cotizado" value={formatCurrency(data.montoCotizado)} icon={DollarSign} tone="primary" />
        <StatCard label="Monto aceptado" value={formatCurrency(data.montoAceptado)} icon={DollarSign} tone="success" />
        <StatCard label="Conversión" value={`${data.conversion.toFixed(1)}%`} icon={TrendingUp} tone="gold" hint="Aceptadas sobre enviadas" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cotizaciones por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={data.monthly} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top clientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topClients.length === 0 && (
              <p className="text-sm text-muted">Aún no hay datos suficientes.</p>
            )}
            {data.topClients.map((c, i) => (
              <div key={c.empresa} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-sm font-semibold text-muted">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.empresa}</p>
                  <p className="text-xs text-muted">{c.count} cotización(es)</p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(c.monto)}</p>
              </div>
            ))}
            {data.topClients.length === 0 && (
              <div className="flex h-32 items-center justify-center text-muted">
                <Building2 className="h-8 w-8" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
