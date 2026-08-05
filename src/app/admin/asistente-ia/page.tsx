import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { searchClients } from "@/lib/queries/clients";
import { listProposals } from "@/lib/queries/proposals";
import { PageHeader } from "@/components/admin/page-header";
import { FullProposalTool } from "@/components/admin/ai/full-proposal-tool";
import { CoverLetterTool } from "@/components/admin/ai/cover-letter-tool";
import { ExecutiveSummaryTool } from "@/components/admin/ai/executive-summary-tool";
import { CrossSellTool } from "@/components/admin/ai/cross-sell-tool";

export default async function AsistenteIaPage() {
  const { userId } = await requireProfile();
  const supabase = await createClient();
  const [clients, proposals] = await Promise.all([searchClients(supabase, ""), listProposals(supabase)]);

  const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div>
      <PageHeader title="Asistente IA" description="Extras inteligentes para acelerar la creación y personalización de propuestas." />

      {!aiConfigured && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-4 text-sm text-warning">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Los extras de IA no están configurados</p>
            <p className="mt-0.5 text-warning/80">
              Agrega la variable de entorno <code>ANTHROPIC_API_KEY</code> para habilitar la generación automática de contenido.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <FullProposalTool clients={clients} currentUserId={userId} />
        <CoverLetterTool clients={clients} />
        <ExecutiveSummaryTool proposals={proposals} />
        <CrossSellTool />
      </div>
    </div>
  );
}
