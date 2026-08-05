import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listProposals } from "@/lib/queries/proposals";
import { PageHeader } from "@/components/admin/page-header";
import { ProposalsFilterBar } from "@/components/admin/proposals/filter-bar";
import { ProposalsTable } from "@/components/admin/proposals/proposals-table";
import { ExportButtons } from "@/components/admin/proposals/export-buttons";
import { buttonVariants } from "@/components/ui/button";
import type { ProposalStatus } from "@/lib/types";

export default async function CotizacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const proposals = await listProposals(supabase, {
    q: params.q,
    estado: (params.estado as ProposalStatus) || "",
    from: params.from,
    to: params.to,
  });

  return (
    <div>
      <PageHeader
        title="Cotizaciones"
        description="Todas tus propuestas comerciales en un solo lugar."
        actions={
          <Link href="/admin/cotizaciones/nueva" className={buttonVariants()}>
            <Plus className="h-4 w-4" /> Nueva cotización
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ProposalsFilterBar />
        <ExportButtons proposals={proposals} />
      </div>

      <ProposalsTable proposals={proposals} />
    </div>
  );
}
