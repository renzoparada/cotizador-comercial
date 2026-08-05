"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ResultBox({ text, html }: { text?: string; html?: string }) {
  if (!text && !html) return null;
  return (
    <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
      <div className="mb-2 flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(text ?? html ?? "");
            toast.success("Copiado al portapapeles.");
          }}
        >
          <Copy className="h-3.5 w-3.5" /> Copiar
        </Button>
      </div>
      {html ? (
        <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="whitespace-pre-wrap text-sm">{text}</p>
      )}
    </div>
  );
}
