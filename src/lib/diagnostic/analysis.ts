import { MATURITY_LEVELS, PAINS, ROADMAP_ACTIONS, TOOLS, maturityFor, type Pain, type Tool } from "./catalog";
import { DIMENSIONS, DIMENSION_BY_ID, QUESTIONS, QUESTION_BY_ID } from "./questions";
import type { Answers, DiagnosticResponse, DimensionId, QuestionOption, RespondentLevel, SwotType } from "./types";

export interface DimensionScore {
  id: DimensionId;
  name: string;
  short: string;
  score: number | null;
  answered: number;
  total: number;
}

export interface DetectedPain extends Pain {
  hits: number;
  weight: number;
  sources: number[];
}

export interface Insight {
  kind: "Contradicción" | "Causa raíz" | "Riesgo" | "Oportunidad";
  title: string;
  text: string;
}

export interface StrategicProfile {
  intent: string;
  ansoff: string;
  ansoffText: string;
  readiness: number;
  coherence: string;
}

export interface Report {
  dimensions: DimensionScore[];
  global: number;
  maturity: (typeof MATURITY_LEVELS)[number];
  pains: DetectedPain[];
  alerts: { text: string; question: number }[];
  swot: Record<SwotType, string[]>;
  insights: Insight[];
  profile: StrategicProfile;
  tools: (Tool & { reasons: string[]; weight: number })[];
  roadmap: { dimension: DimensionId; name: string; score: number; quick: string; build: string; transform: string }[];
  openAnswers: { question: string; number: number; text: string[] }[];
  themes: { dimension: DimensionId; name: string; count: number }[];
  completion: number;
  strengths: DimensionScore[];
  weaknesses: DimensionScore[];
}

export function optionOf(answers: Answers, qid: string): QuestionOption | undefined {
  const a = answers[qid];
  if (!a?.option) return undefined;
  return QUESTION_BY_ID[qid]?.options?.find((o) => o.id === a.option);
}

const is = (answers: Answers, qid: string, ...ids: string[]) => {
  const opt = answers[qid]?.option;
  return !!opt && ids.includes(opt);
};

export function scoreDimensions(answers: Answers): DimensionScore[] {
  return DIMENSIONS.map((d) => {
    const scored = QUESTIONS.filter((q) => q.dimension === d.id && q.kind === "single" && !q.profile);
    const values = scored.map((q) => optionOf(answers, q.id)?.score).filter((v): v is number => typeof v === "number");
    return {
      id: d.id,
      name: d.name,
      short: d.short,
      score: values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null,
      answered: values.length,
      total: scored.length,
    };
  });
}

export function globalScore(dims: { id: DimensionId; score: number | null }[]) {
  let sum = 0;
  let w = 0;
  for (const d of dims) {
    if (d.score === null) continue;
    const weight = DIMENSION_BY_ID[d.id].weight;
    sum += d.score * weight;
    w += weight;
  }
  return w ? Math.round(sum / w) : 0;
}

export function completionOf(answers: Answers) {
  const required = QUESTIONS.filter((q) => !q.optional);
  const done = required.filter((q) => isAnswered(answers, q.id)).length;
  return Math.round((done / required.length) * 100);
}

export function isAnswered(answers: Answers, qid: string) {
  const q = QUESTION_BY_ID[qid];
  const a = answers[qid];
  if (!q || !a) return false;
  if (q.kind === "single") return !!a.option;
  if (q.kind === "open") return !!a.text?.trim();
  return (a.items ?? []).some((i) => i.trim());
}

function detectPains(answers: Answers, dims: DimensionScore[]): DetectedPain[] {
  const map = new Map<string, DetectedPain>();
  for (const q of QUESTIONS) {
    const opt = optionOf(answers, q.id);
    for (const pid of opt?.pains ?? []) {
      const pain = PAINS[pid];
      if (!pain) continue;
      const cur = map.get(pid) ?? { ...pain, hits: 0, weight: 0, sources: [] };
      cur.hits += 1;
      cur.sources.push(q.number);
      map.set(pid, cur);
    }
  }
  const dimScore = Object.fromEntries(dims.map((d) => [d.id, d.score ?? 50]));
  for (const p of map.values()) {
    p.weight = Math.round(p.severity * (1 + 0.6 * (p.hits - 1)) * (1 + (100 - dimScore[p.dimension]) / 100) * 10) / 10;
  }
  return [...map.values()].sort((a, b) => b.weight - a.weight);
}

function buildSwot(answers: Answers, dims: DimensionScore[]): Record<SwotType, string[]> {
  const swot: Record<SwotType, string[]> = { F: [], D: [], O: [], A: [] };
  for (const q of QUESTIONS) {
    for (const s of optionOf(answers, q.id)?.swot ?? []) swot[s.t].push(s.text);
  }
  for (const d of dims) {
    if (d.score === null) continue;
    if (d.score >= 75) swot.F.push(`${d.name}: dimensión sólida (${d.score}/100).`);
    if (d.score < 40) swot.D.push(`${d.name}: dimensión débil (${d.score}/100).`);
  }
  const strength = answers.f4?.text?.trim();
  if (strength) swot.F.unshift(`Lo que mejor hace la empresa: «${strength}».`);
  // Oportunidades derivadas del contexto actual del mercado
  if (dims.find((d) => d.id === "innovacion")?.score !== null && (dims.find((d) => d.id === "innovacion")?.score ?? 100) < 60)
    swot.O.push("La digitalización y la IA permiten saltos de productividad con inversiones acotadas.");
  if (is(answers, "c2", "C", "D")) swot.O.push("Escuchar sistemáticamente al cliente puede revelar mejoras de alto impacto y bajo costo.");
  if (is(answers, "f3", "C", "D")) swot.A.push("Cambios tecnológicos, regulatorios o de sostenibilidad que pueden tomar a la empresa por sorpresa.");
  for (const k of Object.keys(swot) as SwotType[]) swot[k] = [...new Set(swot[k])];
  return swot;
}

function buildInsights(answers: Answers, dims: DimensionScore[]): Insight[] {
  const s = Object.fromEntries(dims.map((d) => [d.id, d.score])) as Record<DimensionId, number | null>;
  const out: Insight[] = [];

  if (is(answers, "q1", "A") && is(answers, "q2", "E"))
    out.push({ kind: "Contradicción", title: "Visión clara, pero sin prioridad", text: "Se afirma que existe una visión compartida, pero no hay una prioridad estratégica definida. Probablemente la visión es declarativa y no se ha traducido en decisiones." });
  if (is(answers, "q1", "A", "B") && is(answers, "q2b", "C", "D"))
    out.push({ kind: "Causa raíz", title: "La visión no se convierte en objetivos", text: "Hay visión, pero no hay objetivos medibles que la aterricen. Sin metas por área, la estrategia queda en el discurso. Herramienta sugerida: OKR." });
  if (is(answers, "q4", "C", "D", "E") && is(answers, "q13", "C", "D", "E"))
    out.push({ kind: "Causa raíz", title: "Cuello de botella en la cima", text: "Las decisiones son lentas y los gerentes no tienen autonomía: la empresa avanza a la velocidad de muy pocas personas. Delegar con reglas claras liberará capacidad de gestión." });
  if (is(answers, "q6b", "C", "D") && is(answers, "q9b", "D"))
    out.push({ kind: "Riesgo", title: "El dueño es el sistema", text: "Tanto la gestión como las ventas dependen de una persona. Es el principal riesgo de continuidad y un freno al crecimiento." });
  if (is(answers, "q9", "D") || (is(answers, "f2", "C", "D") && is(answers, "q9", "A", "B")))
    out.push({ kind: "Causa raíz", title: "Brecha de ejecución", text: "La empresa sabe ver oportunidades, pero no las convierte en resultados. El problema no es de ideas sino de foco, seguimiento y responsables." });
  if (is(answers, "q2", "C", "D") && ((s.innovacion ?? 100) < 45 || is(answers, "q11", "C", "E")))
    out.push({ kind: "Contradicción", title: "Ambición de crecimiento vs. capacidad de cambio", text: "El propósito apunta a expandirse o diversificar, pero la organización muestra resistencia al cambio o baja madurez de innovación. Conviene preparar la capacidad de cambio antes de grandes apuestas." });
  if (is(answers, "q18", "E") && (s.operaciones ?? 100) < 50)
    out.push({ kind: "Riesgo", title: "Diversificar para huir de los problemas", text: "Se busca un nuevo negocio por las dificultades del actual, pero los problemas internos se trasladarán al nuevo. Primero estabilizar el núcleo (Horizonte 1)." });
  if (is(answers, "q17", "B", "C") && is(answers, "q18", "D", "B"))
    out.push({ kind: "Oportunidad", title: "Activos listos para nuevos negocios", text: "Hay capacidad disponible y voluntad de usarla. Se pueden explorar negocios adyacentes que aprovechen infraestructura y experiencia existentes con bajo riesgo." });
  if (is(answers, "q14", "C", "D", "E") && is(answers, "q15", "D", "E"))
    out.push({ kind: "Riesgo", title: "Riesgo de fuga de talento", text: "Baja motivación y dificultad para retener talento: el equipo actual podría no sostener la siguiente etapa." });
  if (is(answers, "q19", "E") || (is(answers, "q5", "C", "D", "E") && is(answers, "q1", "C", "D")))
    out.push({ kind: "Causa raíz", title: "El conflicto empieza en la propiedad", text: "La falta de consenso o la mezcla de roles entre accionistas se traduce en falta de rumbo para toda la empresa. El primer paso es alinear a los dueños." });
  if (is(answers, "q12", "C", "D", "E") && (is(answers, "q7", "E") || is(answers, "q17", "E")))
    out.push({ kind: "Causa raíz", title: "Se gestiona sin datos", text: "La baja digitalización impide medir el desempeño comercial y operativo. Sin datos, las decisiones dependen de opiniones." });
  if (is(answers, "q8", "A") && is(answers, "c1", "C", "D"))
    out.push({ kind: "Causa raíz", title: "La guerra de precios es un síntoma", text: "Se culpa a la competencia y al precio, pero la empresa no tiene clara su diferenciación. Sin propuesta de valor, el único argumento es el precio." });
  if (is(answers, "q8", "F") && is(answers, "c2", "C", "D"))
    out.push({ kind: "Causa raíz", title: "El cliente cambió y nadie lo escuchó", text: "Se percibe que los clientes cambian, pero no hay mecanismos para escucharlos. Instalar la voz del cliente es urgente." });
  if (is(answers, "f1", "C", "D") && (s.comercial ?? 100) < 45)
    out.push({ kind: "Riesgo", title: "Complacencia frente al deterioro", text: "Los indicadores comerciales se deterioran, pero la organización no percibe urgencia de cambio. Hay que crear un sentido de urgencia basado en hechos." });
  if (is(answers, "q14b", "C", "D") && is(answers, "q1", "B"))
    out.push({ kind: "Causa raíz", title: "La visión se queda en la dirección", text: "La visión existe, pero la comunicación interna no la hace llegar. Un ritmo de comunicación fijo resolvería buena parte de la desalineación." });
  if (is(answers, "c3", "C", "D") && is(answers, "q8", "B"))
    out.push({ kind: "Riesgo", title: "Concentración sin motor de captación", text: "Pocos clientes sostienen el negocio y no se consiguen nuevos. Diversificar la cartera es prioridad comercial." });
  if ((s.innovacion ?? 0) >= 70 && (s.talento ?? 0) >= 65)
    out.push({ kind: "Oportunidad", title: "Base lista para transformarse", text: "Cultura de innovación y talento sólidos: la empresa puede asumir proyectos de transformación ambiciosos." });
  return out;
}

function buildProfile(answers: Answers, dims: DimensionScore[]): StrategicProfile {
  const s = Object.fromEntries(dims.map((d) => [d.id, d.score ?? 50])) as Record<DimensionId, number>;
  const readiness = Math.round((s.innovacion + s.talento + s.futuro + s.liderazgo) / 4);
  const intentMap: Record<string, [string, string, string]> = {
    A: ["Consolidar el negocio actual", "Penetración de mercado", "Crecer con los productos actuales en los mercados actuales: ganar participación, fidelizar y mejorar eficiencia."],
    B: ["Recuperar crecimiento y rentabilidad", "Penetración + eficiencia (Horizonte 1)", "Defender el núcleo: foco en clientes rentables, propuesta de valor y eficiencia operativa antes de abrir nuevos frentes."],
    C: ["Expandirse a nuevos mercados", "Desarrollo de mercados", "Llevar los productos actuales a nuevos segmentos, canales o geografías."],
    D: ["Diversificar hacia nuevos negocios", "Diversificación (Horizontes 2 y 3)", "Crear nuevos negocios. Es la opción de mayor riesgo: conviene empezar por diversificación relacionada y experimentos de bajo costo."],
    E: ["Sin prioridad definida", "Por definir", "Antes de elegir una vía de crecimiento, la dirección debe acordar la prioridad estratégica."],
  };
  const [intent, ansoff, ansoffText] = intentMap[answers.q2?.option ?? "E"] ?? intentMap.E;
  const risky = answers.q2?.option === "C" || answers.q2?.option === "D";
  let coherence: string;
  if (!answers.q2?.option || answers.q2.option === "E") coherence = "La intención estratégica no está definida: es el primer tema a resolver.";
  else if (risky && readiness < 50) coherence = `La ambición (${ansoff.toLowerCase()}) supera la capacidad de cambio actual (${readiness}/100). Recomendado: fortalecer liderazgo, talento y ejecución primero.`;
  else if (risky) coherence = `La capacidad de cambio (${readiness}/100) acompaña la ambición de crecimiento. Avanzar con experimentos y criterios claros de inversión.`;
  else if (readiness >= 70) coherence = `La organización tiene capacidad (${readiness}/100) para ambiciones mayores que la actual: evaluar opciones de Horizonte 2.`;
  else coherence = `Intención coherente con la capacidad actual (${readiness}/100): foco en ordenar y fortalecer el núcleo.`;
  return { intent, ansoff, ansoffText, readiness, coherence };
}

const THEME_WORDS: Record<DimensionId, string[]> = {
  vision: ["visión", "vision", "rumbo", "estrateg", "objetivo", "meta", "dirección", "direccion", "propósito", "proposito", "misión", "mision", "prioridad", "plan"],
  liderazgo: ["decisi", "dueño", "dueno", "accionista", "gerente general", "liderazgo", "líder", "lider", "gobierno", "directorio", "familia", "socio", "poder", "control"],
  clientes: ["cliente", "servicio", "calidad", "experiencia", "satisfacción", "satisfaccion", "reclamo", "fideliz"],
  comercial: ["venta", "vender", "mercado", "precio", "competencia", "comercial", "marketing", "marca", "publicidad", "canal"],
  innovacion: ["innova", "tecnolog", "digital", "sistema", "software", "ia", "inteligencia artificial", "automatiz", "datos", "erp", "crm"],
  talento: ["personal", "equipo", "talento", "gente", "motiva", "clima", "comunicación", "comunicacion", "capacita", "rotación", "rotacion", "cultura", "sueldo", "salario"],
  operaciones: ["proceso", "operaci", "burocra", "eficien", "costo", "logística", "logistica", "producción", "produccion", "maquinaria", "inventario", "orden"],
  diversificacion: ["diversific", "nuevo negocio", "nuevos negocios", "invertir", "inversión", "inversion", "expansión", "expansion"],
  futuro: ["cambio", "transforma", "futuro", "ejecución", "ejecucion", "resistencia", "urgencia", "tendencia"],
};

export function collectOpenText(answers: Answers): string[] {
  const out: string[] = [];
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    if (!a) continue;
    if (a.text?.trim()) out.push(a.text.trim());
    for (const it of a.items ?? []) if (it.trim()) out.push(it.trim());
    if (a.comment?.trim()) out.push(a.comment.trim());
  }
  return out;
}

export function detectThemes(texts: string[]) {
  const blob = texts.join(" \n ").toLowerCase();
  return DIMENSIONS.map((d) => ({
    dimension: d.id,
    name: d.short,
    count: THEME_WORDS[d.id].reduce((n, w) => n + (blob.match(new RegExp(`\\b${w}`, "g"))?.length ?? 0), 0),
  }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function analyze(answers: Answers): Report {
  const dimensions = scoreDimensions(answers);
  const global = globalScore(dimensions);
  const pains = detectPains(answers, dimensions);

  const alerts = QUESTIONS.flatMap((q) => {
    const c = optionOf(answers, q.id)?.critical;
    return c ? [{ text: c, question: q.number }] : [];
  });

  const toolMap = new Map<string, Tool & { reasons: string[]; weight: number }>();
  pains.forEach((p) => {
    p.tools.forEach((tid, idx) => {
      const t = TOOLS[tid];
      if (!t) return;
      const cur = toolMap.get(tid) ?? { ...t, reasons: [], weight: 0 };
      cur.reasons.push(p.title);
      cur.weight += p.weight / (idx + 1);
      toolMap.set(tid, cur);
    });
  });
  if (!toolMap.has("foda")) toolMap.set("foda", { ...TOOLS.foda, reasons: ["Convertir el diagnóstico en estrategias"], weight: 0.5 });
  const tools = [...toolMap.values()].sort((a, b) => b.weight - a.weight).slice(0, 10);

  const scored = dimensions.filter((d): d is DimensionScore & { score: number } => d.score !== null);
  const roadmap = [...scored]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((d) => ({ dimension: d.id, name: d.name, score: d.score, ...ROADMAP_ACTIONS[d.id] }));

  const openAnswers = QUESTIONS.filter((q) => q.kind !== "single")
    .map((q) => {
      const a = answers[q.id];
      const text = q.kind === "list3" ? (a?.items ?? []).filter((t) => t.trim()) : a?.text?.trim() ? [a.text.trim()] : [];
      return { question: q.text, number: q.number, text };
    })
    .filter((o) => o.text.length);

  return {
    dimensions,
    global,
    maturity: maturityFor(global),
    pains,
    alerts,
    swot: buildSwot(answers, dimensions),
    insights: buildInsights(answers, dimensions),
    profile: buildProfile(answers, dimensions),
    tools,
    roadmap,
    openAnswers,
    themes: detectThemes(collectOpenText(answers)),
    completion: completionOf(answers),
    strengths: [...scored].sort((a, b) => b.score - a.score).filter((d) => d.score >= 65).slice(0, 3),
    weaknesses: [...scored].sort((a, b) => a.score - b.score).filter((d) => d.score < 50).slice(0, 3),
  };
}

// ───────────────────────── Consolidado de equipo ─────────────────────────

const LEADERSHIP: RespondentLevel[] = ["accionista", "gerencia_general"];
const TEAM: RespondentLevel[] = ["gerencia_area", "colaborador"];

export interface TeamDimension {
  id: DimensionId;
  short: string;
  name: string;
  mean: number | null;
  min: number | null;
  max: number | null;
  std: number;
  leadership: number | null;
  team: number | null;
}

export interface TeamReport {
  count: number;
  global: number;
  maturity: (typeof MATURITY_LEVELS)[number];
  alignment: number;
  dimensions: TeamDimension[];
  disagreements: { number: number; text: string; dimension: string; std: number; distribution: { label: string; count: number }[] }[];
  pains: { pain: Pain; respondents: number }[];
  alerts: { text: string; respondents: number }[];
  gaps: { short: string; leadership: number; team: number; gap: number }[];
  openAnswers: { number: number; question: string; entries: { who: string; text: string }[] }[];
  themes: ReturnType<typeof detectThemes>;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const stdev = (xs: number[]) => {
  const m = mean(xs);
  if (m === null || xs.length < 2) return 0;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
};

export function analyzeTeam(responses: DiagnosticResponse[]): TeamReport {
  const perResp = responses.map((r) => ({ r, dims: scoreDimensions(r.answers), report: analyze(r.answers) }));

  const dimensions: TeamDimension[] = DIMENSIONS.map((d) => {
    const vals = perResp.map((p) => p.dims.find((x) => x.id === d.id)?.score).filter((v): v is number => typeof v === "number");
    const lv = perResp
      .filter((p) => LEADERSHIP.includes(p.r.info.level as RespondentLevel))
      .map((p) => p.dims.find((x) => x.id === d.id)?.score)
      .filter((v): v is number => typeof v === "number");
    const tv = perResp
      .filter((p) => TEAM.includes(p.r.info.level as RespondentLevel))
      .map((p) => p.dims.find((x) => x.id === d.id)?.score)
      .filter((v): v is number => typeof v === "number");
    const m = mean(vals);
    const lm = mean(lv);
    const tm = mean(tv);
    return {
      id: d.id,
      short: d.short,
      name: d.name,
      mean: m === null ? null : Math.round(m),
      min: vals.length ? Math.min(...vals) : null,
      max: vals.length ? Math.max(...vals) : null,
      std: Math.round(stdev(vals)),
      leadership: lm === null ? null : Math.round(lm),
      team: tm === null ? null : Math.round(tm),
    };
  });

  const global = globalScore(dimensions.map((d) => ({ id: d.id, score: d.mean })));
  const avgStd = mean(dimensions.map((d) => d.std)) ?? 0;
  const alignment = Math.max(0, Math.min(100, Math.round(100 - avgStd * 2.2)));

  const disagreements = QUESTIONS.filter((q) => q.kind === "single")
    .map((q) => {
      const scores = responses.map((r) => optionOf(r.answers, q.id)?.score).filter((v): v is number => typeof v === "number");
      const distribution = (q.options ?? [])
        .map((o) => ({ label: `${o.id}. ${o.label}`, count: responses.filter((r) => r.answers[q.id]?.option === o.id).length }))
        .filter((x) => x.count > 0);
      return { number: q.number, text: q.text, dimension: DIMENSION_BY_ID[q.dimension].short, std: Math.round(stdev(scores)), distribution };
    })
    .filter((d) => d.std >= 25 || (d.distribution.length >= 3 && responses.length >= 3))
    .sort((a, b) => b.std - a.std)
    .slice(0, 8);

  const painCount = new Map<string, number>();
  const alertCount = new Map<string, number>();
  for (const p of perResp) {
    for (const pain of p.report.pains) painCount.set(pain.id, (painCount.get(pain.id) ?? 0) + 1);
    for (const a of new Set(p.report.alerts.map((x) => x.text))) alertCount.set(a, (alertCount.get(a) ?? 0) + 1);
  }
  const pains = [...painCount.entries()]
    .map(([id, n]) => ({ pain: PAINS[id], respondents: n }))
    .sort((a, b) => b.respondents * b.pain.severity - a.respondents * a.pain.severity)
    .slice(0, 12);
  const alerts = [...alertCount.entries()].map(([text, n]) => ({ text, respondents: n })).sort((a, b) => b.respondents - a.respondents);

  const gaps = dimensions
    .filter((d) => d.leadership !== null && d.team !== null)
    .map((d) => ({ short: d.short, leadership: d.leadership!, team: d.team!, gap: d.leadership! - d.team! }))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  const openAnswers = QUESTIONS.filter((q) => q.kind !== "single")
    .map((q) => ({
      number: q.number,
      question: q.text,
      entries: responses.flatMap((r) => {
        const a = r.answers[q.id];
        const who = r.info.role || r.info.name || "Participante";
        const texts = q.kind === "list3" ? (a?.items ?? []) : [a?.text ?? ""];
        return texts.filter((t) => t.trim()).map((t) => ({ who, text: t.trim() }));
      }),
    }))
    .filter((o) => o.entries.length);

  return {
    count: responses.length,
    global,
    maturity: maturityFor(global),
    alignment,
    dimensions,
    disagreements,
    pains,
    alerts,
    gaps,
    openAnswers,
    themes: detectThemes(responses.flatMap((r) => collectOpenText(r.answers))),
  };
}
