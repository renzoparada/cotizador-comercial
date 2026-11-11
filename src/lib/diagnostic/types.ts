export type DimensionId =
  | "vision"
  | "liderazgo"
  | "clientes"
  | "comercial"
  | "innovacion"
  | "talento"
  | "operaciones"
  | "diversificacion"
  | "futuro";

export type SwotType = "F" | "D" | "O" | "A";

export interface QuestionOption {
  id: string;
  label: string;
  /** Madurez 0–100 que aporta esta respuesta. Ausente en preguntas de perfil. */
  score?: number;
  /** Dolores (síntomas) que activa esta respuesta. */
  pains?: string[];
  /** Si existe, la respuesta es una alerta crítica con este mensaje. */
  critical?: string;
  /** Aporte al FODA. */
  swot?: { t: SwotType; text: string }[];
  /** Permite escribir un texto libre ("Otros"). */
  other?: boolean;
}

export interface Question {
  id: string;
  number: number;
  dimension: DimensionId;
  text: string;
  help?: string;
  kind: "single" | "open" | "list3";
  /** Pregunta nueva, agregada como mejora al cuestionario original. */
  isNew?: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  /** Las preguntas de perfil se usan para el análisis estratégico pero no suman puntaje. */
  profile?: boolean;
  optional?: boolean;
}

export interface Dimension {
  id: DimensionId;
  name: string;
  short: string;
  description: string;
  /** Marco de referencia que inspira la dimensión. */
  framework: string;
  weight: number;
}

export interface Answer {
  option?: string;
  text?: string;
  items?: string[];
  comment?: string;
}

export type Answers = Record<string, Answer>;

export type RespondentLevel =
  | "accionista"
  | "gerencia_general"
  | "gerencia_area"
  | "colaborador"
  | "externo";

export interface RespondentInfo {
  company: string;
  name: string;
  role: string;
  level: RespondentLevel | "";
  tenure: string;
  sector: string;
  size: string;
  date: string;
}

export interface DiagnosticResponse {
  id: string;
  version: 1;
  info: RespondentInfo;
  answers: Answers;
  createdAt: string;
  completedAt?: string;
}
