import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
        <FileQuestion className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Página no encontrada</h1>
        <p className="mt-1 text-sm text-muted">El enlace que buscas no existe o ha expirado.</p>
      </div>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
