"use client";

import { useSyncExternalStore } from "react";
import type { DiagnosticResponse } from "./types";

const KEY = "diagnostico360.responses.v1";
const DRAFT_KEY = "diagnostico360.draft.v1";

let cache: DiagnosticResponse[] | null = null;
const listeners = new Set<() => void>();
const EMPTY: DiagnosticResponse[] = [];

function read(): DiagnosticResponse[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as DiagnosticResponse[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list: DiagnosticResponse[]) {
  cache = list;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // almacenamiento no disponible (modo privado): se mantiene en memoria
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSavedResponses() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function saveResponse(r: DiagnosticResponse) {
  const list = read().filter((x) => x.id !== r.id);
  write([r, ...list]);
}

export function saveMany(rs: DiagnosticResponse[]) {
  const ids = new Set(rs.map((r) => r.id));
  write([...rs, ...read().filter((x) => !ids.has(x.id))]);
}

export function deleteResponse(id: string) {
  write(read().filter((x) => x.id !== id));
}

/** El borrador se guarda por separado para cada campaña (scope = slug) y para el modo libre. */
const draftKey = (scope?: string) => (scope ? `${DRAFT_KEY}.${scope}` : DRAFT_KEY);

export function loadDraft(scope?: string): DiagnosticResponse | null {
  try {
    const raw = window.localStorage.getItem(draftKey(scope));
    return raw ? (JSON.parse(raw) as DiagnosticResponse) : null;
  } catch {
    return null;
  }
}

export function saveDraft(r: DiagnosticResponse | null, scope?: string) {
  try {
    if (r) window.localStorage.setItem(draftKey(scope), JSON.stringify(r));
    else window.localStorage.removeItem(draftKey(scope));
  } catch {
    // ignorar
  }
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ───────────── Enlaces para compartir respuestas (comprimidos en la URL) ─────────────

function toBase64Url(bytes: Uint8Array) {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeResponse(r: DiagnosticResponse): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(r));
  if (typeof CompressionStream !== "undefined") {
    return "z" + toBase64Url(await pipe(bytes, new CompressionStream("deflate-raw")));
  }
  return "j" + toBase64Url(bytes);
}

export async function decodeResponse(token: string): Promise<DiagnosticResponse | null> {
  try {
    const kind = token[0];
    let bytes = fromBase64Url(token.slice(1));
    if (kind === "z") bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    return isResponse(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function isResponse(x: unknown): x is DiagnosticResponse {
  const r = x as DiagnosticResponse;
  return !!r && typeof r === "object" && typeof r.id === "string" && !!r.info && !!r.answers;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slugify(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "diagnostico"
  );
}
