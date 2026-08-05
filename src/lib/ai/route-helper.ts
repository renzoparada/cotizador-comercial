import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { AiNotConfiguredError } from "./client";

/** Envuelve un handler de IA: exige sesión activa y traduce errores conocidos a respuestas HTTP. */
export function withAiRoute(handler: (body: Record<string, unknown>, userId: string) => Promise<unknown>) {
  return async (request: Request) => {
    const session = await getCurrentProfile();
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // cuerpo vacío es válido para algunas acciones
    }

    try {
      const result = await handler(body, session.userId);
      return NextResponse.json({ result });
    } catch (err) {
      if (err instanceof AiNotConfiguredError) {
        return NextResponse.json({ error: err.message }, { status: 501 });
      }
      const message = err instanceof Error ? err.message : "Error inesperado generando contenido con IA.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
