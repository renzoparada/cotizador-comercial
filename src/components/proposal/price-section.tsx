import { Tag } from "lucide-react";
import { ProposalSection } from "./section";
import { Reveal } from "./reveal";
import { formatCurrency } from "@/lib/utils";

export function PriceSection({
  mostrarPrecio,
  precioNormal,
  precioPromocional,
  moneda,
  validez,
  notas,
}: {
  mostrarPrecio: boolean;
  precioNormal: number | null;
  precioPromocional: number | null;
  moneda: string;
  validez: string | null;
  notas: string | null;
}) {
  if (!mostrarPrecio || (!precioNormal && !precioPromocional)) return null;

  const hasPromo = precioPromocional != null && precioNormal != null && precioPromocional < precioNormal;

  return (
    <ProposalSection title="Inversión" icon={Tag} eyebrow="Precio">
      <Reveal delay={0.1}>
        <div className="mx-auto max-w-md rounded-3xl border border-gold/25 bg-gradient-to-b from-gold/10 via-surface to-surface p-8 text-center card-shadow">
          {hasPromo && (
            <p className="text-base text-muted line-through decoration-danger/60">
              {formatCurrency(precioNormal, moneda)}
            </p>
          )}
          <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
            {formatCurrency(precioPromocional ?? precioNormal, moneda)}
          </p>
          {validez && <p className="mt-3 text-sm font-medium text-gold">{validez}</p>}
          {notas && <p className="mt-4 text-xs text-muted">{notas}</p>}
        </div>
      </Reveal>
    </ProposalSection>
  );
}
