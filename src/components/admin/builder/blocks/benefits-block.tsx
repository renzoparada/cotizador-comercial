"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BENEFIT_ICON_NAMES, getBenefitIcon } from "@/lib/benefit-icons";
import { cn } from "@/lib/utils";
import type { BenefitItem } from "@/lib/types";

export function BenefitsBlockEditor({ value, onChange }: { value: BenefitItem[]; onChange: (v: BenefitItem[]) => void }) {
  const [draftText, setDraftText] = useState("");
  const [draftIcon, setDraftIcon] = useState("check");

  function add() {
    if (!draftText.trim()) return;
    onChange([...value, { id: crypto.randomUUID(), icon: draftIcon, text: draftText.trim() }]);
    setDraftText("");
  }

  function update(id: string, patch: Partial<BenefitItem>) {
    onChange(value.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function remove(id: string) {
    onChange(value.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-3">
      {value.map((b) => {
        return (
          <div key={b.id} className="flex items-center gap-2">
            <IconPicker value={b.icon} onChange={(icon) => update(b.id, { icon })} />
            <Input value={b.text} onChange={(e) => update(b.id, { text: e.target.value })} className="flex-1" />
            <button
              type="button"
              onClick={() => remove(b.id)}
              className="shrink-0 rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <div className="flex items-center gap-2">
        <IconPicker value={draftIcon} onChange={setDraftIcon} />
        <Input
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Agregar beneficio…"
          className="flex-1"
        />
        <Button type="button" variant="secondary" size="icon" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const Icon = getBenefitIcon(value);
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-primary hover:bg-surface-2 transition-colors cursor-pointer"
      >
        {/* eslint-disable-next-line react-hooks/static-components -- referencia estática desde BENEFIT_ICONS, no un componente nuevo por render */}
        <Icon className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-11 z-20 grid grid-cols-4 gap-1 rounded-xl border border-border bg-surface p-2 card-shadow">
            {BENEFIT_ICON_NAMES.map((name) => {
              const I = getBenefitIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
                    value === name ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-2",
                  )}
                >
                  <I className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
