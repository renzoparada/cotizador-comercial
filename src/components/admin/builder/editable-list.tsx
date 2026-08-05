"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Lista simple de strings con agregar/eliminar/reordenar (drag básico por índice). */
export function EditableList({
  items,
  onChange,
  placeholder = "Agregar elemento…",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const dragIndex = useState({ current: -1 })[0];

  function add() {
    if (!draft.trim()) return;
    onChange([...items, draft.trim()]);
    setDraft("");
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function update(i: number, text: string) {
    onChange(items.map((it, idx) => (idx === i ? text : it)));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    onChange(copy);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => (dragIndex.current = i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            move(dragIndex.current, i);
            dragIndex.current = -1;
          }}
          className="flex items-center gap-2"
        >
          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted" />
          <Input value={item} onChange={(e) => update(i, e.target.value)} />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" size="icon" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
