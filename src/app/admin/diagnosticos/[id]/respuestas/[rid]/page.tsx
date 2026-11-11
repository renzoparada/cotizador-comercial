import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { rowToResponse } from "@/lib/diagnostic/sanitize";
import type { DiagnosticResponseRow } from "@/lib/diagnostic/types";
import { ResponseReport } from "./response-report";

export default async function DiagnosticoRespuestaPage({ params }: { params: Promise<{ id: string; rid: string }> }) {
  const { id, rid } = await params;
  await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase.from("diagnostic_responses").select("*").eq("id", rid).eq("campaign_id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8">
      <div className="no-print px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <Link href={`/admin/diagnosticos/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al consolidado
        </Link>
      </div>
      <ResponseReport response={rowToResponse(data as DiagnosticResponseRow)} />
    </div>
  );
}
