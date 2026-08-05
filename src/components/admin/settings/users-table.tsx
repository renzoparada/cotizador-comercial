"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/role-labels";
import type { Profile, UserRole } from "@/lib/types";

export function UsersTable({ profiles, currentUserId }: { profiles: Profile[]; currentUserId: string }) {
  const router = useRouter();

  async function changeRole(id: string, role: UserRole) {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) {
      toast.error("No se pudo actualizar el rol: " + error.message);
      return;
    }
    toast.success("Rol actualizado.");
    router.refresh();
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Usuario</th>
              <th className="px-5 py-3 font-medium">Correo</th>
              <th className="px-5 py-3 font-medium">Rol</th>
              <th className="px-5 py-3 font-medium">Desde</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={p.full_name} src={p.avatar_url} size={30} />
                    <span className="font-medium">{p.full_name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted">{p.email}</td>
                <td className="px-5 py-3">
                  <Select
                    className="w-auto"
                    value={p.role}
                    disabled={p.id === currentUserId}
                    onChange={(e) => changeRole(p.id, e.target.value as UserRole)}
                  >
                    {Object.entries(ROLE_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-5 py-3 text-muted">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
