import { globalScore, scoreDimensions } from "./analysis";
import { LEVELS, QUESTION_BY_ID } from "./questions";
import type { Answers, DiagnosticResponse, DiagnosticResponseRow, RespondentInfo } from "./types";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

/** Limpia la información del participante: solo campos conocidos y con largo acotado. */
export function sanitizeInfo(raw: unknown): RespondentInfo {
  const i = (raw ?? {}) as Record<string, unknown>;
  const level = str(i.level, 40);
  return {
    company: str(i.company, 200),
    name: str(i.name, 120),
    role: str(i.role, 120),
    level: LEVELS.some((l) => l.id === level) ? (level as RespondentInfo["level"]) : "",
    tenure: str(i.tenure, 60),
    sector: str(i.sector, 120),
    size: str(i.size, 60),
    date: str(i.date, 10),
  };
}

/** Descarta preguntas u opciones inexistentes y recorta textos. */
export function sanitizeAnswers(raw: unknown): Answers {
  const out: Answers = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [qid, value] of Object.entries(raw as Record<string, unknown>)) {
    const q = QUESTION_BY_ID[qid];
    if (!q || !value || typeof value !== "object") continue;
    const a = value as Record<string, unknown>;
    const clean: Answers[string] = {};
    if (q.kind === "single" && typeof a.option === "string" && q.options?.some((o) => o.id === a.option)) clean.option = a.option;
    if (typeof a.text === "string" && a.text.trim()) clean.text = a.text.slice(0, 3000);
    if (q.kind === "list3" && Array.isArray(a.items)) clean.items = a.items.slice(0, 3).map((t) => str(t, 600));
    if (typeof a.comment === "string" && a.comment.trim()) clean.comment = a.comment.slice(0, 1500);
    if (Object.keys(clean).length) out[qid] = clean;
  }
  return out;
}

/** Puntajes calculados (siempre en el servidor o desde las respuestas, nunca confiando en el cliente). */
export function computeScores(answers: Answers) {
  const dims = scoreDimensions(answers);
  return {
    global: globalScore(dims),
    dimensions: Object.fromEntries(dims.map((d) => [d.id, d.score])) as Record<string, number | null>,
  };
}

export function rowToResponse(row: DiagnosticResponseRow): DiagnosticResponse {
  return {
    id: row.id,
    version: 1,
    info: row.info,
    answers: row.answers ?? {},
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: unknown): s is string => typeof s === "string" && UUID.test(s);
