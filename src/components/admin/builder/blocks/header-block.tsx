"use client";

import { Input, Label, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

      <div className="border-t border-border pt-4">
        <p className="mb-1 text-sm font-medium">Firma</p>
        <p className="mb-3 text-xs text-muted">
          Se usa al final de la propuesta y en la pantalla de &ldquo;cotización vencida&rdquo; cuando la deshabilites.
        </p>
        <div className="flex gap-4">
          <ImageUpload
            label="Imagen de firma (opcional)"
            value={value.firmaUrl}
            onChange={(firmaUrl) => onChange({ ...value, firmaUrl })}
          />
          <div className="flex-1">
            <Label htmlFor="firmaTexto">Texto de la firma</Label>
            <Input
              id="firmaTexto"
              value={value.firmaTexto ?? ""}
              onChange={(e) => onChange({ ...value, firmaTexto: e.target.value })}
              placeholder="Ej. Renzo Parada — Director"
            />
          </div>
        </div>

        {value.firmaUrl && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-3">
            <div>
              <Label className="mb-0">Mi firma es de color claro</Label>
              <p className="text-xs text-muted">
                El PDF descargable siempre tiene fondo blanco. Actívalo si tu firma es blanca/clara (como en el modo
                oscuro de la web) para que se invierta a oscuro solo en el PDF y no se pierda.
              </p>
            </div>
            <Switch
              checked={value.firmaInvertirEnPdf}
              onCheckedChange={(firmaInvertirEnPdf) => onChange({ ...value, firmaInvertirEnPdf })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
