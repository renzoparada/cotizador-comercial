"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContext {
  value: string;
  setValue: (v: string) => void;
}
const Ctx = React.createContext<TabsContext | null>(null);

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  children,
  className,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;
  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <Ctx.Provider value={{ value: current, setValue }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl bg-surface-2 p-1 border border-border", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("TabsTrigger debe usarse dentro de Tabs");
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
        active ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("TabsContent debe usarse dentro de Tabs");
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
