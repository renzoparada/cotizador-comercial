"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { ROLE_LABEL } from "@/lib/role-labels";
import type { UserRole } from "@/lib/types";

export function InviteUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("vendedor");
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo invitar al usuario.");
        return;
      }
      toast.success("Invitación enviada.");
      setEmail("");
      setFullName("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Invitar usuario
        </CardTitle>
        <CardDescription>Envía una invitación por correo para que un vendedor o instructor acceda al panel.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInvite} className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
          <div className="sm:col-span-2">
            <Label htmlFor="invite-email">Correo</Label>
            <Input id="invite-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="invite-name">Nombre</Label>
            <Input id="invite-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="invite-role">Rol</Label>
            <Select id="invite-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {Object.entries(ROLE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" loading={loading} className="sm:col-span-4">
            Enviar invitación
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
