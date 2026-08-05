"use client";

import { Input, Label, Textarea } from "@/components/ui/input";
import { ImageUpload } from "../image-upload";
import type { HeaderBlock } from "@/lib/types";

export function HeaderBlockEditor({ value, onChange }: { value: HeaderBlock; onChange: (v: HeaderBlock) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <ImageUpload label="Logo" value={value.logoUrl} onChange={(logoUrl) => onChange({ ...value, logoUrl })} />
        <ImageUpload
          label="Foto del entrenador"
          value={value.trainerPhotoUrl}
          onChange={(trainerPhotoUrl) => onChange({ ...value, trainerPhotoUrl })}
        />
      </div>
      <div>
        <Label htmlFor="trainerName">Nombre del entrenador</Label>
        <Input
          id="trainerName"
          value={value.trainerName}
          onChange={(e) => onChange({ ...value, trainerName: e.target.value })}
          placeholder="Ej. Renzo Parada"
        />
      </div>
      <div>
        <Label htmlFor="title">Título de la capacitación</Label>
        <Input
          id="title"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Ej. Liderazgo de Alto Impacto"
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Textarea
          id="subtitle"
          rows={2}
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          placeholder="Una frase que resuma el valor de la propuesta"
        />
      </div>
    </div>
  );
}
