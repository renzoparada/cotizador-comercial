"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LayoutTemplate,
  PlayCircle,
  AlignLeft,
  Target,
  Gauge,
  BookOpen,
  Tags,
  Clock,
  PackageCheck,
  Gift,
  UserRound,
  Quote,
  Images,
  Tag,
  Building2,
  CalendarClock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ProposalToolbar } from "./proposal-toolbar";
import { TrackingPanel } from "./tracking-panel";
import { BuilderSection } from "./builder-section";
import { EditableList } from "./editable-list";
import { HeaderBlockEditor } from "./blocks/header-block";
import { VideoBlockEditor } from "./blocks/video-block";
import { RichTextEditor } from "./rich-text-editor";
import { BenefitsBlockEditor } from "./blocks/benefits-block";
import { AgendaBlockEditor } from "./blocks/agenda-block";
import { DurationBlockEditor } from "./blocks/duration-block";
import { FacilitatorBlockEditor } from "./blocks/facilitator-block";
import { TestimonialsBlockEditor } from "./blocks/testimonials-block";
import { ClientLogosBlockEditor } from "./blocks/client-logos-block";
import { GalleryBlockEditor } from "./blocks/gallery-block";
import { PriceBlockEditor } from "./blocks/price-block";
import { AvailabilityBlockEditor } from "./blocks/availability-block";
import { ProposalView } from "@/components/proposal/proposal-view";
import { ExpiredScreen } from "@/components/proposal/expired-screen";
import { AiAssistButton } from "@/components/admin/ai/ai-assist-button";
import { RewriteToneButtons } from "@/components/admin/ai/rewrite-tone-buttons";
import { createClient } from "@/lib/supabase/client";
import { isProposalExpired } from "@/lib/proposal-status";
import type { ProposalContent, ProposalEvent, ProposalStatus, ProposalView as ProposalViewType, ProposalWithClient } from "@/lib/types";

export function ProposalBuilder({
  proposal,
  views,
  events,
}: {
  proposal: ProposalWithClient;
  views: ProposalViewType[];
  events: ProposalEvent[];
}) {
  const [content, setContent] = useState<ProposalContent>(proposal.content);
  const [pricing, setPricing] = useState({
    mostrar_precio: proposal.mostrar_precio,
    precio_normal: proposal.precio_normal,
    precio_promocional: proposal.precio_promocional,
    moneda: proposal.moneda,
    validez_oferta: proposal.validez_oferta,
    notas_precio: proposal.notas_precio,
  });
  const [availability, setAvailability] = useState({
    habilitada: proposal.habilitada,
    vencimiento: proposal.vencimiento ? proposal.vencimiento.slice(0, 10) : null,
  });
  const [estado, setEstado] = useState<ProposalStatus>(proposal.estado);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "idle">("idle");

  const isFirstRun = useRef(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setSaveState("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("proposals")
        .update({
          content,
          titulo: content.header.title || "Propuesta comercial",
          ...pricing,
          ...availability,
        })
        .eq("id", proposal.id);
      setSaveState(error ? "idle" : "saved");
      if (error) toast.error("No se pudo guardar: " + error.message);
    }, 900);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, pricing, availability]);

  const previewProposal = { ...proposal, content, ...pricing, ...availability, estado };
  const previewExpired = isProposalExpired({ habilitada: availability.habilitada, vencimiento: availability.vencimiento, estado });

  return (
    <div>
      <ProposalToolbar
        proposalId={proposal.id}
        slug={proposal.slug}
        estado={estado}
        saveState={saveState}
        onStatusChange={setEstado}
      />

      {proposal.client && (
        <Card className="mb-6 p-4">
          <Link href={`/admin/clientes/${proposal.client.id}`} className="flex items-center gap-3">
            <Avatar name={proposal.client.empresa} size={40} />
            <div className="min-w-0">
              <p className="truncate font-medium">{proposal.client.empresa}</p>
              <p className="truncate text-xs text-muted">
                {proposal.client.nombre_contacto} · {proposal.numero}
              </p>
            </div>
            <Building2 className="ml-auto h-4 w-4 text-muted" />
          </Link>
        </Card>
      )}

      <Tabs defaultValue="constructor">
        <TabsList>
          <TabsTrigger value="constructor">Constructor</TabsTrigger>
          <TabsTrigger value="preview">Vista previa</TabsTrigger>
          <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="constructor" className="mt-5 space-y-4">
          <BuilderSection title="Encabezado" icon={LayoutTemplate} defaultOpen>
            <HeaderBlockEditor value={content.header} onChange={(header) => setContent((c) => ({ ...c, header }))} />
          </BuilderSection>

          <BuilderSection title="Video" icon={PlayCircle}>
            <VideoBlockEditor value={content.video} onChange={(video) => setContent((c) => ({ ...c, video }))} />
          </BuilderSection>

          <BuilderSection title="Descripción" icon={AlignLeft}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <RewriteToneButtons
                text={content.description.html}
                onResult={(html) => setContent((c) => ({ ...c, description: { html } }))}
              />
              <AiAssistButton
                action="description"
                context={{ title: content.header.title, subtitle: content.header.subtitle }}
                onResult={(html: string) => setContent((c) => ({ ...c, description: { html } }))}
              />
            </div>
            <RichTextEditor value={content.description.html} onChange={(html) => setContent((c) => ({ ...c, description: { html } }))} />
          </BuilderSection>

          <BuilderSection title="Objetivos" icon={Target}>
            <div className="mb-3 flex justify-end">
              <AiAssistButton
                action="objectives"
                context={{ title: content.header.title }}
                onResult={(items: string[]) =>
                  setContent((c) => ({ ...c, objectives: items.map((text) => ({ id: crypto.randomUUID(), text })) }))
                }
              />
            </div>
            <EditableList
              items={content.objectives.map((o) => o.text)}
              onChange={(items) => setContent((c) => ({ ...c, objectives: items.map((text, i) => ({ id: c.objectives[i]?.id ?? crypto.randomUUID(), text })) }))}
              placeholder="Agregar objetivo…"
            />
          </BuilderSection>

          <BuilderSection title="Beneficios" icon={Gauge}>
            <BenefitsBlockEditor value={content.benefits} onChange={(benefits) => setContent((c) => ({ ...c, benefits }))} />
          </BuilderSection>

          <BuilderSection title="Temario" icon={BookOpen}>
            <div className="mb-3 flex justify-end">
              <AiAssistButton
                action="agenda"
                context={{ title: content.header.title, duration: content.duration.horas }}
                onResult={(modules: { titulo: string; descripcion: string; temas: string[] }[]) =>
                  setContent((c) => ({
                    ...c,
                    agenda: modules.map((m) => ({ id: crypto.randomUUID(), ...m })),
                  }))
                }
              />
            </div>
            <AgendaBlockEditor value={content.agenda} onChange={(agenda) => setContent((c) => ({ ...c, agenda }))} />
          </BuilderSection>

          <BuilderSection title="Metodología" icon={Tags}>
            <EditableList
              items={content.methodology.items}
              onChange={(items) => setContent((c) => ({ ...c, methodology: { items } }))}
              placeholder="Ej. Taller, Coaching, Gamificación…"
            />
          </BuilderSection>

          <BuilderSection title="Duración" icon={Clock}>
            <DurationBlockEditor value={content.duration} onChange={(duration) => setContent((c) => ({ ...c, duration }))} />
          </BuilderSection>

          <BuilderSection title="Incluye" icon={PackageCheck}>
            <EditableList
              items={content.includes.map((o) => o.text)}
              onChange={(items) => setContent((c) => ({ ...c, includes: items.map((text, i) => ({ id: c.includes[i]?.id ?? crypto.randomUUID(), text })) }))}
              placeholder="Ej. Material digital, certificado…"
            />
          </BuilderSection>

          <BuilderSection title="Bonus" icon={Gift}>
            <EditableList
              items={content.bonus.map((o) => o.text)}
              onChange={(items) => setContent((c) => ({ ...c, bonus: items.map((text, i) => ({ id: c.bonus[i]?.id ?? crypto.randomUUID(), text })) }))}
              placeholder="Ej. Sesión de seguimiento gratuita…"
            />
          </BuilderSection>

          <BuilderSection title="Perfil del facilitador" icon={UserRound}>
            <FacilitatorBlockEditor value={content.facilitator} onChange={(facilitator) => setContent((c) => ({ ...c, facilitator }))} />
          </BuilderSection>

          <BuilderSection title="Testimonios" icon={Quote}>
            <TestimonialsBlockEditor value={content.testimonials} onChange={(testimonials) => setContent((c) => ({ ...c, testimonials }))} />
          </BuilderSection>

          <BuilderSection title="Empresas que confían en nosotros" icon={Building2}>
            <ClientLogosBlockEditor value={content.clientLogos} onChange={(clientLogos) => setContent((c) => ({ ...c, clientLogos }))} />
          </BuilderSection>

          <BuilderSection title="Galería" icon={Images}>
            <GalleryBlockEditor value={content.gallery} onChange={(gallery) => setContent((c) => ({ ...c, gallery }))} />
          </BuilderSection>

          <BuilderSection title="Precio" icon={Tag} defaultOpen>
            <div className="mb-3 flex justify-end">
              <AiAssistButton
                action="price"
                context={{ duration: content.duration.horas, modality: content.duration.modalidad }}
                onResult={(v: { precio_normal: number; precio_promocional: number; justificacion: string }) => {
                  setPricing((p) => ({ ...p, precio_normal: v.precio_normal, precio_promocional: v.precio_promocional }));
                  toast.info(v.justificacion);
                }}
              />
            </div>
            <PriceBlockEditor value={pricing} onChange={setPricing} />
          </BuilderSection>

          <BuilderSection
            title="Disponibilidad"
            icon={CalendarClock}
            badge={!availability.habilitada ? <span className="text-xs font-medium text-warning">Deshabilitada</span> : undefined}
          >
            <AvailabilityBlockEditor value={availability} onChange={setAvailability} />
          </BuilderSection>
        </TabsContent>

        <TabsContent value="preview" className="mt-5">
          <div className="overflow-hidden rounded-2xl border border-border">
            {previewExpired ? (
              <ExpiredScreen header={content.header} />
            ) : (
              <ProposalView proposal={previewProposal} live={false} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="mt-5">
          <TrackingPanel
            views={views}
            events={events}
            viewCount={proposal.view_count}
            firstViewedAt={proposal.first_viewed_at}
            lastViewedAt={proposal.last_viewed_at}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
