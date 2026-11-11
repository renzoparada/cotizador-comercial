"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCw,
  BarChart3,
  ClipboardList,
  Compass,
  FileText,
  Layers,
  Link2,
  Play,
  Radar,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { cn } from "@/lib/utils";
import { completionOf, globalScore, scoreDimensions } from "@/lib/diagnostic/analysis";
import { DIMENSIONS, LEVELS, QUESTIONS, SIZES } from "@/lib/diagnostic/questions";
import { decodeResponse, deleteResponse, loadDraft, newId, saveDraft, saveResponse, useSavedResponses } from "@/lib/diagnostic/storage";
import type { Answer, CampaignPublic, DiagnosticResponse, RespondentInfo } from "@/lib/diagnostic/types";
import { Survey } from "./survey";
import { Results } from "./results";
import { TeamView } from "./team-report";
import { scoreColor } from "./report-parts";

type View = "home" | "info" | "survey" | "results" | "thanks" | "team";

const today = () => new Date().toISOString().slice(0, 10);

function emptyResponse(company = ""): DiagnosticResponse {
  return {
    id: newId(),
    version: 1,
    info: { company, name: "", role: "", level: "", tenure: "", sector: "", size: "", date: today() },
    answers: {},
    createdAt: new Date().toISOString(),
  };
}

type Sync = { state: "idle" | "sending" | "sent" | "error"; error?: string };

export function DiagnosticApp({ campaign }: { campaign?: CampaignPublic }) {
  const scope = campaign?.slug;
  const [presetCompany] = useState(() => campaign?.empresa ?? new URLSearchParams(window.location.search).get("empresa") ?? "");
  const [draft, setDraft] = useState<DiagnosticResponse | null>(() => loadDraft(scope));
  const [view, setView] = useState<View>(() => {
    const d = loadDraft(scope);
    if (campaign && d?.completedAt) return "thanks";
    return presetCompany && !d && !campaign ? "info" : "home";
  });
  const [current, setCurrent] = useState<DiagnosticResponse>(() => loadDraft(scope) ?? emptyResponse(presetCompany));
  const [sync, setSync] = useState<Sync>(() => ({ state: campaign && loadDraft(scope)?.completedAt ? "sent" : "idle" }));
  const saved = useSavedResponses();

  // Importar respuestas compartidas por enlace (#r=...) — solo en modo libre
  useEffect(() => {
    if (campaign) return;
    const m = window.location.hash.match(/#r=([\w-]+)/);
    if (!m) return;
    decodeResponse(m[1]).then((r) => {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      if (!r) {
        toast.error("El enlace de respuestas no es válido.");
        return;
      }
      saveResponse({ ...r, completedAt: r.completedAt ?? new Date().toISOString() });
      toast.success(`Respuestas de ${r.info.name || r.info.role || "un participante"} importadas`, {
        description: r.info.company,
      });
      setCurrent(r);
      setView("results");
    });
  }, [campaign]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  const update = (r: DiagnosticResponse) => {
    const next = campaign ? { ...r, info: { ...r.info, company: campaign.empresa } } : r;
    setCurrent(next);
    if (campaign || !next.completedAt) {
      saveDraft(next, scope);
      setDraft(next);
    } else {
      saveResponse(next);
    }
  };

  const setAnswer = (qid: string, a: Answer) => update({ ...current, answers: { ...current.answers, [qid]: a } });

  const start = (company = "") => {
    const r = emptyResponse(company);
    setCurrent(r);
    saveDraft(r, scope);
    setDraft(r);
    setSync({ state: "idle" });
    setView("info");
  };

  const submit = async (r: DiagnosticResponse) => {
    if (!campaign) return;
    setSync({ state: "sending" });
    try {
      const res = await fetch("/api/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: campaign.slug, response: { id: r.id, info: r.info, answers: r.answers, completed: true } }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "No se pudieron enviar las respuestas.");
      setSync({ state: "sent" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudieron enviar las respuestas.";
      setSync({ state: "error", error: msg });
      toast.error(msg);
    }
  };

  const finish = () => {
    const done = { ...current, completedAt: current.completedAt ?? new Date().toISOString() };
    if (campaign) {
      saveDraft(done, scope);
      setDraft(done);
      void submit(done);
    } else {
      saveResponse(done);
      saveDraft(null);
      setDraft(null);
    }
    setCurrent(done);
    // En una campaña el participante no ve resultados: solo el consultor, desde el panel.
    setView(campaign ? "thanks" : "results");
  };

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <button onClick={() => setView("home")} className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Radar className="h-4 w-4" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-sm font-semibold leading-tight">Diagnóstico 360°</span>
              <span className="block truncate text-[11px] leading-tight text-muted">{campaign ? campaign.empresa : "Salud empresarial"}</span>
            </span>
          </button>
          <div className="ml-auto flex items-center gap-1">
            {!campaign && (
              <Button variant="ghost" size="sm" onClick={() => setView("team")}>
                <Users className="h-4 w-4" /> <span className="hidden sm:inline">Consolidar equipo</span>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {campaign && !campaign.abierta && sync.state !== "sent" && (
        <div className="mx-auto mt-6 max-w-3xl px-4">
          <div className="rounded-card border border-warning/40 bg-warning/10 p-4 text-sm">
            <strong>Este diagnóstico está cerrado.</strong> El consultor ya no recibe nuevas respuestas. Si necesita participar, contáctelo para que lo
            vuelva a abrir.
          </div>
        </div>
      )}


      {view === "home" && (
        <Home
          campaign={campaign}
          draft={draft}
          saved={saved}
          onStart={() => start(presetCompany)}
          onResume={() => {
            if (draft) setCurrent(draft);
            if (campaign && draft?.completedAt) setView("thanks");
            else setView(draft?.info.company && draft.info.level ? "survey" : "info");
          }}
          onOpen={(r) => {
            setCurrent(r);
            setView("results");
          }}
          onTeam={() => setView("team")}
        />
      )}
      {view === "info" && <InfoForm lockCompany={!!campaign} info={current.info} onChange={(info) => update({ ...current, info })} onNext={() => setView("survey")} onBack={() => setView("home")} />}
      {view === "survey" && (
        <Survey answers={current.answers} onChange={setAnswer} onFinish={finish} onBack={() => setView("info")} finishLabel={campaign ? "Enviar respuestas" : undefined} />
      )}
      {view === "results" && !campaign && <Results response={current} onEdit={() => setView("survey")} />}
      {view === "thanks" && campaign && <ThankYou sync={sync} onRetry={() => submit(current)} />}
      {view === "team" && !campaign && (
        <TeamView
          onBack={() => setView("home")}
          onOpen={(r) => {
            setCurrent(r);
            setView("results");
          }}
        />
      )}
    </div>
  );
}

function Home({
  campaign,
  draft,
  saved,
  onStart,
  onResume,
  onOpen,
  onTeam,
}: {
  campaign?: CampaignPublic;
  draft: DiagnosticResponse | null;
  saved: DiagnosticResponse[];
  onStart: () => void;
  onResume: () => void;
  onOpen: (r: DiagnosticResponse) => void;
  onTeam: () => void;
}) {
  const scoredCount = QUESTIONS.filter((q) => q.kind === "single" && !q.profile).length;
  const copyInvite = async () => {
    const company = window.prompt("Nombre de la empresa para el enlace de invitación:", "");
    if (company === null) return;
    const url = `${window.location.origin}/diagnostico${company.trim() ? `?empresa=${encodeURIComponent(company.trim())}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace de invitación copiado", { description: "Compártalo con los participantes." });
    } catch {
      window.prompt("Copie este enlace:", url);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <Compass className="h-3.5 w-3.5 text-primary" /> Evaluación estratégica, comercial y organizacional
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            {campaign ? (
              <>
                {campaign.titulo}: <span className="text-primary">{campaign.empresa}</span>
              </>
            ) : (
              <>
                Descubra qué le pasa <span className="text-primary">realmente</span> a su empresa.
              </>
            )}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Un diagnóstico 360° que detecta dolores, fallas internas, falta de rumbo y oportunidades, sin pedir información financiera confidencial. En
            15 minutos obtiene un informe con índice de salud, radar por dimensión, FODA, causas raíz y una hoja de ruta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {campaign && draft?.completedAt ? (
              <Button size="lg" onClick={onResume}>
                <CheckCircle2 className="h-4 w-4" /> Ya respondió este diagnóstico
              </Button>
            ) : draft && Object.keys(draft.answers).length > 0 ? (
              <>
                <Button size="lg" onClick={onResume}>
                  <Play className="h-4 w-4" /> Continuar diagnóstico ({completionOf(draft.answers)}%)
                </Button>
                <Button size="lg" variant="outline" onClick={onStart}>
                  Empezar uno nuevo
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={onStart}>
                Comenzar diagnóstico <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {!campaign && (
              <Button size="lg" variant="ghost" onClick={copyInvite}>
                <Link2 className="h-4 w-4" /> Invitar participantes
              </Button>
            )}
          </div>
          <p className="mt-4 text-xs text-muted">
            {QUESTIONS.length} preguntas · {DIMENSIONS.length} dimensiones · {scoredCount} puntuadas · {campaign ? "Sus respuestas se envían de forma confidencial al consultor." : "Las respuestas se guardan solo en este dispositivo."}
          </p>
        </div>
      </section>

      <section className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ClipboardList, title: "1. Responder", text: "Cada participante responde por su cuenta: accionistas, dirección, mandos medios y equipo." },
          { icon: BarChart3, title: "2. Informe individual", text: "Índice de salud, radar, dolores, alertas, FODA y perfil estratégico al instante." },
          { icon: Users, title: "3. Consolidar", text: "Reúna las respuestas para ver brechas de percepción entre dirección y equipo." },
          { icon: Wrench, title: "4. Actuar", text: "Hoja de ruta 30-90-365 días y las metodologías adecuadas para cada dolor." },
        ].map((s) => (
          <div key={s.title} className="rounded-card border border-border bg-surface p-5 card-shadow">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-muted">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="pb-12">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Layers className="h-5 w-5 text-primary" /> Las 9 dimensiones del diagnóstico
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map((d, i) => (
            <div key={d.id} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold">
                <span className="text-muted">{i + 1}.</span> {d.name}
              </p>
              <p className="mt-1 text-sm text-muted">{d.description}</p>
              <p className="mt-2 text-[11px] font-medium text-primary">{d.framework}</p>
            </div>
          ))}
        </div>
      </section>

      {!campaign && saved.length > 0 && (
        <section className="pb-16">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <FileText className="h-5 w-5 text-primary" /> Diagnósticos guardados
            </h2>
            <Button variant="outline" size="sm" onClick={onTeam}>
              <Users className="h-3.5 w-3.5" /> Consolidar
            </Button>
          </div>
          <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
            {saved.map((r) => {
              const g = globalScore(scoreDimensions(r.answers));
              return (
                <div key={r.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold" style={{ color: scoreColor(g), background: `color-mix(in srgb, ${scoreColor(g)} 12%, transparent)` }}>
                    {g}
                  </span>
                  <button onClick={() => onOpen(r)} className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium">{r.info.company || "Sin nombre"}</p>
                    <p className="truncate text-xs text-muted">
                      {[r.info.name, r.info.role, r.info.date].filter(Boolean).join(" · ")}
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("¿Eliminar este diagnóstico de este dispositivo?")) deleteResponse(r.id);
                    }}
                    className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-danger"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoForm({
  lockCompany,
  info,
  onChange,
  onNext,
  onBack,
}: {
  lockCompany?: boolean;
  info: RespondentInfo;
  onChange: (i: RespondentInfo) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const set = (k: keyof RespondentInfo, v: string) => onChange({ ...info, [k]: v });
  const valid = info.company.trim() && info.level;
  const field = "h-11 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Información general</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Antes de empezar</h1>
      <p className="mt-2 text-muted">
        Las respuestas se usan exclusivamente para elaborar un diagnóstico preliminar. El propósito no es evaluar personas, sino comprender la
        organización. Responda con franqueza: no hay respuestas correctas.
      </p>

      <div className="mt-8 grid gap-4 rounded-card border border-border bg-surface p-5 card-shadow sm:grid-cols-2 sm:p-6">
        <L label="Empresa *" className="sm:col-span-2">
          <input readOnly={lockCompany} className={cn(field, touched && !info.company.trim() && "border-danger", lockCompany && "opacity-70")} value={info.company} onChange={(e) => set("company", e.target.value)} placeholder="Nombre de la empresa" />
        </L>
        <L label="Nombre del participante">
          <input className={field} value={info.name} onChange={(e) => set("name", e.target.value)} placeholder="Opcional (puede ser anónimo)" />
        </L>
        <L label="Cargo">
          <input className={field} value={info.role} onChange={(e) => set("role", e.target.value)} placeholder="Ej. Gerente comercial" />
        </L>
        <L as="div" label="Nivel en la organización *" className="sm:col-span-2">
          <div className={cn("grid gap-2 sm:grid-cols-2", touched && !info.level && "rounded-xl ring-1 ring-danger")}>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => set("level", l.id)}
                className={cn("rounded-xl border px-3 py-2.5 text-left text-sm transition-colors", info.level === l.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-surface-2")}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted">Permite comparar la percepción de la dirección con la del equipo.</p>
        </L>
        <L label="Antigüedad en la empresa">
          <input className={field} value={info.tenure} onChange={(e) => set("tenure", e.target.value)} placeholder="Ej. 3 años" />
        </L>
        <L label="Fecha">
          <input type="date" className={field} value={info.date} onChange={(e) => set("date", e.target.value)} />
        </L>
        <L label="Sector / rubro">
          <input className={field} value={info.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Ej. Manufactura, retail, servicios…" />
        </L>
        <L label="Tamaño">
          <select className={field} value={info.size} onChange={(e) => set("size", e.target.value)}>
            <option value="">Seleccione…</option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </L>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Volver
        </Button>
        <Button
          size="lg"
          onClick={() => {
            setTouched(true);
            if (valid) onNext();
          }}
        >
          Comenzar cuestionario <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function L({ label, children, className, as = "label" }: { label: string; children: React.ReactNode; className?: string; as?: "label" | "div" }) {
  const Tag = as;
  return (
    <Tag className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </Tag>
  );
}

function ThankYou({ sync, onRetry }: { sync: Sync; onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      {sync.state === "error" ? (
        <>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
            <RotateCw className="h-7 w-7" />
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">No pudimos enviar sus respuestas</h1>
          <p className="mt-3 text-muted">{sync.error} Sus respuestas siguen guardadas en este dispositivo; inténtelo nuevamente.</p>
          <Button size="lg" className="mt-8" onClick={onRetry}>
            <RotateCw className="h-4 w-4" /> Reintentar envío
          </Button>
        </>
      ) : sync.state === "sending" ? (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-6 text-muted">Enviando sus respuestas…</p>
        </>
      ) : (
        <>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">¡Gracias por responder!</h1>
          <p className="mt-4 text-lg text-muted">Sus respuestas fueron recibidas correctamente.</p>
          <p className="mt-2 text-lg text-muted">Le enviaremos sus resultados en la próxima sesión.</p>
          <p className="mt-8 text-sm text-muted">Ya puede cerrar esta ventana.</p>
        </>
      )}
    </div>
  );
}
