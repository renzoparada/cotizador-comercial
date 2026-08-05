"use client";

import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCsv, exportToExcel, exportToPdf } from "@/lib/export";
import type { ProposalWithClient } from "@/lib/types";

export function ExportButtons({ proposals }: { proposals: ProposalWithClient[] }) {
  const disabled = proposals.length === 0;
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => exportToCsv(proposals)}>
        <FileDown className="h-3.5 w-3.5" /> CSV
      </Button>
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => exportToExcel(proposals)}>
        <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
      </Button>
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => exportToPdf(proposals)}>
        <FileText className="h-3.5 w-3.5" /> PDF
      </Button>
    </div>
  );
}
