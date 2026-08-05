import Papa from "papaparse";
// Nota: el paquete `xlsx` (SheetJS) tiene CVEs conocidos en sus rutas de *parseo* de archivos
// no publicados con parche en el registro de npm. Aquí solo lo usamos para *generar* archivos
// a partir de datos propios (json_to_sheet + writeFile) — nunca para leer archivos de terceros —
// por lo que esas vulnerabilidades no aplican a este uso.
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PROPOSAL_STATUS_LABEL, type ProposalWithClient } from "@/lib/types";

function toRows(proposals: ProposalWithClient[]) {
  return proposals.map((p) => ({
    Número: p.numero,
    Título: p.titulo,
    Empresa: p.client?.empresa ?? "",
    Contacto: p.client?.nombre_contacto ?? "",
    Correo: p.client?.email ?? "",
    Celular: p.client?.celular ?? "",
    Ciudad: p.client?.ciudad ?? "",
    Estado: PROPOSAL_STATUS_LABEL[p.estado],
    Monto: p.precio_promocional ?? p.precio_normal ?? 0,
    Moneda: p.moneda,
    Fecha: formatDate(p.fecha),
    Vistas: p.view_count,
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCsv(proposals: ProposalWithClient[], filename = "cotizaciones.csv") {
  const csv = Papa.unparse(toRows(proposals));
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
}

export function exportToExcel(proposals: ProposalWithClient[], filename = "cotizaciones.xlsx") {
  const ws = XLSX.utils.json_to_sheet(toRows(proposals));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cotizaciones");
  XLSX.writeFile(wb, filename);
}

export function exportToPdf(proposals: ProposalWithClient[], filename = "cotizaciones.pdf") {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Reporte de cotizaciones", 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generado el ${new Date().toLocaleDateString("es-CO")}`, 14, 22);

  const rows = toRows(proposals);
  autoTable(doc, {
    startY: 28,
    head: [Object.keys(rows[0] ?? {})],
    body: rows.map((r) => Object.values(r).map((v) => (typeof v === "number" ? formatCurrency(v) : String(v)))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 91, 253] },
  });

  doc.save(filename);
}
