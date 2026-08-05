"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../image-upload";
import type { Testimonial } from "@/lib/types";

export function TestimonialsBlockEditor({ value, onChange }: { value: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  function add() {
    onChange([...value, { id: crypto.randomUUID(), photoUrl: null, nombre: "", empresa: "", comentario: "" }]);
  }
  function update(id: string, patch: Partial<Testimonial>) {
    onChange(value.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function remove(id: string) {
    onChange(value.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      {value.map((t) => (
        <div key={t.id} className="flex gap-3 rounded-xl border border-border p-3.5">
          <ImageUpload value={t.photoUrl} onChange={(photoUrl) => update(t.id, { photoUrl })} />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Input placeholder="Nombre" value={t.nombre} onChange={(e) => update(t.id, { nombre: e.target.value })} />
              <Input placeholder="Empresa" value={t.empresa} onChange={(e) => update(t.id, { empresa: e.target.value })} />
            </div>
            <Textarea
              placeholder="Comentario del testimonio"
              rows={2}
              value={t.comentario}
              onChange={(e) => update(t.id, { comentario: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(t.id)}
            className="shrink-0 self-start rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add} className="w-full">
        <Plus className="h-4 w-4" /> Agregar testimonio
      </Button>
    </div>
  );
}
