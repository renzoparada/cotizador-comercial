"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "../image-upload";
import type { ClientLogo } from "@/lib/types";

export function ClientLogosBlockEditor({ value, onChange }: { value: ClientLogo[]; onChange: (v: ClientLogo[]) => void }) {
  function add(url: string | null) {
    if (!url) return;
    onChange([...value, { id: crypto.randomUUID(), url, nombre: "" }]);
  }
  function update(id: string, patch: Partial<ClientLogo>) {
    onChange(value.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function remove(id: string) {
    onChange(value.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((logo) => (
            <div key={logo.id} className="space-y-2 rounded-xl border border-border p-3">
              <div className="group relative flex h-16 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.url} alt={logo.nombre || ""} className="max-h-12 max-w-[85%] object-contain" />
                <button
                  type="button"
                  onClick={() => remove(logo.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <Input
                value={logo.nombre ?? ""}
                onChange={(e) => update(logo.id, { nombre: e.target.value })}
                placeholder="Nombre de la empresa (opcional)"
                className="text-xs"
              />
            </div>
          ))}
        </div>
      )}

      <ImageUpload value={null} onChange={add} label="Agregar logo de empresa" />
    </div>
  );
}
