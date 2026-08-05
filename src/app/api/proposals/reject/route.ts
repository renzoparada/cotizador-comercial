import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRequestMeta } from "@/lib/request-meta";
import { notifyAdmin } from "@/lib/notify";

export async function POST(request: NextRequest) {
  const { slug, motivo } = await request.json();
  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  const { ip, userAgent } = getRequestMeta(request);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("reject_proposal", {
    p_slug: slug,
    p_ip: ip,
    p_user_agent: userAgent,
    p_motivo: motivo ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyAdmin("proposal_rejected", { slug, ip, motivo });

  return NextResponse.json({ ok: true, id: data });
}
