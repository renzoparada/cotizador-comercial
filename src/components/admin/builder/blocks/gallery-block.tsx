"use client";

import { useState } from "react";
import { Plus, Trash2, ImageIcon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../image-upload";
import type { GalleryItem } from "@/lib/types";

export function GalleryBlockEditor({ value, onChange }: { value: GalleryItem[]; onChange: (v: GalleryItem[]) => void }) {
  const [videoUrl, setVideoUrl] = useState("");

  function addPhoto(url: string | null) {
    if (!url) return;
    onChange([...value, { id: crypto.randomUUID(), type: "photo", url }]);
  }
  function addVideo() {
    if (!videoUrl.trim()) return;
    onChange([...value, { id: crypto.randomUUID(), type: "video", url: videoUrl.trim() }]);
    setVideoUrl("");
  }
  function remove(id: string) {
    onChange(value.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((g) => (
            <div key={g.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-2">
              {g.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-muted">
                  <Video className="h-5 w-5" />
                  <span className="truncate text-[10px] w-full">{g.url}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(g.id)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <ImageUpload value={null} onChange={addPhoto} label="Agregar foto" />
        <div className="flex-1 min-w-[220px]">
          <p className="mb-1.5 text-[13px] font-medium text-muted">Agregar video (URL)</p>
          <div className="flex gap-2">
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" />
            <Button type="button" variant="secondary" size="icon" onClick={addVideo}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {value.length === 0 && (
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <ImageIcon className="h-3.5 w-3.5" /> Aún no hay elementos en la galería.
        </p>
      )}
    </div>
  );
}
