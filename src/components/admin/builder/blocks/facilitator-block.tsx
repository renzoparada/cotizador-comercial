"use client";

import { Label, Textarea } from "@/components/ui/input";
import { ImageUpload } from "../image-upload";
import { EditableList } from "../editable-list";
import type { FacilitatorBlock } from "@/lib/types";

export function FacilitatorBlockEditor({ value, onChange }: { value: FacilitatorBlock; onChange: (v: FacilitatorBlock) => void }) {
  return (
    <div className="space-y-4">
      <ImageUpload label="Fotografía" value={value.photoUrl} onChange={(photoUrl) => onChange({ ...value, photoUrl })} />
      <div>
        <Label>Biografía</Label>
        <Textarea rows={3} value={value.bio} onChange={(e) => onChange({ ...value, bio: e.target.value })} />
      </div>
      <div>
        <Label>Experiencia</Label>
        <Textarea rows={3} value={value.experiencia} onChange={(e) => onChange({ ...value, experiencia: e.target.value })} />
      </div>
      <div>
        <Label>Certificaciones</Label>
        <EditableList
          items={value.certificaciones}
          onChange={(certificaciones) => onChange({ ...value, certificaciones })}
          placeholder="Agregar certificación…"
        />
      </div>
    </div>
  );
}
