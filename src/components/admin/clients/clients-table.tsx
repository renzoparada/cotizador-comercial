"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Building2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/admin/search-bar";
import { ClientFormModal } from "./client-form-modal";
import type { Client } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ClientsTable({ clients, currentUserId }: { clients: Client[]; currentUserId: string }) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SearchBar placeholder="Buscar por empresa, contacto, correo, ciudad…" />
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      {clients.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building2}
            title="Sin clientes todavía"
            description="Crea tu primer cliente para empezar a generar propuestas comerciales."
            action={
              <Button onClick={() => setShowNew(true)} size="sm">
                <Plus className="h-4 w-4" /> Nuevo cliente
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Empresa / Contacto</th>
                  <th className="px-5 py-3 font-medium">Ubicación</th>
                  <th className="px-5 py-3 font-medium">Correo</th>
                  <th className="px-5 py-3 font-medium">Celular</th>
                  <th className="px-5 py-3 font-medium">Creado</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/clientes/${c.id}`} className="flex items-center gap-3 group">
                        <Avatar name={c.empresa} size={34} />
                        <div className="min-w-0">
                          <p className="truncate font-medium group-hover:text-primary transition-colors">{c.empresa}</p>
                          <p className="truncate text-xs text-muted">
                            {c.nombre_contacto}
                            {c.cargo ? ` · ${c.cargo}` : ""}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {c.ciudad || c.pais ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {[c.ciudad, c.pais].filter(Boolean).join(", ")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted">{c.email || "—"}</td>
                    <td className="px-5 py-3 text-muted">{c.celular || "—"}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ClientFormModal open={showNew} onClose={() => setShowNew(false)} currentUserId={currentUserId} />
    </div>
  );
}
