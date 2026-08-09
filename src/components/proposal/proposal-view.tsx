import { ProposalHero } from "./hero";
import {
  VideoSection,
  DescriptionSection,
  ObjectivesSection,
  BenefitsSection,
  AgendaSection,
  MethodologyDurationSection,
  IncludesSection,
  BonusSection,
  FacilitatorSection,
  TestimonialsSection,
  ClientLogosSection,
  GallerySection,
} from "./sections";
import { PriceSection } from "./price-section";
import { AcceptFlow } from "./accept-flow";
import { ViewTracker } from "./view-tracker";
import { DownloadOfferButton } from "./download-offer-button";
import { normalizeProposalContent } from "@/lib/types";
import type { Proposal } from "@/lib/types";

export function ProposalView({ proposal, live = false }: { proposal: Proposal; live?: boolean }) {
  const content = normalizeProposalContent(proposal.content);

  return (
    <div className="min-h-screen bg-background">
      {live && <ViewTracker slug={proposal.slug} />}

      <ProposalHero header={content.header} />
      <VideoSection video={content.video} />
      <DescriptionSection description={content.description} />
      <ObjectivesSection objectives={content.objectives} />
      <BenefitsSection benefits={content.benefits} />
      <AgendaSection agenda={content.agenda} />
      <MethodologyDurationSection methodology={content.methodology} duration={content.duration} />
      <IncludesSection includes={content.includes} />
      <BonusSection bonus={content.bonus} />
      <FacilitatorSection facilitator={content.facilitator} trainerName={content.header.trainerName} />
      <TestimonialsSection testimonials={content.testimonials} />
      <ClientLogosSection clientLogos={content.clientLogos} />
      <GallerySection gallery={content.gallery} />
      <PriceSection
        mostrarPrecio={proposal.mostrar_precio}
        precioNormal={proposal.precio_normal}
        precioPromocional={proposal.precio_promocional}
        moneda={proposal.moneda}
        validez={proposal.validez_oferta}
        notas={proposal.notas_precio}
      />

      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {live ? (
          <AcceptFlow slug={proposal.slug} initialStatus={proposal.estado} />
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted">
            El botón “Aceptar Cotización” estará activo cuando el cliente vea el enlace público.
          </div>
        )}
        {content.descargaHabilitada && (
          <div className="mt-4 flex justify-center">
            <DownloadOfferButton proposal={proposal} />
          </div>
        )}
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        Propuesta {proposal.numero} · Generada con Propuestas
      </footer>
    </div>
  );
}
