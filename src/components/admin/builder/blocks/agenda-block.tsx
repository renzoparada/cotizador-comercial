"use client";

import { Plus, Trash2, ChevronDown, GripVertical } from "lucide-react";
import { useState } from "react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditableList } from "../editable-list";
import { cn } from "@/lib/utils";
import type { AgendaModule } from "@/lib/types";

export function AgendaBlockEditor({ value, onChange }: { value: AgendaModule[]; onChange: (v: AgendaModule[]) => void }) {
  const [openId, setOpenId] = useState<string | null>(value[0]?.id ?? null);

  function addModule() {
    const mod: AgendaModule = {
      id: crypto.randomUUID(),
      titulo: `Módulo ${value.length + 1}`,
      descripcion: "",
      temas: [],
    };
    onChange([...value, mod]);
    setOpenId(mod.id);
  }

  function update(id: string, patch: Partial<AgendaModule>) {
    onChange(value.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function remove(id: string) {
    onChange(value.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-3">
      {value.map((mod, i) => (
        <div key={mod.id} className="overflow-hidden rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setOpenId(openId === mod.id ? null : mod.id)}
            className="flex w-full items-center gap-2 bg-surface-2 px-3.5 py-2.5 text-left"
          >
            <GripVertical className="h-4 w-4 text-muted" />
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
              {i + 1}
            </span>
            <span className="flex-1 truncate text-sm font-medium">{mod.titulo || "Módulo sin título"}</span>
            <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", openId === mod.id && "rotate-180")} />
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(mod.id);
              }}
              className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </span>
          </button>
          {openId === mod.id && (
            <div className="space-y-3 p-3.5">
              <div>
                <Label>Título del módulo</Label>
                <Input value={mod.titulo} onChange={(e) => update(mod.id, { titulo: e.target.value })} />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea rows={2} value={mod.descripcion} onChange={(e) => update(mod.id, { descripcion: e.target.value })} />
              </div>
              <div>
                <Label>Temas</Label>
                <EditableList items={mod.temas} onChange={(temas) => update(mod.id, { temas })} placeholder="Agregar tema…" />
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addModule} className="w-full">
        <Plus className="h-4 w-4" /> Agregar módulo
      </Button>
    </div>
  );
}
