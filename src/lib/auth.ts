import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { redirect } from "next/navigation";

/** Devuelve el usuario autenticado + su profile (rol incluido), o null. */
export async function getCurrentProfile(): Promise<{
  userId: string;
  email: string;
  profile: Profile;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { userId: user.id, email: user.email ?? "", profile: profile as Profile };
}

/** Igual que getCurrentProfile pero redirige a /login si no hay sesión. */
export async function requireProfile() {
  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  return session;
}
