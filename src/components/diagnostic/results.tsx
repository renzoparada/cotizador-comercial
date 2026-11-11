"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Download,
  FileJson,
  Lightbulb,
  Link2,
  Pencil,
  Printer,
  ShieldAlert,
  Target,
  Wrench,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyze, type Insight } from "@/lib/diagnostic/analysis";
import { LEVELS } from "@/lib/diagnostic/questions";
import { downloadJson, encodeResponse, slugify } from "@/lib/diagnostic/storage";
import type { DiagnosticResponse, SwotType } from "@/lib/diagnostic/types";
import { AiReport } from "./ai-report";
import { MaturityScale, Panel, RadarView, ReportSection, ScoreBar, ScoreGauge, scoreColor } from "./report-parts";

const NAV = [
  ["resumen", "Resumen"],
  ["dimensiones", "Dimensiones"],
  ["hallazgos", "Hallazgos"],
  ["dolores", "Dolores"],
  ["foda", "FODA"],
  ["estrategia", "Estrategia"],
  ["ruta", "Hoja de ruta"],
  ["herramientas", "Herramientas"],
  ["voz", "Voz del participante"],
] as const;

export function Results({ response, onEdit }: { response: DiagnosticResponse; onEdit?: () => void }) {
  const report = useMemo(() => analyze(response.answers), [response.answers]);
  const { info } = response;
  const levelLabel = LEVELS.find((l) => l.id === info.level)?.label;

  const share = async () => {
    const token = await encodeResponse(response);
    const url = `${window.location.origin}/diagnostico#r=${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado", { description: "Envíelo al consultor: al abrirlo, sus respuestas se importan automáticamente." });
    } catch {
      window.prompt("Copie este enlace:", url);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Diagnóstico empresarial 360° · Informe preliminar</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{info.company || "Empresa"}</h1>
          <p className="mt-1 text-sm text-muted">
            {[info.name, info.role, levelLabel, info.sector, info.size, info.date].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Editar respuestas
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={share}>
            <Link2 className="h-3.5 w-3.5" /> Compartir respuestas
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadJson(`diagnostico-${slugify(info.company)}-${slugify(info.name || info.role)}.json`, response)}>
            <FileJson className="h-3.5 w-3.5" /> JSON
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      {/* Navegación interna */}
      <nav className="no-print sticky top-0 z-20 -mx-4 mt-6 overflow-x-auto border-b border-border bg-background/85 px-4 backdrop-blur">
        <div className="flex gap-1 py-2">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-foreground">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-8 space-y-14">
        {/* RESUMEN */}
        <ReportSection id="resumen" eyebrow="Índice de salud empresarial" title="Resumen ejecutivo">
          <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
            <Panel className="flex flex-col items-center justify-center gap-3 lg:w-72">
              <ScoreGauge score={report.global} />
              <div className="text-center">
                <p className="text-lg font-semibold" style={{ color: report.maturity.color }}>
                  Nivel {report.maturity.id}: {report.maturity.name}
                </p>
                <p className="mt-1 text-xs text-muted">Completitud: {report.completion}%</p>
              </div>
            </Panel>
            <div className="grid gap-5">
              <Panel>
                <p className="leading-relaxed">{report.maturity.description}</p>
                <div className="mt-5">
                  <MaturityScale score={report.global} />
                </div>
              </Panel>
              <div className="grid gap-5 sm:grid-cols-3">
                <Kpi icon={ArrowUpRight} tone="success" title="Fortalezas" items={report.strengths.map((d) => `${d.short} (${d.score})`)} empty="Ninguna dimensión supera 65" />
                <Kpi icon={ArrowDownRight} tone="danger" title="Brechas prioritarias" items={report.weaknesses.map((d) => `${d.short} (${d.score})`)} empty="Ninguna dimensión bajo 50" />
                <Kpi icon={ShieldAlert} tone="warning" title="Alertas críticas" items={[`${report.alerts.length} detectada(s)`, `${report.pains.length} dolores identificados`]} />
              </div>
            </div>
          </div>

          {report.alerts.length > 0 && (
            <Panel className="mt-5 border-danger/40 bg-danger/[0.04]">
              <p className="flex items-center gap-2 font-semibold text-danger">
                <AlertTriangle className="h-4 w-4" /> Alertas críticas (atender primero)
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {report.alerts.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 rounded bg-danger/10 px-1.5 text-[11px] font-semibold text-danger">P{a.question}</span>
                    {a.text}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </ReportSection>

        {/* DIMENSIONES */}
        <ReportSection id="dimensiones" eyebrow="Radar 360°" title="Madurez por dimensión" description="Cada dimensión se puntúa de 0 a 100 según las respuestas. Las preguntas de perfil y abiertas no suman puntaje.">
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <RadarView
                data={report.dimensions.map((d) => ({ dim: d.short, Puntaje: d.score ?? 0 }))}
                series={[{ key: "Puntaje", name: "Puntaje", color: "var(--primary)", fillOpacity: 0.25 }]}
              />
            </Panel>
            <Panel className="space-y-4">
              {report.dimensions.map((d) => (
                <ScoreBar key={d.id} label={d.name} score={d.score} sub={`${d.answered}/${d.total} preguntas puntuadas`} />
              ))}
            </Panel>
          </div>
        </ReportSection>

        {/* HALLAZGOS */}
        <ReportSection
          id="hallazgos"
          eyebrow="Análisis cruzado"
          title="Hallazgos, contradicciones y causas raíz"
          description="Conclusiones que surgen de cruzar respuestas entre dimensiones: aquí suelen esconderse los verdaderos problemas."
        >
          {report.insights.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {report.insights.map((ins, i) => (
                <InsightCard key={i} insight={ins} />
              ))}
            </div>
          ) : (
            <Panel className="text-sm text-muted">No se detectaron contradicciones ni patrones cruzados relevantes.</Panel>
          )}
        </ReportSection>

        {/* DOLORES */}
        <ReportSection id="dolores" eyebrow="Mapa de dolores" title="Principales dolores y fallas internas" description="Ordenados por severidad, recurrencia en las respuestas y debilidad de la dimensión.">
          {report.pains.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {report.pains.slice(0, 10).map((p, i) => (
                <Panel key={p.id} className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold", i < 3 ? "bg-danger/10 text-danger" : "bg-surface-2 text-muted")}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{p.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{p.symptom}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <Severity level={p.severity} />
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-muted">Preguntas {p.sources.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <Panel className="text-sm text-muted">No se detectaron dolores relevantes en las respuestas.</Panel>
          )}
        </ReportSection>

        {/* FODA */}
        <ReportSection id="foda" eyebrow="Análisis FODA" title="Fortalezas, oportunidades, debilidades y amenazas" description="Generado automáticamente a partir de las respuestas. Úselo como base para un taller de FODA cruzado (TOWS).">
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["F", "Fortalezas", "success"],
                ["O", "Oportunidades", "accent"],
                ["D", "Debilidades", "warning"],
                ["A", "Amenazas", "danger"],
              ] as [SwotType, string, string][]
            ).map(([k, title, tone]) => (
              <Panel key={k} className="p-5">
                <p className="flex items-center gap-2 font-semibold" style={{ color: `var(--${tone})` }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: `color-mix(in srgb, var(--${tone}) 14%, transparent)` }}>
                    {k}
                  </span>
                  {title}
                </p>
                {report.swot[k].length ? (
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {report.swot[k].map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `var(--${tone})` }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">Sin elementos identificados.</p>
                )}
              </Panel>
            ))}
          </div>
        </ReportSection>

        {/* ESTRATEGIA */}
        <ReportSection id="estrategia" eyebrow="Perfil estratégico" title="Intención de crecimiento vs. capacidad de cambio" description="Basado en la Matriz Ansoff y en la capacidad de transformación (liderazgo, talento, innovación y ejecución).">
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Panel className="space-y-4">
              <div className="flex items-start gap-3">
                <Compass className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted">Intención declarada</p>
                  <p className="font-semibold">{report.profile.intent}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted">Vía de crecimiento sugerida</p>
                  <p className="font-semibold">{report.profile.ansoff}</p>
                  <p className="mt-1 text-sm text-muted">{report.profile.ansoffText}</p>
                </div>
              </div>
              <div className="rounded-xl bg-surface-2 p-4 text-sm">
                <p className="font-medium">Coherencia estratégica</p>
                <p className="mt-1 text-muted">{report.profile.coherence}</p>
              </div>
              <ScoreBar label="Capacidad de cambio" score={report.profile.readiness} />
            </Panel>
            <Panel>
              <AnsoffMatrix active={report.profile.ansoff} />
            </Panel>
          </div>
        </ReportSection>

        {/* HOJA DE RUTA */}
        <ReportSection id="ruta" eyebrow="Plan de acción" title="Hoja de ruta sugerida" description="Enfocada en las tres dimensiones con mayor brecha. Pocas prioridades, bien ejecutadas.">
          <div className="grid gap-4">
            {report.roadmap.map((r, i) => (
              <Panel key={r.dimension} className="p-0">
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                  <p className="font-semibold">
                    <span className="text-muted">Prioridad {i + 1} · </span>
                    {r.name}
                  </p>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ color: scoreColor(r.score), background: `color-mix(in srgb, ${scoreColor(r.score)} 12%, transparent)` }}>
                    {r.score}/100
                  </span>
                </div>
                <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                  {(
                    [
                      ["0–30 días", "Victoria rápida", r.quick],
                      ["1–3 meses", "Estructurar", r.build],
                      ["3–12 meses", "Transformar", r.transform],
                    ] as const
                  ).map(([when, tag, text]) => (
                    <div key={when} className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{when}</p>
                      <p className="text-xs text-muted">{tag}</p>
                      <p className="mt-2 text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </ReportSection>

        {/* HERRAMIENTAS */}
        <ReportSection id="herramientas" eyebrow="Caja de herramientas" title="Metodologías recomendadas" description="Seleccionadas según los dolores detectados, de mayor a menor pertinencia.">
          <div className="grid gap-4 md:grid-cols-2">
            {report.tools.map((t) => (
              <Panel key={t.id} className="p-5">
                <div className="flex items-start gap-3">
                  <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{t.name}</p>
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">{t.category}</span>
                    </div>
                    <p className="mt-1 text-sm">{t.what}</p>
                    <p className="mt-2 text-xs text-muted">Para: {[...new Set(t.reasons)].slice(0, 3).join(" · ")}</p>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </ReportSection>

        {/* VOZ */}
        <ReportSection id="voz" eyebrow="Respuestas abiertas" title="La voz del participante">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              {report.openAnswers.length ? (
                report.openAnswers.map((o) => (
                  <Panel key={o.number} className="p-5">
                    <p className="text-sm text-muted">
                      P{o.number}. {o.question}
                    </p>
                    <div className="mt-2 space-y-2">
                      {o.text.map((t, i) => (
                        <p key={i} className="flex gap-2">
                          <Quote className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{t}</span>
                        </p>
                      ))}
                    </div>
                  </Panel>
                ))
              ) : (
                <Panel className="text-sm text-muted">No hay respuestas abiertas.</Panel>
              )}
            </div>
            <Panel className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-gold" /> Temas mencionados
              </p>
              <p className="mt-1 text-xs text-muted">Detección por palabras clave en respuestas abiertas y comentarios.</p>
              {report.themes.length ? (
                <div className="mt-3 space-y-2">
                  {report.themes.map((t) => (
                    <div key={t.dimension} className="flex items-center justify-between text-sm">
                      <span>{t.name}</span>
                      <span className="rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">{t.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">Sin temas detectados.</p>
              )}
            </Panel>
          </div>
        </ReportSection>

        <AiReport report={report} info={info} />

        <p className="border-t border-border pt-6 text-xs text-muted">
          Este informe es un diagnóstico preliminar basado en percepciones, sin información financiera. No evalúa personas: busca comprender la
          organización. Para un diagnóstico robusto, consolide las respuestas de varios participantes (accionistas, dirección, mandos medios y equipo)
          y valide los hallazgos en entrevistas y talleres.
        </p>
        <div className="no-print flex justify-center">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4" /> Descargar informe en PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, tone, title, items, empty }: { icon: typeof ArrowUpRight; tone: string; title: string; items: string[]; empty?: string }) {
  return (
    <Panel className="p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-medium" style={{ color: `var(--${tone})` }}>
        <Icon className="h-4 w-4" /> {title}
      </p>
      {items.length ? (
        <ul className="mt-2 space-y-1 text-sm">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      )}
    </Panel>
  );
}

const INSIGHT_TONE: Record<Insight["kind"], string> = {
  Contradicción: "warning",
  "Causa raíz": "primary",
  Riesgo: "danger",
  Oportunidad: "success",
};

function InsightCard({ insight }: { insight: Insight }) {
  const tone = INSIGHT_TONE[insight.kind];
  return (
    <Panel className="border-l-4 p-5" style={{ borderLeftColor: `var(--${tone})` }}>
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: `var(--${tone})` }}>
        {insight.kind}
      </span>
      <p className="mt-1 font-semibold">{insight.title}</p>
      <p className="mt-1 text-sm text-muted">{insight.text}</p>
    </Panel>
  );
}

function Severity({ level }: { level: 1 | 2 | 3 }) {
  const map = { 1: ["Leve", "accent"], 2: ["Moderado", "warning"], 3: ["Alto", "danger"] } as const;
  const [label, tone] = map[level];
  return (
    <span className="rounded-full px-2 py-0.5 font-semibold" style={{ color: `var(--${tone})`, background: `color-mix(in srgb, var(--${tone}) 12%, transparent)` }}>
      Impacto {label.toLowerCase()}
    </span>
  );
}

function AnsoffMatrix({ active }: { active: string }) {
  const cells = [
    { key: "Penetración", title: "Penetración de mercado", sub: "Productos actuales · Mercados actuales" },
    { key: "Desarrollo de productos", title: "Desarrollo de productos", sub: "Productos nuevos · Mercados actuales" },
    { key: "Desarrollo de mercados", title: "Desarrollo de mercados", sub: "Productos actuales · Mercados nuevos" },
    { key: "Diversificación", title: "Diversificación", sub: "Productos nuevos · Mercados nuevos" },
  ];
  return (
    <div>
      <p className="text-sm font-semibold">Matriz Ansoff</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {cells.map((c) => {
          const on = active.startsWith(c.key);
          return (
            <div
              key={c.key}
              className={cn("rounded-xl border p-3 text-center transition-colors", on ? "border-primary bg-primary/10" : "border-border bg-surface-2")}
            >
              <p className={cn("text-xs font-semibold leading-tight", on ? "text-primary" : "")}>{c.title}</p>
              <p className="mt-1 text-[10px] leading-tight text-muted">{c.sub}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">El riesgo aumenta de arriba-izquierda hacia abajo-derecha.</p>
    </div>
  );
}
