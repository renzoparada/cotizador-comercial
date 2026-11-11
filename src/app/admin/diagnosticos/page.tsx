import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { listCampaigns } from "@/lib/queries/diagnostics";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { CampaignsList } from "@/components/admin/diagnostics/campaigns-list";
import { NewCampaignButton } from "@/components/admin/diagnostics/new-campaign-modal";

export default async function DiagnosticosPage() {
  const { userId } = await requireProfile();
  const supabase = await createClient();
  const [campaigns, clientsRes] = await Promise.all([
    listCampaigns(supabase),
    supabase.from("clients").select("id, empresa").order("empresa"),
  ]);
  const clients = clientsRes.data ?? [];

  return (
    <div>
      <PageHeader
        title="Diagnósticos 360°"
        description="Evaluaciones estratégicas y organizacionales de tus clientes, con consolidado por equipo."
        actions={<NewCampaignButton clients={clients} currentUserId={userId} />}
      />
      <Card className="overflow-hidden p-0">
        <CampaignsList campaigns={campaigns} />
      </Card>
    </div>
  );
}
