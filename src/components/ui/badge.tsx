import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProposalStatus } from "@/lib/types";
import { PROPOSAL_STATUS_LABEL } from "@/lib/types";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "gold";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  gold: "bg-gold/10 text-gold border-gold/20",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

const STATUS_TONE: Record<ProposalStatus, Tone> = {
  borrador: "neutral",
  enviada: "primary",
  vista: "gold",
  aceptada: "success",
  rechazada: "danger",
  vencida: "warning",
};

export function StatusBadge({ status }: { status: ProposalStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{PROPOSAL_STATUS_LABEL[status]}</Badge>;
}
