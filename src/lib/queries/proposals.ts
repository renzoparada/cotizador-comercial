import type { SupabaseClient } from "@supabase/supabase-js";
import type { Proposal, ProposalStatus, ProposalWithClient } from "@/lib/types";

export interface ProposalFilters {
  q?: string;
  estado?: ProposalStatus | "";
  clientId?: string;
  from?: string;
  to?: string;
}

export async function listProposals(
  supabase: SupabaseClient,
  filters: ProposalFilters = {},
): Promise<ProposalWithClient[]> {
  let req = supabase
    .from("proposals")
    .select("*, client:clients(*)")
    .order("created_at", { ascending: false });

  if (filters.estado) req = req.eq("estado", filters.estado);
  if (filters.clientId) req = req.eq("client_id", filters.clientId);
  if (filters.from) req = req.gte("fecha", filters.from);
  if (filters.to) req = req.lte("fecha", filters.to);

  const { data, error } = await req;
  if (error) throw error;

  let proposals = (data ?? []) as unknown as ProposalWithClient[];

  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    proposals = proposals.filter((p) => {
      const c = p.client;
      return (
        p.numero.toLowerCase().includes(q) ||
        p.titulo.toLowerCase().includes(q) ||
        c?.empresa?.toLowerCase().includes(q) ||
        c?.nombre_contacto?.toLowerCase().includes(q) ||
        c?.email?.toLowerCase().includes(q) ||
        c?.celular?.toLowerCase().includes(q) ||
        c?.ciudad?.toLowerCase().includes(q)
      );
    });
  }

  return proposals;
}

export async function listProposalsByClient(supabase: SupabaseClient, clientId: string): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Proposal[];
}

export async function getProposalById(supabase: SupabaseClient, id: string): Promise<ProposalWithClient | null> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*, client:clients(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProposalWithClient | null;
}

export async function getProposalBySlug(supabase: SupabaseClient, slug: string): Promise<ProposalWithClient | null> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*, client:clients(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProposalWithClient | null;
}
