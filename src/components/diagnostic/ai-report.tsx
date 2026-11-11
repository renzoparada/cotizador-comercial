"use client";

import { useState } from "react";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Report } from "@/lib/diagnostic/analysis";
import type { RespondentInfo } from "@/lib/diagnostic/types";
import { Panel } from "./report-parts";

interface AiResult {
  resumen: string;
  hallazgos: string[];
  causas_raiz: string[];
  recomendaciones: { accion: string; plazo: string; impacto: string }[];
  preguntas_profundizar: string[];
}

export function AiReport({ report, info }: { report: Report; info: RespondentInfo }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ msg: string; auth?: boolean } | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: info.company,
          sector: info.sector,
          size: info.size,
          role: info.role,
          global: report.global,
          maturity: report.maturity.name,
          dimensions: report.dimensions.map((d) => ({ name: d.name, score: d.score })),
          pains: report.pains.slice(0, 8).map((p) => p.title),
          alerts: report.alerts.map((a) => a.text),
          insights: report.insights.map((i) => `${i.title}: ${i.text}`),
          profile: report.profile,
          open: report.openAnswers.map((o) => `${o.question} → ${o.text.join(" | ")}`),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError({ msg: json.error ?? "No se pudo generar el informe.", auth: res.status === 401 });
        return;
      }
      setResult(json.result as AiResult);
    } catch {
      setError({ msg: "No se pudo conectar con el servicio de IA." });
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <Panel className="no-print flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 text-gold" /> Informe narrativo con IA
          </p>
          <p className="mt-1 text-sm text-muted">
            Redacta un resumen ejecutivo, causas raíz, recomendaciones priorizadas y preguntas para la entrevista de profundización.
          </p>
          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-danger">
              {error.auth && <Lock className="h-3.5 w-3.5" />}
              {error.auth ? "Disponible para consultores: inicia sesión en el panel para usarlo." : error.msg}
            </p>
          )}
        </div>
        <Button variant="gold" onClick={run} loading={loading} className="shrink-0">
          <Sparkles className="h-4 w-4" /> Generar con IA
        </Button>
      </Panel>
    );
  }

  return (
    <Panel className="space-y-5">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-gold">
          <Sparkles className="h-4 w-4" /> Resumen ejecutivo (IA)
        </p>
        <p className="mt-2 whitespace-pre-line leading-relaxed">{result.resumen}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <List title="Hallazgos clave" items={result.hallazgos} />
        <List title="Causas raíz probables" items={result.causas_raiz} />
      </div>
      {result.recomendaciones?.length > 0 && (
        <div>
          <p className="text-sm font-semibold">Recomendaciones priorizadas</p>
          <div className="mt-2 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted">
                <tr>
                  <th className="p-2.5">Acción</th>
                  <th className="p-2.5">Plazo</th>
                  <th className="p-2.5">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {result.recomendaciones.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2.5">{r.accion}</td>
                    <td className="p-2.5 whitespace-nowrap text-muted">{r.plazo}</td>
                    <td className="p-2.5 whitespace-nowrap text-muted">{r.impacto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <List title="Preguntas para profundizar en la entrevista" items={result.preguntas_profundizar} />
    </Panel>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
