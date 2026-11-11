"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageSquarePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DIMENSIONS, questionsFor } from "@/lib/diagnostic/questions";
import { isAnswered } from "@/lib/diagnostic/analysis";
import type { Answer, Answers, Question } from "@/lib/diagnostic/types";

export function Survey({
  answers,
  onChange,
  onFinish,
  onBack,
  initialStep = 0,
}: {
  answers: Answers;
  onChange: (qid: string, a: Answer) => void;
  onFinish: () => void;
  onBack: () => void;
  initialStep?: number;
}) {
  const [step, setStep] = useState(initialStep);
  const [showMissing, setShowMissing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const dim = DIMENSIONS[step];
  const questions = questionsFor(dim.id);
  const missing = questions.filter((q) => !q.optional && !isAnswered(answers, q.id));
  const last = step === DIMENSIONS.length - 1;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const next = () => {
    if (missing.length) {
      setShowMissing(true);
      document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setShowMissing(false);
    if (last) onFinish();
    else setStep(step + 1);
  };

  const totalReq = DIMENSIONS.flatMap((d) => questionsFor(d.id)).filter((q) => !q.optional);
  const doneReq = totalReq.filter((q) => isAnswered(answers, q.id)).length;
  const pct = Math.round((doneReq / totalReq.length) * 100);

  return (
    <div ref={topRef} className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-6 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Navegación por dimensiones */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Progreso</span>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${pct}%` }} />
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
            {DIMENSIONS.map((d, i) => {
              const qs = questionsFor(d.id).filter((q) => !q.optional);
              const complete = qs.every((q) => isAnswered(answers, q.id));
              return (
                <button
                  key={d.id}
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    i === step ? "bg-primary/10 font-medium text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                      complete ? "border-success bg-success text-white" : i === step ? "border-primary" : "border-border",
                    )}
                  >
                    {complete ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{d.short}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={dim.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <header className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Dimensión {step + 1} de {DIMENSIONS.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{dim.name}</h2>
                <p className="mt-2 max-w-2xl text-muted">{dim.description}</p>
                <p className="mt-2 text-xs text-muted">Marco de referencia: {dim.framework}</p>
              </header>

              <div className="space-y-5">
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    answer={answers[q.id]}
                    onChange={(a) => onChange(q.id, a)}
                    highlight={showMissing && !q.optional && !isAnswered(answers, q.id)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={() => (step === 0 ? onBack() : setStep(step - 1))}>
              <ArrowLeft className="h-4 w-4" /> {step === 0 ? "Datos generales" : "Anterior"}
            </Button>
            <div className="flex items-center gap-3">
              {showMissing && missing.length > 0 && (
                <span className="hidden text-sm text-danger sm:inline">Faltan {missing.length} respuesta(s)</span>
              )}
              <Button onClick={next} size="lg">
                {last ? (
                  <>
                    <Sparkles className="h-4 w-4" /> Ver diagnóstico
                  </>
                ) : (
                  <>
                    Siguiente <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  answer,
  onChange,
  highlight,
}: {
  q: Question;
  answer?: Answer;
  onChange: (a: Answer) => void;
  highlight?: boolean;
}) {
  const [showComment, setShowComment] = useState(!!answer?.comment);
  const a = answer ?? {};

  return (
    <div
      id={`q-${q.id}`}
      className={cn(
        "rounded-card border bg-surface p-5 card-shadow transition-colors sm:p-6",
        highlight ? "border-danger/60" : "border-border",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-xs font-semibold text-muted">
          {q.number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {q.isNew && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">Nueva</span>}
            {q.profile && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">Perfil</span>}
            {q.optional && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Opcional</span>}
          </div>
          <h3 className="mt-1 text-[15px] font-medium leading-snug sm:text-base">{q.text}</h3>
          {q.help && <p className="mt-1 text-sm text-muted">{q.help}</p>}

          {q.kind === "single" && (
            <div className="mt-4 grid gap-2" role="radiogroup">
              {q.options!.map((o) => {
                const selected = a.option === o.id;
                return (
                  <div key={o.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onChange({ ...a, option: o.id })}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                        selected
                          ? "border-primary bg-primary/[0.07] ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-surface-2",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted",
                        )}
                      >
                        {o.id}
                      </span>
                      <span className="pt-0.5">{o.label}</span>
                    </button>
                    {o.other && selected && (
                      <input
                        autoFocus
                        value={a.text ?? ""}
                        onChange={(e) => onChange({ ...a, text: e.target.value })}
                        placeholder="Especifique…"
                        className="mt-2 h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none focus:border-primary"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {q.kind === "open" && (
            <textarea
              value={a.text ?? ""}
              onChange={(e) => onChange({ ...a, text: e.target.value })}
              placeholder={q.placeholder}
              rows={4}
              className="mt-4 w-full resize-y rounded-xl border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary"
            />
          )}

          {q.kind === "list3" && (
            <div className="mt-4 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <input
                    value={a.items?.[i] ?? ""}
                    onChange={(e) => {
                      const items = [...(a.items ?? ["", "", ""])];
                      items[i] = e.target.value;
                      onChange({ ...a, items });
                    }}
                    placeholder={["Cambio más importante…", "Segundo cambio…", "Tercer cambio…"][i]}
                    className="h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          )}

          {q.kind === "single" && (
            <div className="mt-3">
              {showComment ? (
                <textarea
                  value={a.comment ?? ""}
                  onChange={(e) => onChange({ ...a, comment: e.target.value })}
                  placeholder="Comentario o ejemplo concreto (opcional)…"
                  rows={2}
                  className="w-full resize-y rounded-xl border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowComment(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" /> Agregar comentario
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
