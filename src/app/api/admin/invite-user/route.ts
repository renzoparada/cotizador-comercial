import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Configura SUPABASE_SERVICE_ROLE_KEY en el servidor para poder invitar usuarios." },
      { status: 501 },
    );
  }

  const { email, fullName, role } = (await request.json()) as {
    email?: string;
    fullName?: string;
    role?: UserRole;
  };

  if (!email?.trim()) {
    return NextResponse.json({ error: "El correo es obligatorio." }, { status: 400 });
  }

  const service = createServiceClient();
  const { data, error } = await service.auth.admin.inviteUserByEmail(email.trim(), {
    data: { full_name: fullName || email.split("@")[0], role: role ?? "vendedor" },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/login`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId: data.user?.id });
}
