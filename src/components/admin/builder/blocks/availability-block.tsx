"use client";

import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";

export interface AvailabilityData {
  habilitada: boolean;
  vencimiento: string | null; // yyyy-mm-dd
}

export function AvailabilityBlockEditor({ value, onChange }: { value: AvailabilityData; onChange: (v: AvailabilityData) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-3">
        <div>
          <Label className="mb-0">Cotización habilitada</Label>
          <p className="text-xs text-muted">
            Si la deshabilitas, el enlace público deja de mostrar la propuesta de inmediato y en su lugar aparece un
            aviso de &ldquo;cotización vencida&rdquo; con tu logo y firma.
          </p>
        </div>
        <Switch checked={value.habilitada} onCheckedChange={(habilitada) => onChange({ ...value, habilitada })} />
      </div>

      <div>
        <Label htmlFor="vencimiento">Fecha de vencimiento (opcional)</Label>
        <Input
          id="vencimiento"
          type="date"
          value={value.vencimiento ?? ""}
          onChange={(e) => onChange({ ...value, vencimiento: e.target.value || null })}
        />
        <p className="mt-1.5 text-xs text-muted">
          Al llegar esta fecha, la propuesta se deshabilita automáticamente (sin que tengas que hacerlo a mano).
        </p>
      </div>

      {!value.habilitada && (
        <div className="flex items-start gap-2 rounded-xl border border-warning/25 bg-warning/10 p-3 text-xs text-warning">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Esta propuesta está deshabilitada ahora mismo. Nadie con el enlace puede verla — solo el aviso de vencida.
        </div>
      )}
    </div>
  );
}
