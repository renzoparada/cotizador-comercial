/** Notificación best-effort al administrador (webhook opcional). No lanza si falla. */
export async function notifyAdmin(event: string, payload: Record<string, unknown>) {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload, at: new Date().toISOString() }),
    });
  } catch {
    // Silencioso: la notificación es "best effort" y no debe romper el flujo del cliente.
  }
}
