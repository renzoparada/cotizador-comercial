"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfProposalContent } from "./pdf/pdf-content";
import { generateQrDataUrl } from "@/lib/pdf/qr";
import { loadImageAsDataUrl } from "@/lib/pdf/load-image";
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

  const { firmaInvertirEnPdf } = proposal.content.header;

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

      // Si la firma es de color claro, la invertimos a oscuro justo antes de capturar,
      // reutilizando html2canvas (el mismo mecanismo que ya carga bien el resto de las
      // imágenes) en vez de leer los píxeles de la imagen original directamente, que
      // puede fallar por CORS con imágenes de otro origen (ej. Supabase Storage).
      if (firmaInvertirEnPdf) {
        const firmaImg = hiddenRef.current.querySelector('img[data-role="firma-img"]') as HTMLImageElement | null;
        if (firmaImg) {
          const firmaCanvas = await html2canvas(firmaImg, { scale: 2, useCORS: true, backgroundColor: null });
          const ctx = firmaCanvas.getContext("2d");
          if (ctx) {
            const imageData = ctx.getImageData(0, 0, firmaCanvas.width, firmaCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 255 - data[i];
              data[i + 1] = 255 - data[i + 1];
              data[i + 2] = 255 - data[i + 2];
            }
            ctx.putImageData(imageData, 0, 0);
            const invertedDataUrl = firmaCanvas.toDataURL("image/png");
            await new Promise<void>((resolve) => {
              firmaImg.addEventListener("load", () => resolve(), { once: true });
              firmaImg.addEventListener("error", () => resolve(), { once: true });
              firmaImg.src = invertedDataUrl;
            });
          }
        }
      }

      // Cada bloque (encabezado, cada sección, firma) es un hijo directo del contenedor
      // raíz. Los capturamos por separado y los vamos acomodando en páginas, de forma
      // que ninguna sección quede cortada a la mitad entre una página y la siguiente.
      const root = hiddenRef.current.firstElementChild as HTMLElement | null;
      const blocks = root ? (Array.from(root.children) as HTMLElement[]) : [];

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let cursorY = 0;
      let pageHasContent = false;

      for (const block of blocks) {
        const canvas = await html2canvas(block, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL("image/jpeg", 0.92);

        if (imgHeight > pageHeight) {
          // Bloque más alto que una página completa (ej. una galería larga): lo partimos.
          if (pageHasContent) {
            pdf.addPage();
          }
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
          cursorY = 0;
          pageHasContent = false; // el próximo bloque empieza en página nueva
          continue;
        }

        if (pageHasContent && cursorY + imgHeight > pageHeight) {
          pdf.addPage();
          cursorY = 0;
        }

        pdf.addImage(imgData, "JPEG", 0, cursorY, imgWidth, imgHeight);
        cursorY += imgHeight;
        pageHasContent = true;
      }

      // Logo en la esquina inferior derecha de cada página.
      const logoUrl = proposal.content.header.logoUrl;
      if (logoUrl) {
        const logo = await loadImageAsDataUrl(logoUrl);
        if (logo) {
          const margin = 24;
          const maxW = 60;
          const maxH = 26;
          let logoW = maxW;
          let logoH = (logo.height / logo.width) * logoW;
          if (logoH > maxH) {
            logoH = maxH;
            logoW = (logo.width / logo.height) * logoH;
          }
          const totalPages = pdf.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.addImage(logo.dataUrl, "PNG", pageWidth - margin - logoW, pageHeight - margin - logoH, logoW, logoH);
          }
        }
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
