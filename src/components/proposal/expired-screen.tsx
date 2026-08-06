import { AlertCircle } from "lucide-react";
import type { HeaderBlock } from "@/lib/types";

export function ExpiredScreen({ header }: { header: HeaderBlock }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      {header.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={header.logoUrl} alt="Logo" className="mb-10 h-20 object-contain sm:h-24" />
      )}

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Cotización vencida</h1>
      <p className="mt-3 max-w-md text-base text-muted">Contáctese nuevamente para solicitar una propuesta actualizada.</p>

      {(header.firmaUrl || header.firmaTexto) && (
        <div className="mt-14 flex flex-col items-center gap-2">
          {header.firmaUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={header.firmaUrl} alt="Firma" className="h-16 object-contain" />
          )}
          {header.firmaTexto && <p className="text-sm font-medium text-foreground/80">{header.firmaTexto}</p>}
        </div>
      )}
    </div>
  );
}
