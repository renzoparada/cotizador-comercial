import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { searchClients } from "@/lib/queries/clients";
import { PageHeader } from "@/components/admin/page-header";
import { NewProposalForm } from "./new-proposal-form";

export default async function NuevaCotizacionPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const { userId } = await requireProfile();
  const supabase = await createClient();
  const clients = await searchClients(supabase, "");

  return (
    <div>
      <PageHeader title="Nueva cotización" description="Elige el cliente para el que crearás la propuesta." />
      <NewProposalForm clients={clients} currentUserId={userId} defaultClientId={clientId} />
    </div>
  );
}
