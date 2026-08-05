import type { SupabaseClient } from "@supabase/supabase-js";
import type { Client } from "@/lib/types";

export async function searchClients(supabase: SupabaseClient, query: string): Promise<Client[]> {
  let req = supabase.from("clients").select("*").order("created_at", { ascending: false });

  if (query.trim()) {
    const q = query.trim();
    req = req.or(
      `empresa.ilike.%${q}%,nombre_contacto.ilike.%${q}%,email.ilike.%${q}%,celular.ilike.%${q}%,ciudad.ilike.%${q}%,whatsapp.ilike.%${q}%`,
    );
  }

  const { data, error } = await req;
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClientById(supabase: SupabaseClient, id: string): Promise<Client | null> {
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Client | null;
}
