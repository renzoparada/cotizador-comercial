import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { getCampaign } from "@/lib/queries/diagnostics";
import { PageHeader } from "@/components/admin/page-header";
import { CampaignDetail } from "@/components/admin/diagnostics/campaign-detail";
import { formatDate } from "@/lib/utils";

export default async function DiagnosticoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();
  const supabase = await createClient();
  const campaign = await getCampaign(supabase, id);
  if (!campaign) notFound();

  const h = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;

  return (
    <div>
      <Link
        href={campaign.client ? `/admin/clientes/${campaign.client.id}` : "/admin/diagnosticos"}
        className="no-print mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {campaign.client?.empresa ?? "Diagnósticos"}
      </Link>
      <PageHeader
        title={`${campaign.titulo} · ${campaign.client?.empresa ?? "Cliente"}`}
        description={`Creado el ${formatDate(campaign.created_at)}${campaign.client ? ` · Contacto: ${campaign.client.nombre_contacto}` : ""}`}
      />
      <CampaignDetail campaign={campaign} publicUrl={`${origin}/diagnostico/${campaign.slug}`} />
    </div>
  );
}
