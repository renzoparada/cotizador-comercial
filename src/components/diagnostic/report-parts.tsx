"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { MATURITY_LEVELS, maturityFor } from "@/lib/diagnostic/catalog";
import { cn } from "@/lib/utils";

export function scoreColor(score: number | null) {
  if (score === null) return "var(--muted)";
  return maturityFor(score).color;
}

export function ScoreGauge({ score, size = 180, label }: { score: number; size?: number; label?: string }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75;
  const color = scoreColor(score);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[135deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${(arc * score) / 100} ${c}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-tight" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-muted">{label ?? "de 100"}</span>
      </div>
    </div>
  );
}

export function MaturityScale({ score }: { score: number }) {
  const current = maturityFor(score);
  return (
    <div>
      <div className="flex gap-1">
        {MATURITY_LEVELS.map((l) => (
          <div key={l.id} className="flex-1">
            <div
              className={cn("h-2 rounded-full transition-opacity", l.id === current.id ? "opacity-100" : "opacity-25")}
              style={{ background: l.color }}
            />
            <p className={cn("mt-1.5 text-[10px] leading-tight sm:text-[11px]", l.id === current.id ? "font-semibold text-foreground" : "text-muted")}>
              {l.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScoreBar({ label, score, sub }: { label: string; score: number | null; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums font-semibold" style={{ color: scoreColor(score) }}>
          {score ?? "—"}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score ?? 0}%`, background: scoreColor(score) }} />
      </div>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function RadarView({
  data,
  series,
  height = 340,
}: {
  data: Record<string, string | number | null>[];
  series: { key: string; name: string; color: string; fillOpacity?: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="dim" tick={{ fill: "var(--muted)", fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} />
        {series.map((s) => (
          <Radar key={s.key} name={s.name} dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={s.fillOpacity ?? 0.2} strokeWidth={2} isAnimationActive={false} />
        ))}
        <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function ReportSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 break-inside-avoid-page", className)}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
      <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {description && <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-card border border-border bg-surface p-5 card-shadow sm:p-6", className)} {...props} />;
}
