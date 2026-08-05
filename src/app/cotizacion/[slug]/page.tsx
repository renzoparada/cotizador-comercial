import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProposalBySlug } from "@/lib/queries/proposals";
import { ProposalView } from "@/components/proposal/proposal-view";
import type { Proposal } from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadProposal(slug: string) {
  const supabase = await createClient();
  const proposal = await getProposalBySlug(supabase, slug);
  return proposal;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const proposal = await loadProposal(slug);
  if (!proposal) return { title: "Propuesta no encontrada" };

  return {
    title: `${proposal.content.header.title || proposal.titulo} | Propuesta comercial`,
    description: proposal.content.header.subtitle || "Propuesta comercial de capacitación.",
    openGraph: {
      title: proposal.content.header.title || proposal.titulo,
      description: proposal.content.header.subtitle || "",
      images: proposal.content.header.logoUrl ? [proposal.content.header.logoUrl] : undefined,
    },
  };
}

export default async function PublicProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = await loadProposal(slug);
  if (!proposal) notFound();

  const isExpired =
    proposal.vencimiento &&
    new Date(proposal.vencimiento) < new Date() &&
    (proposal.estado === "enviada" || proposal.estado === "vista");

  const displayProposal: Proposal = isExpired ? { ...proposal, estado: "vencida" } : proposal;

  return <ProposalView proposal={displayProposal} live />;
}
