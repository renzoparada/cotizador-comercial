import type { Proposal } from "@/lib/types";

/**
 * Una propuesta se considera vencida si:
 * - el admin la deshabilitó manualmente (habilitada = false), sin importar nada más, o
 * - pasó su fecha de vencimiento y todavía está en "enviada"/"vista" (no pisa una ya
 *   aceptada o rechazada).
 */
export function isProposalExpired(proposal: Pick<Proposal, "habilitada" | "vencimiento" | "estado">): boolean {
  if (!proposal.habilitada) return true;

  if (
    proposal.vencimiento &&
    new Date(proposal.vencimiento) < new Date() &&
    (proposal.estado === "enviada" || proposal.estado === "vista")
  ) {
    return true;
  }

  return false;
}
