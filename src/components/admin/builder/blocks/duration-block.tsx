"use client";

import { Input, Label, Select } from "@/components/ui/input";
import type { DurationBlock } from "@/lib/types";

const PRESETS = ["8 horas", "16 horas", "24 horas", "32 horas"];

export function DurationBlockEditor({ value, onChange }: { value: DurationBlock; onChange: (v: DurationBlock) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="horas">Duración</Label>
        <Input
          id="horas"
          list="duracion-presets"
          value={value.horas}
          onChange={(e) => onChange({ ...value, horas: e.target.value })}
          placeholder="Ej. 16 horas"
        />
        <datalist id="duracion-presets">
          {PRESETS.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </div>
      <div>
        <Label htmlFor="modalidad">Modalidad</Label>
        <Select
          id="modalidad"
          value={value.modalidad}
          onChange={(e) => onChange({ ...value, modalidad: e.target.value as DurationBlock["modalidad"] })}
        >
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Híbrida">Híbrida</option>
        </Select>
      </div>
    </div>
  );
}
