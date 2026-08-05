import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { UsersTable } from "@/components/admin/settings/users-table";
import { InviteUserForm } from "@/components/admin/settings/invite-user-form";
import type { Profile } from "@/lib/types";

export default async function ConfiguracionPage() {
  const { profile, userId } = await requireProfile();
  if (profile.role !== "admin") redirect("/admin/dashboard");

  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });

  return (
    <div>
      <PageHeader title="Configuración" description="Administra los usuarios que tienen acceso al panel." />
      <div className="space-y-6">
        <InviteUserForm />
        <UsersTable profiles={(data ?? []) as Profile[]} currentUserId={userId} />
      </div>
    </div>
  );
}
