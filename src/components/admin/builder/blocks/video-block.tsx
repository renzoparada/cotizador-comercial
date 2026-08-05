"use client";

import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { VideoBlock } from "@/lib/types";

export function VideoBlockEditor({ value, onChange }: { value: VideoBlock; onChange: (v: VideoBlock) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="mb-0">Mostrar video en la propuesta</Label>
        <Switch checked={value.enabled} onCheckedChange={(enabled) => onChange({ ...value, enabled })} />
      </div>
      {value.enabled && (
        <div>
          <Label htmlFor="videoUrl">Enlace de YouTube o Vimeo</Label>
          <Input
            id="videoUrl"
            value={value.url}
            onChange={(e) => onChange({ ...value, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </div>
      )}
    </div>
  );
}
