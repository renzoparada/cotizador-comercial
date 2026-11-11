import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiagnosticCampaign, DiagnosticResponseRow } from "@/lib/diagnostic/types";

export interface CampaignListItem extends DiagnosticCampaign {
  client: { id: string; empresa: string; nombre_contacto: string } | null;
  responses: { id: string; global_score: number | null; completed_at: string | null }[];
}

export interface CampaignWithResponses extends DiagnosticCampaign {
  client: { id: string; empresa: string; nombre_contacto: string } | null;
  responses: DiagnosticResponseRow[];
}

const LIST_SELECT = "*, client:clients(id, empresa, nombre_contacto), responses:diagnostic_responses(id, global_score, completed_at)";

export async function listCampaigns(supabase: SupabaseClient, opts: { clientId?: string } = {}): Promise<CampaignListItem[]> {
  let req = supabase.from("diagnostic_campaigns").select(LIST_SELECT).order("created_at", { ascending: false });
  if (opts.clientId) req = req.eq("client_id", opts.clientId);
  const { data, error } = await req;
  if (error) throw error;
  return (data ?? []) as CampaignListItem[];
}

export async function getCampaign(supabase: SupabaseClient, id: string): Promise<CampaignWithResponses | null> {
  const { data, error } = await supabase
    .from("diagnostic_campaigns")
    .select("*, client:clients(id, empresa, nombre_contacto), responses:diagnostic_responses(*)")
    .eq("id", id)
    .order("created_at", { referencedTable: "diagnostic_responses", ascending: true })
    .maybeSingle();
  if (error) throw error;
  return data as CampaignWithResponses | null;
}

/** Promedio de los puntajes globales de las respuestas completadas. */
export function averageScore(responses: { global_score: number | null; completed_at: string | null }[]) {
  const vals = responses.filter((r) => r.completed_at && typeof r.global_score === "number").map((r) => r.global_score as number);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}
