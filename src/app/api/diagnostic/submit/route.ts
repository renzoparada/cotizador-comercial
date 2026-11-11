import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRequestMeta } from "@/lib/request-meta";
import { computeScores, isUuid, sanitizeAnswers, sanitizeInfo } from "@/lib/diagnostic/sanitize";

/** Recibe las respuestas de un participante de una campaña pública y las guarda en Supabase. */
export async function POST(request: NextRequest) {
  let body: { slug?: unknown; response?: { id?: unknown; info?: unknown; answers?: unknown; completed?: unknown } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.slice(0, 64) : "";
  const r = body.response;
  if (!slug || !r || !isUuid(r.id)) {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const info = sanitizeInfo(r.info);
  const answers = sanitizeAnswers(r.answers);
  const { global, dimensions } = computeScores(answers);
  const { ip, userAgent } = getRequestMeta(request);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_diagnostic_response", {
    p_slug: slug,
    p_response_id: r.id,
    p_info: info,
    p_answers: answers,
    p_global: global,
    p_dimensions: dimensions,
    p_completed: r.completed !== false,
    p_ip: ip,
    p_user_agent: userAgent.slice(0, 500),
  });

  if (error) {
    const closed = /cerrado/i.test(error.message);
    const missing = /no encontrado/i.test(error.message);
    return NextResponse.json(
      { error: closed ? "Este diagnóstico ya fue cerrado por el consultor." : missing ? "Diagnóstico no encontrado." : "No se pudieron guardar las respuestas." },
      { status: closed ? 409 : missing ? 404 : 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data });
}
