"use client";

import { Results } from "@/components/diagnostic/results";
import type { DiagnosticResponse } from "@/lib/diagnostic/types";

export function ResponseReport({ response }: { response: DiagnosticResponse }) {
  return <Results response={response} shareable={false} navTop="top-16" />;
}
