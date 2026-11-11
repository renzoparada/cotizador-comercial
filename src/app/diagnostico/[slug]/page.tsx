import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientLoader } from "../client-loader";

async function getCampaign(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_diagnostic_campaign", { p_slug: slug });
  const row = (Array.isArray(data) ? data[0] : data) as { titulo: string; empresa: string; abierta: boolean } | null;
  return row ? { slug, titulo: row.titulo, empresa: row.empresa, abierta: row.abierta } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  return {
    title: campaign ? `${campaign.titulo} · ${campaign.empresa}` : "Diagnóstico Empresarial 360°",
    robots: { index: false },
  };
}

export default async function CampaignDiagnosticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) notFound();
  return <ClientLoader campaign={campaign} />;
}
