"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/admin/search-bar";
import { Select } from "@/components/ui/input";
import { PROPOSAL_STATUS_LABEL } from "@/lib/types";

export function ProposalsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchBar placeholder="Buscar por empresa, contacto, correo, número…" />
      <Select
        className="w-auto"
        value={searchParams.get("estado") ?? ""}
        onChange={(e) => setParam("estado", e.target.value)}
      >
        <option value="">Todos los estados</option>
        {Object.entries(PROPOSAL_STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <input
        type="date"
        value={searchParams.get("from") ?? ""}
        onChange={(e) => setParam("from", e.target.value)}
        className="h-10 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <span className="text-xs text-muted">a</span>
      <input
        type="date"
        value={searchParams.get("to") ?? ""}
        onChange={(e) => setParam("to", e.target.value)}
        className="h-10 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
