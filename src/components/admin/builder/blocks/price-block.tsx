"use client";

import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface PriceData {
  mostrar_precio: boolean;
  precio_normal: number | null;
  precio_promocional: number | null;
  moneda: string;
  validez_oferta: string | null;
  notas_precio: string | null;
}

export function PriceBlockEditor({ value, onChange }: { value: PriceData; onChange: (v: PriceData) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-3">
        <div>
          <Label className="mb-0">Mostrar precio en la propuesta</Label>
          <p className="text-xs text-muted">Si lo desactivas, la sección de precio no aparecerá en la landing.</p>
        </div>
        <Switch checked={value.mostrar_precio} onCheckedChange={(mostrar_precio) => onChange({ ...value, mostrar_precio })} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label>Precio normal</Label>
          <Input
            type="number"
            min={0}
            value={value.precio_normal ?? ""}
            onChange={(e) => onChange({ ...value, precio_normal: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
        <div>
          <Label>Precio promocional</Label>
          <Input
            type="number"
            min={0}
            value={value.precio_promocional ?? ""}
            onChange={(e) => onChange({ ...value, precio_promocional: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
        <div>
          <Label>Moneda</Label>
          <Select value={value.moneda} onChange={(e) => onChange({ ...value, moneda: e.target.value })}>
            {["USD", "COP", "MXN", "PEN", "CLP", "ARS", "EUR"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label>Validez de la oferta</Label>
        <Input
          value={value.validez_oferta ?? ""}
          onChange={(e) => onChange({ ...value, validez_oferta: e.target.value || null })}
          placeholder="Ej. Válido hasta el 30 de agosto de 2026"
        />
      </div>

      <div>
        <Label>Notas</Label>
        <Textarea
          rows={2}
          value={value.notas_precio ?? ""}
          onChange={(e) => onChange({ ...value, notas_precio: e.target.value || null })}
          placeholder="Ej. Precio + IVA. No incluye transporte ni viáticos."
        />
      </div>
    </div>
  );
}
