"use client";

import {
  Target,
  Sparkles,
  BookOpen,
  Gauge,
  PackageCheck,
  Gift,
  UserRound,
  Quote,
  Images,
  PlayCircle,
  Building2,
} from "lucide-react";
import { ProposalSection } from "./section";
import { Reveal } from "./reveal";
import { getBenefitIcon } from "@/lib/benefit-icons";
import { getEmbedUrl } from "@/lib/video-embed";
import { cn } from "@/lib/utils";
import type {
  AgendaModule,
  BenefitItem,
  ClientLogo,
  DescriptionBlock,
  DurationBlock,
  FacilitatorBlock,
  GalleryItem,
  ListItem,
  MethodologyBlock,
  Testimonial,
  VideoBlock,
} from "@/lib/types";

export function VideoSection({ video }: { video: VideoBlock }) {
  const embed = video.enabled ? getEmbedUrl(video.url) : null;
  if (!embed) return null;
  return (
    <ProposalSection title="Conoce la propuesta" icon={PlayCircle} eyebrow="Video">
      <Reveal delay={0.1}>
        <div className="mx-auto aspect-video max-w-3xl overflow-hidden rounded-2xl border border-border card-shadow">
          <iframe
            src={embed}
            title="Video de la propuesta"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </Reveal>
    </ProposalSection>
  );
}

export function DescriptionSection({ description }: { description: DescriptionBlock }) {
  if (!description.html || description.html === "<p></p>") return null;
  return (
    <ProposalSection title="Sobre esta capacitación" icon={Sparkles} eyebrow="Descripción">
      <Reveal delay={0.1}>
        <div
          className="prose-content mx-auto max-w-2xl text-center text-[15px] text-muted [&_*]:text-left"
          dangerouslySetInnerHTML={{ __html: description.html }}
        />
      </Reveal>
    </ProposalSection>
  );
}

export function ObjectivesSection({ objectives }: { objectives: ListItem[] }) {
  if (objectives.length === 0) return null;
  return (
    <ProposalSection title="Objetivos" icon={Target} eyebrow="Lo que lograrás">
      <div className="mx-auto grid max-w-2xl gap-3">
        {objectives.map((o, i) => (
          <Reveal key={o.id} delay={i * 0.05}>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/90">{o.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </ProposalSection>
  );
}

export function BenefitsSection({ benefits }: { benefits: BenefitItem[] }) {
  if (benefits.length === 0) return null;
  return (
    <ProposalSection title="Beneficios" icon={Gauge} eyebrow="Por qué elegirnos" className="bg-surface-2/50">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b, i) => {
          const Icon = getBenefitIcon(b.icon);
          return (
            <Reveal key={b.id} delay={i * 0.05}>
              <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center card-shadow">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-foreground/90">{b.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </ProposalSection>
  );
}

export function AgendaSection({ agenda }: { agenda: AgendaModule[] }) {
  if (agenda.length === 0) return null;
  return (
    <ProposalSection title="Temario" icon={BookOpen} eyebrow="Contenido del programa">
      <div className="mx-auto max-w-2xl space-y-4">
        {agenda.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.06}>
            <div className="rounded-2xl border border-border bg-surface p-5 card-shadow">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{m.titulo}</h3>
                  {m.descripcion && <p className="mt-1 text-sm text-muted">{m.descripcion}</p>}
                  {m.temas.length > 0 && (
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {m.temas.map((t, ti) => (
                        <li key={ti} className="flex items-center gap-2 text-sm text-foreground/80">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </ProposalSection>
  );
}

export function MethodologyDurationSection({
  methodology,
  duration,
}: {
  methodology: MethodologyBlock;
  duration: DurationBlock;
}) {
  if (methodology.items.length === 0 && !duration.horas) return null;
  return (
    <ProposalSection title="Metodología y duración" icon={Gauge} eyebrow="Cómo trabajamos" className="bg-surface-2/50">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6">
        {duration.horas && (
          <Reveal>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-6 py-4 text-center">
              <span className="text-2xl font-semibold text-primary">{duration.horas}</span>
              <span className="text-xs text-muted">{duration.modalidad}</span>
            </div>
          </Reveal>
        )}
        {methodology.items.length > 0 && (
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {methodology.items.map((m, i) => (
                <span key={i} className="rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
                  {m}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </ProposalSection>
  );
}

function SimpleListSection({
  title,
  icon,
  eyebrow,
  items,
  tone,
}: {
  title: string;
  icon: typeof PackageCheck;
  eyebrow: string;
  items: ListItem[];
  tone: "primary" | "gold";
}) {
  if (items.length === 0) return null;
  return (
    <ProposalSection title={title} icon={icon} eyebrow={eyebrow}>
      <div className="mx-auto grid max-w-2xl gap-2.5 sm:grid-cols-2">
        {items.map((it, i) => (
          <Reveal key={it.id} delay={i * 0.04}>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-3.5 text-sm",
                tone === "primary" ? "border-primary/15 bg-primary/5" : "border-gold/20 bg-gold/5",
              )}
            >
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone === "primary" ? "bg-primary" : "bg-gold")} />
              {it.text}
            </div>
          </Reveal>
        ))}
      </div>
    </ProposalSection>
  );
}

export function IncludesSection({ includes }: { includes: ListItem[] }) {
  return <SimpleListSection title="Qué incluye" icon={PackageCheck} eyebrow="Todo listo para ti" items={includes} tone="primary" />;
}

export function BonusSection({ bonus }: { bonus: ListItem[] }) {
  return <SimpleListSection title="Bonus" icon={Gift} eyebrow="Un plus para ti" items={bonus} tone="gold" />;
}

export function FacilitatorSection({ facilitator, trainerName }: { facilitator: FacilitatorBlock; trainerName: string }) {
  if (!facilitator.bio && !facilitator.experiencia && facilitator.certificaciones.length === 0 && !facilitator.photoUrl) return null;
  return (
    <ProposalSection title="Perfil del facilitador" icon={UserRound} eyebrow="Quién te acompaña" className="bg-surface-2/50">
      <Reveal>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-border bg-surface p-8 text-center card-shadow sm:flex-row sm:text-left">
          {facilitator.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={facilitator.photoUrl} alt={trainerName} className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
          ) : (
            <div className="h-28 w-28 shrink-0 rounded-2xl bg-primary/10" />
          )}
          <div>
            {trainerName && <h3 className="text-lg font-semibold">{trainerName}</h3>}
            {facilitator.bio && <p className="mt-2 text-sm text-muted">{facilitator.bio}</p>}
            {facilitator.experiencia && <p className="mt-2 text-sm text-foreground/80">{facilitator.experiencia}</p>}
            {facilitator.certificaciones.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {facilitator.certificaciones.map((c, i) => (
                  <span key={i} className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </ProposalSection>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <ProposalSection title="Testimonios" icon={Quote} eyebrow="Lo que dicen de nosotros">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.06}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 card-shadow">
              <Quote className="h-5 w-5 text-primary/40" />
              <p className="flex-1 text-sm text-foreground/85">&ldquo;{t.comentario}&rdquo;</p>
              <div className="flex items-center gap-2.5 pt-1">
                {t.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photoUrl} alt={t.nombre} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10" />
                )}
                <div>
                  <p className="text-sm font-medium">{t.nombre}</p>
                  <p className="text-xs text-muted">{t.empresa}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </ProposalSection>
  );
}

export function ClientLogosSection({ clientLogos }: { clientLogos: ClientLogo[] }) {
  if (clientLogos.length === 0) return null;
  return (
    <ProposalSection title="Empresas que confían en nosotros" icon={Building2} eyebrow="Clientes" className="bg-surface-2/50">
      <Reveal>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {clientLogos.map((logo) => (
            <div key={logo.id} className="flex h-12 items-center justify-center opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.url} alt={logo.nombre || "Cliente"} className="max-h-12 max-w-[140px] object-contain" />
            </div>
          ))}
        </div>
      </Reveal>
    </ProposalSection>
  );
}

export function GallerySection({ gallery }: { gallery: GalleryItem[] }) {
  if (gallery.length === 0) return null;
  return (
    <ProposalSection title="Galería" icon={Images} eyebrow="Momentos y experiencias" className="bg-surface-2/50">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
        {gallery.map((g, i) => (
          <Reveal key={g.id} delay={i * 0.04}>
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
              {g.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.url} alt={g.caption ?? ""} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              ) : (
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted hover:text-primary transition-colors"
                >
                  <PlayCircle className="h-8 w-8" />
                  <span className="text-xs">Ver video</span>
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </ProposalSection>
  );
}
