import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Locale usado para formatear cada moneda — determina el símbolo mostrado
// (ej. BOB necesita el locale de Bolivia para mostrar "Bs" en vez de "BOB").
const CURRENCY_LOCALE: Record<string, string> = {
  BOB: "es-BO",
  COP: "es-CO",
  MXN: "es-MX",
  PEN: "es-PE",
  CLP: "es-CL",
  ARS: "es-AR",
  EUR: "es-ES",
  USD: "es-CO",
};

export function formatCurrency(value: number | null | undefined, currency = "USD") {
  if (value === null || value === undefined) return "—";
  const locale = CURRENCY_LOCALE[currency] ?? "es-CO";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString(locale)}`;
  }
}

export function formatDate(date: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function formatDateTime(date: string | Date | null | undefined) {
  return formatDate(date, { hour: "2-digit", minute: "2-digit" });
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Genera un código corto tipo "ABX4829" para el enlace público de la propuesta. */
export function generateProposalCode(length = 7) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function parseUserAgent(ua: string | null | undefined) {
  if (!ua) return { device: "Desconocido", browser: "Desconocido" };
  const device = /mobile/i.test(ua) ? "Móvil" : /tablet|ipad/i.test(ua) ? "Tablet" : "Escritorio";
  let browser = "Desconocido";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";
  return { device, browser };
}
