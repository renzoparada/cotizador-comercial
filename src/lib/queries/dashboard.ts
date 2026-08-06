import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProposalStatus } from "@/lib/types";

interface RawProposal {
  id: string;
  estado: ProposalStatus;
  precio_normal: number | null;
  precio_promocional: number | null;
  mostrar_precio: boolean;
  moneda: string;
  created_at: string;
  client_id: string | null;
  client: { empresa: string } | { empresa: string }[] | null;
}

/** Monto agrupado por moneda — evita sumar montos de distintas monedas como si fueran una sola. */
export type MoneyByCurrency = { currency: string; amount: number }[];

export interface DashboardData {
  total: number;
  aceptadas: number;
  rechazadas: number;
  pendientes: number; // enviada + vista
  borradores: number;
  montoCotizado: MoneyByCurrency;
  montoAceptado: MoneyByCurrency;
  conversion: number;
  monthly: { month: string; total: number; aceptadas: number }[];
  topClients: { empresa: string; montos: MoneyByCurrency; count: number }[];
}

function montoDe(p: Pick<RawProposal, "precio_normal" | "precio_promocional">) {
  return p.precio_promocional ?? p.precio_normal ?? 0;
}

/** Suma montos agrupándolos por moneda, en vez de mezclar distintas monedas en un solo total. */
function sumByCurrency(proposals: RawProposal[]): MoneyByCurrency {
  const totals = new Map<string, number>();
  for (const p of proposals) {
    const amount = montoDe(p);
    if (!amount) continue;
    totals.set(p.moneda, (totals.get(p.moneda) ?? 0) + amount);
  }
  return Array.from(totals.entries())
    .map(([currency, amount]) => ({ currency, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getDashboardData(supabase: SupabaseClient): Promise<DashboardData> {
  const { data, error } = await supabase
    .from("proposals")
    .select(
      "id, estado, precio_normal, precio_promocional, mostrar_precio, moneda, created_at, client_id, client:clients(empresa)",
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  const proposals = (data ?? []) as unknown as RawProposal[];

  const total = proposals.length;
  const aceptadas = proposals.filter((p) => p.estado === "aceptada").length;
  const rechazadas = proposals.filter((p) => p.estado === "rechazada").length;
  const pendientes = proposals.filter((p) => p.estado === "enviada" || p.estado === "vista").length;
  const borradores = proposals.filter((p) => p.estado === "borrador").length;

  const enviadas = proposals.filter((p) => p.estado !== "borrador");
  const montoCotizado = sumByCurrency(enviadas);
  const montoAceptado = sumByCurrency(proposals.filter((p) => p.estado === "aceptada"));
  const conversion = enviadas.length > 0 ? (aceptadas / enviadas.length) * 100 : 0;

  // Últimos 6 meses
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("es-CO", { month: "short" }),
    });
  }
  const monthly = months.map(({ key, label }) => {
    const [y, m] = key.split("-").map(Number);
    const inMonth = proposals.filter((p) => {
      const d = new Date(p.created_at);
      return d.getFullYear() === y && d.getMonth() === m;
    });
    return {
      month: label,
      total: inMonth.length,
      aceptadas: inMonth.filter((p) => p.estado === "aceptada").length,
    };
  });

  const clientMap = new Map<string, { proposals: RawProposal[]; count: number }>();
  for (const p of proposals) {
    const rel = Array.isArray(p.client) ? p.client[0] : p.client;
    const empresa = rel?.empresa ?? "Sin empresa";
    const cur = clientMap.get(empresa) ?? { proposals: [], count: 0 };
    cur.proposals.push(p);
    cur.count += 1;
    clientMap.set(empresa, cur);
  }
  const topClients = Array.from(clientMap.entries())
    .map(([empresa, v]) => ({ empresa, count: v.count, montos: sumByCurrency(v.proposals) }))
    .sort((a, b) => (b.montos[0]?.amount ?? 0) - (a.montos[0]?.amount ?? 0))
    .slice(0, 5);

  return { total, aceptadas, rechazadas, pendientes, borradores, montoCotizado, montoAceptado, conversion, monthly, topClients };
}
