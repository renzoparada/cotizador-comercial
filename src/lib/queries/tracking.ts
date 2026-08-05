import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProposalEvent, ProposalView } from "@/lib/types";

export async function getProposalViews(supabase: SupabaseClient, proposalId: string): Promise<ProposalView[]> {
  const { data, error } = await supabase
    .from("proposal_views")
    .select("*")
    .eq("proposal_id", proposalId)
    .order("viewed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProposalView[];
}

export async function getProposalEvents(supabase: SupabaseClient, proposalId: string): Promise<ProposalEvent[]> {
  const { data, error } = await supabase
    .from("proposal_events")
    .select("*")
    .eq("proposal_id", proposalId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProposalEvent[];
}
