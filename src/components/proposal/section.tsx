import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function ProposalSection({
  eyebrow,
  title,
  icon: Icon,
  children,
  className,
  contentClassName,
}: {
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-4xl px-6 py-14 sm:py-16", className)}>
      <Reveal>
        <div className="mb-8 text-center sm:mb-10">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          )}
          <div className="flex items-center justify-center gap-2.5">
            {Icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-[18px] w-[18px]" />
              </span>
            )}
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          </div>
        </div>
      </Reveal>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
