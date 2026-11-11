"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, Printer, Quote, Scale, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeTeam } from "@/lib/diagnostic/analysis";
import { LEVELS } from "@/lib/diagnostic/questions";
import { isResponse, saveMany, useSavedResponses } from "@/lib/diagnostic/storage";
import type { DiagnosticResponse } from "@/lib/diagnostic/types";
import { MaturityScale, Panel, RadarView, ReportSection, ScoreBar, ScoreGauge, scoreColor } from "./report-parts";

export function TeamView({ onBack, onOpen }: { onBack: () => void; onOpen: (r: DiagnosticResponse) => void }) {
  const saved = useSavedResponses();
  const companies = useMemo(() => [...new Set(saved.map((r) => r.info.company.trim() || "Sin nombre"))], [saved]);
  const [company, setCompany] = useState<string>("");
  const activeCompany = company || companies[0] || "";
  const pool = saved.filter((r) => (r.info.company.trim() || "Sin nombre") === activeCompany && r.completedAt);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const selected = pool.filter((r) => !excluded.has(r.id));
  const fileRef = useRef<HTMLInputElement>(null);

  const importFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const found: DiagnosticResponse[] = [];
    for (const f of Array.from(files)) {
      try {
        const data = JSON.parse(await f.text());
        const arr = Array.isArray(data) ? data : [data];
        for (const x of arr) if (isResponse(x)) found.push({ ...x, completedAt: x.completedAt ?? new Date().toISOString() });
      } catch {
        toast.error(`No se pudo leer ${f.name}`);
      }
    }
    if (found.length) {
      saveMany(found);
      setCompany(found[0].info.company.trim() || "Sin nombre");
      toast.success(`${found.length} respuesta(s) importadas`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Inicio
        </Button>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept="application/json,.json" multiple hidden onChange={(e) => importFiles(e.target.files)} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" /> Importar JSON
          </Button>
          {selected.length > 0 && (
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Diagnóstico 360° · Consolidado de equipo</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{activeCompany || "Consolidar respuestas"}</h1>
        <p className="mt-2 max-w-3xl text-muted">
          Un diagnóstico 360° de verdad combina miradas: accionistas, dirección, mandos medios y equipo. Las diferencias de percepción entre ellos son,
          muchas veces, el hallazgo más valioso.
        </p>
      </div>

      {saved.length === 0 ? (
        <Panel className="mt-8 text-center">
          <Users className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 font-medium">Aún no hay respuestas guardadas</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Pida a cada participante que complete el cuestionario y le envíe su enlace «Compartir respuestas» o su archivo JSON. Al abrir el enlace, las
            respuestas se guardan aquí.
          </p>
        </Panel>
      ) : (
        <>
          <Panel className="no-print mt-6 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium">Empresa</label>
              <select
                value={activeCompany}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setExcluded(new Set());
                }}
                className="h-9 rounded-lg border border-border bg-surface-2 px-3 text-sm"
              >
                {companies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <span className="text-sm text-muted">{selected.length} de {pool.length} participantes incluidos</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pool.map((r) => {
                const on = !excluded.has(r.id);
                return (
                  <div key={r.id} className="flex items-center overflow-hidden rounded-full border border-border text-xs">
                    <button
                      onClick={() => {
                        const n = new Set(excluded);
                        if (on) n.add(r.id);
                        else n.delete(r.id);
                        setExcluded(n);
                      }}
                      className={cn("px-3 py-1.5", on ? "bg-primary/10 text-primary" : "text-muted line-through")}
                    >
                      {r.info.name || "Anónimo"} · {r.info.role || LEVELS.find((l) => l.id === r.info.level)?.label || "—"}
                    </button>
                    <button onClick={() => onOpen(r)} className="border-l border-border px-2 py-1.5 text-muted hover:text-foreground">
                      Ver
                    </button>
                  </div>
                );
              })}
            </div>
          </Panel>
          {selected.length > 0 && <TeamReportView responses={selected} />}
        </>
      )}
    </div>
  );
}

function TeamReportView({ responses }: { responses: DiagnosticResponse[] }) {
  const t = useMemo(() => analyzeTeam(responses), [responses]);
  const hasLevels = t.dimensions.some((d) => d.leadership !== null) && t.dimensions.some((d) => d.team !== null);

  const radarData = t.dimensions.map((d) => ({
    dim: d.short,
    Promedio: d.mean ?? 0,
    ...(hasLevels ? { Dirección: d.leadership ?? 0, Equipo: d.team ?? 0 } : {}),
  }));
  const series = hasLevels
    ? [
        { key: "Dirección", name: "Accionistas / Dirección", color: "var(--gold)", fillOpacity: 0.08 },
        { key: "Equipo", name: "Mandos medios / Equipo", color: "var(--accent)", fillOpacity: 0.08 },
        { key: "Promedio", name: "Promedio", color: "var(--primary)", fillOpacity: 0.2 },
      ]
    : [{ key: "Promedio", name: "Promedio", color: "var(--primary)", fillOpacity: 0.25 }];

  return (
    <div className="mt-10 space-y-14">
      <ReportSection id="t-resumen" eyebrow={`${t.count} participante(s)`} title="Resumen consolidado">
        <div className="grid gap-5 md:grid-cols-[auto_auto_1fr]">
          <Panel className="flex flex-col items-center gap-2">
            <ScoreGauge score={t.global} size={160} />
            <p className="font-semibold" style={{ color: t.maturity.color }}>
              {t.maturity.name}
            </p>
            <p className="text-xs text-muted">Índice de salud</p>
          </Panel>
          <Panel className="flex flex-col items-center gap-2">
            <ScoreGauge score={t.alignment} size={160} label="alineación" />
            <p className="flex items-center gap-1.5 font-semibold">
              <Scale className="h-4 w-4" /> Índice de alineación
            </p>
            <p className="max-w-[12rem] text-center text-xs text-muted">Qué tan parecidas son las percepciones entre participantes.</p>
          </Panel>
          <Panel>
            <p className="leading-relaxed">{t.maturity.description}</p>
            <div className="mt-5">
              <MaturityScale score={t.global} />
            </div>
            {t.alignment < 60 && t.count > 1 && (
              <p className="mt-4 rounded-xl bg-warning/10 p-3 text-sm">
                <strong>Baja alineación:</strong> los participantes ven a la empresa de forma muy distinta. Antes de definir un plan, conviene un taller para
                construir una lectura común.
              </p>
            )}
          </Panel>
        </div>
        {t.alerts.length > 0 && (
          <Panel className="mt-5 border-danger/40 bg-danger/[0.04]">
            <p className="flex items-center gap-2 font-semibold text-danger">
              <AlertTriangle className="h-4 w-4" /> Alertas críticas
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {t.alerts.map((a) => (
                <li key={a.text} className="flex gap-2">
                  <span className="shrink-0 rounded bg-danger/10 px-1.5 text-[11px] font-semibold text-danger">
                    {a.respondents}/{t.count}
                  </span>
                  {a.text}
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </ReportSection>

      <ReportSection id="t-dim" eyebrow="Radar 360°" title="Madurez por dimensión" description="Promedio del grupo, rango (mínimo–máximo) y dispersión de opiniones.">
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel>
            <RadarView data={radarData} series={series} height={360} />
          </Panel>
          <Panel className="space-y-4">
            {t.dimensions.map((d) => (
              <ScoreBar key={d.id} label={d.name} score={d.mean} sub={d.mean === null ? undefined : `Rango ${d.min}–${d.max} · dispersión ±${d.std}${d.std >= 20 ? " · ⚠ percepciones divididas" : ""}`} />
            ))}
          </Panel>
        </div>
      </ReportSection>

      {t.gaps.length > 0 && (
        <ReportSection
          id="t-gap"
          eyebrow="Brecha de percepción"
          title="Dirección vs. equipo"
          description="Diferencia entre cómo ven la empresa accionistas/dirección y mandos medios/equipo. Brechas mayores a 15 puntos suelen indicar puntos ciegos de la dirección."
        >
          <Panel className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted">
                <tr>
                  <th className="p-3">Dimensión</th>
                  <th className="p-3 text-right">Dirección</th>
                  <th className="p-3 text-right">Equipo</th>
                  <th className="p-3 text-right">Brecha</th>
                  <th className="p-3">Lectura</th>
                </tr>
              </thead>
              <tbody>
                {t.gaps.map((g) => (
                  <tr key={g.short} className="border-t border-border">
                    <td className="p-3 font-medium">{g.short}</td>
                    <td className="p-3 text-right tabular-nums">{g.leadership}</td>
                    <td className="p-3 text-right tabular-nums">{g.team}</td>
                    <td className={cn("p-3 text-right font-semibold tabular-nums", Math.abs(g.gap) >= 15 ? "text-danger" : "text-muted")}>
                      {g.gap > 0 ? "+" : ""}
                      {g.gap}
                    </td>
                    <td className="p-3 text-xs text-muted">
                      {Math.abs(g.gap) < 15 ? "Visión compartida" : g.gap > 0 ? "La dirección es más optimista: posible punto ciego" : "El equipo es más optimista que la dirección"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </ReportSection>
      )}

      {t.disagreements.length > 0 && t.count > 1 && (
        <ReportSection id="t-dis" eyebrow="Desacuerdos" title="Preguntas donde el equipo no coincide" description="Temas a explorar en el taller de devolución: aquí no hay una verdad compartida.">
          <div className="grid gap-4 md:grid-cols-2">
            {t.disagreements.map((d) => (
              <Panel key={d.number} className="p-5">
                <p className="text-xs text-muted">
                  P{d.number} · {d.dimension} · dispersión ±{d.std}
                </p>
                <p className="mt-1 text-sm font-medium">{d.text}</p>
                <div className="mt-3 space-y-1.5">
                  {d.distribution.map((x) => (
                    <div key={x.label} className="flex items-center gap-2 text-xs">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(x.count / t.count) * 100}%`, minWidth: 6, maxWidth: "40%" }} />
                      <span className="truncate text-muted">{x.label}</span>
                      <span className="ml-auto font-semibold">{x.count}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </ReportSection>
      )}

      <ReportSection id="t-pains" eyebrow="Mapa de dolores" title="Dolores más mencionados" description="Cuántos participantes señalan cada dolor (directa o indirectamente).">
        <div className="grid gap-3 md:grid-cols-2">
          {t.pains.map(({ pain, respondents }) => (
            <Panel key={pain.id} className="flex items-start gap-3 p-4">
              <div
                className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl text-xs font-bold"
                style={{ background: `color-mix(in srgb, ${scoreColor(100 - (respondents / t.count) * 100)} 14%, transparent)`, color: scoreColor(100 - (respondents / t.count) * 100) }}
              >
                {respondents}/{t.count}
              </div>
              <div>
                <p className="font-medium">{pain.title}</p>
                <p className="text-sm text-muted">{pain.symptom}</p>
              </div>
            </Panel>
          ))}
        </div>
      </ReportSection>

      {t.openAnswers.length > 0 && (
        <ReportSection id="t-voz" eyebrow="Respuestas abiertas" title="La voz de la organización">
          {t.themes.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {t.themes.map((th) => (
                <span key={th.dimension} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {th.name} · {th.count}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-4">
            {t.openAnswers.map((o) => (
              <Panel key={o.number} className="p-5">
                <p className="text-sm text-muted">
                  P{o.number}. {o.question}
                </p>
                <div className="mt-3 space-y-2">
                  {o.entries.map((e, i) => (
                    <p key={i} className="flex gap-2 text-sm">
                      <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>
                        {e.text} <span className="text-xs text-muted">— {e.who}</span>
                      </span>
                    </p>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </ReportSection>
      )}
    </div>
  );
}
