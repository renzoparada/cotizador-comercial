import type { NextRequest } from "next/server";
import { parseUserAgent } from "@/lib/utils";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
}

export function getRequestMeta(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "";
  const { device, browser } = parseUserAgent(userAgent);
  return { ip, userAgent, device, browser };
}
