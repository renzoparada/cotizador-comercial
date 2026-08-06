import QRCode from "qrcode";

/** Genera un código QR como data URL (PNG) apuntando a la URL dada. Solo para uso en cliente. */
export async function generateQrDataUrl(url: string): Promise<string | null> {
  try {
    return await QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: { dark: "#1d1d1f", light: "#ffffff" },
    });
  } catch {
    return null;
  }
}
