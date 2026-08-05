"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { LogOut, ChevronDown } from "lucide-react";
import type { Profile } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/role-labels";

export function UserMenu({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 hover:bg-surface-2 transition-colors cursor-pointer"
      >
        <Avatar name={profile.full_name} src={profile.avatar_url} size={28} />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight">{profile.full_name}</p>
          <p className="text-[11px] text-muted leading-tight">{ROLE_LABEL[profile.role]}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-surface card-shadow z-20">
          <div className="border-b border-border px-3.5 py-3">
            <p className="text-sm font-medium truncate">{profile.full_name}</p>
            <p className="text-xs text-muted truncate">{profile.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
