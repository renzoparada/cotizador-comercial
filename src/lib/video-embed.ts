/** Convierte una URL de YouTube o Vimeo en una URL de embed reproducible en un iframe. */
export function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/shorts/")) {
        const shortId = u.pathname.split("/")[2];
        return shortId ? `https://www.youtube.com/embed/${shortId}` : null;
      }
      return null;
    }

    if (u.hostname.includes("vimeo.com")) {
      if (u.hostname.includes("player.vimeo.com")) return url;
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}
