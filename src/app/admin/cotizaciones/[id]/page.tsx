import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { getProposalById } from "@/lib/queries/proposals";
import { getProposalViews, getProposalEvents } from "@/lib/queries/tracking";
import { ProposalBuilder } from "@/components/admin/builder/proposal-builder";

export default async function CotizacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();
  const supabase = await createClient();

  const proposal = await getProposalById(supabase, id);
  if (!proposal) notFound();

  const [views, events] = await Promise.all([
    getProposalViews(supabase, id),
    getProposalEvents(supabase, id),
  ]);

  return <ProposalBuilder proposal={proposal} views={views} events={events} />;
}
