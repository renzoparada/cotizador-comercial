import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRequestMeta } from "@/lib/request-meta";
import { notifyAdmin } from "@/lib/notify";

export async function POST(request: NextRequest) {
  const { slug, nombre, cargo } = await request.json();
  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  const { ip, userAgent } = getRequestMeta(request);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("accept_proposal", {
    p_slug: slug,
    p_ip: ip,
    p_user_agent: userAgent,
    p_nombre: nombre ?? null,
    p_cargo: cargo ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: proposal } = await supabase
    .from("proposals")
    .select("numero, titulo, client:clients(empresa, nombre_contacto)")
    .eq("slug", slug)
    .maybeSingle();

  await notifyAdmin("proposal_accepted", { slug, ip, proposal });

  return NextResponse.json({ ok: true, id: data });
}
