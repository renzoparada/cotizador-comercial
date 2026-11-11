"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  Radar,
  X,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "vendedor", "instructor"] },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText, roles: ["admin", "vendedor", "instructor"] },
  { href: "/admin/clientes", label: "Clientes", icon: Users, roles: ["admin", "vendedor", "instructor"] },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3, roles: ["admin", "vendedor"] },
  { href: "/admin/asistente-ia", label: "Asistente IA", icon: Sparkles, roles: ["admin", "vendedor", "instructor"] },
  { href: "/admin/diagnosticos", label: "Diagnósticos 360°", icon: Radar, roles: ["admin", "vendedor", "instructor"] },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, roles: ["admin"] },
] as const;

export function Sidebar({
  role,
  mobileOpen,
  onCloseMobile,
}: {
  role: UserRole;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const items = NAV.filter((item) => (item.roles as readonly string[]).includes(role));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
          P
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Propuestas</p>
          <p className="text-[11px] text-muted leading-tight">Cotizador comercial</p>
        </div>
        <button
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-1.5 text-muted hover:bg-surface-2 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-xl border border-border bg-surface-2 p-3.5 text-xs text-muted">
          <p className="font-medium text-foreground">¿Necesitas ayuda?</p>
          <p className="mt-1">Crea tu primera propuesta desde “Cotizaciones → Nueva”.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface border-r border-border">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
