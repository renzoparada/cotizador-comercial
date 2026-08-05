import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export default async function RootPage() {
  const session = await getCurrentProfile();
  redirect(session ? "/admin/dashboard" : "/login");
}
