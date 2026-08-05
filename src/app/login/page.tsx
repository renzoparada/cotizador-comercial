import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold text-lg">
            P
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Propuestas</h1>
          <p className="mt-1 text-sm text-muted">Panel administrativo de cotizaciones comerciales</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface/80 glass p-6 card-shadow">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Acceso exclusivo para administradores, vendedores e instructores.
        </p>
      </div>
    </div>
  );
}
