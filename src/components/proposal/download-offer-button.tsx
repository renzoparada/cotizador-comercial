"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfProposalContent } from "./pdf/pdf-content";
import { generateQrDataUrl } from "@/lib/pdf/qr";
import type { Proposal } from "@/lib/types";

function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  return Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  ).then(() => undefined);
}

export function DownloadOfferButton({ proposal, className }: { proposal: Proposal; className?: string }) {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (proposal.content.video.enabled && proposal.content.video.url) {
      generateQrDataUrl(proposal.content.video.url).then(setQrDataUrl);
    }
  }, [proposal.content.video.enabled, proposal.content.video.url]);

  async function handleDownload() {
    if (!hiddenRef.current) return;
    setLoading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

      await waitForImages(hiddenRef.current);

      const canvas = await html2canvas(hiddenRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: hiddenRef.current.scrollWidth,
      });

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Propuesta-${proposal.numero}.pdf`);
    } catch {
      toast.error("No se pudo generar el PDF. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="lg" className={className} onClick={handleDownload} loading={loading}>
        {!loading && <Download className="h-4 w-4" />}
        Descargar oferta
      </Button>

      {/* Contenido fuera de pantalla, usado solo para generar el PDF */}
      <div
        aria-hidden
        style={{ position: "fixed", top: 0, left: -10000, zIndex: -1, pointerEvents: "none" }}
      >
        <div ref={hiddenRef}>
          <PdfProposalContent proposal={proposal} qrDataUrl={qrDataUrl} />
        </div>
      </div>
    </>
  );
}
