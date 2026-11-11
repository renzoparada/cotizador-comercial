import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { getClientById } from "@/lib/queries/clients";
import { listProposalsByClient } from "@/lib/queries/proposals";
import { listCampaigns } from "@/lib/queries/diagnostics";
import { PageHeader } from "@/components/admin/page-header";
import { ClientDetail } from "@/components/admin/clients/client-detail";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await requireProfile();
  const supabase = await createClient();

  const client = await getClientById(supabase, id);
  if (!client) notFound();

  const [proposals, campaigns, notesRes] = await Promise.all([
    listProposalsByClient(supabase, id),
    listCampaigns(supabase, { clientId: id }),
    supabase.from("client_notes").select("*").eq("client_id", id).order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <Link href="/admin/clientes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>
      <PageHeader
        title={client.empresa}
        description="Historial completo, notas y seguimiento comercial."
        actions={
          <Link href={`/admin/cotizaciones/nueva?clientId=${client.id}`} className={buttonVariants()}>
            <Plus className="h-4 w-4" /> Nueva cotización
          </Link>
        }
      />
      <ClientDetail
        client={client}
        proposals={proposals}
        campaigns={campaigns}
        notes={notesRes.data ?? []}
        currentUserId={userId}
      />
    </div>
  );
}
