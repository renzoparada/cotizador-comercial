"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** Sube una imagen al bucket público `proposal-assets` y devuelve su URL pública. */
export function ImageUpload({
  value,
  onChange,
  aspect = "square",
  label,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  aspect?: "square" | "wide";
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen.");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("proposal-assets").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast.error("No se pudo subir la imagen: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("proposal-assets").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-[13px] font-medium text-muted">{label}</p>}
      <div
        className={cn(
          "group relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface-2 cursor-pointer",
          aspect === "square" ? "h-28 w-28" : "h-32 w-full",
        )}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted">
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">Subir imagen</span>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
