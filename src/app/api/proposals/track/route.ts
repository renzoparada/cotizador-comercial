import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRequestMeta } from "@/lib/request-meta";

export async function POST(request: NextRequest) {
  const { slug } = await request.json();
  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  const { ip, userAgent, device, browser } = getRequestMeta(request);
  const supabase = await createClient();

  const { error } = await supabase.rpc("register_proposal_view", {
    p_slug: slug,
    p_ip: ip,
    p_user_agent: userAgent,
    p_device: device,
    p_browser: browser,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
