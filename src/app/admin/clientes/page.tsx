import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { searchClients } from "@/lib/queries/clients";
import { PageHeader } from "@/components/admin/page-header";
import { ClientsTable } from "@/components/admin/clients/clients-table";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { userId } = await requireProfile();
  const supabase = await createClient();
  const clients = await searchClients(supabase, q ?? "");

  return (
    <div>
      <PageHeader title="Clientes" description="Administra las empresas y contactos de tu cartera." />
      <ClientsTable clients={clients} currentUserId={userId} />
    </div>
  );
}
