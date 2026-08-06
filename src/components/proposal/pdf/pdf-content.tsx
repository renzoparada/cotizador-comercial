import { getBenefitIcon } from "@/lib/benefit-icons";
import { formatCurrency } from "@/lib/utils";
import type { Proposal } from "@/lib/types";

/**
 * Versión estática (sin animaciones) de la propuesta, pensada para capturarse
 * como imagen y convertirse en PDF. El video se reemplaza por un QR ("Ver Video")
 * y no incluye el botón de aceptar — no tiene sentido en un documento descargado.
 */
export function PdfProposalContent({ proposal, qrDataUrl }: { proposal: Proposal; qrDataUrl: string | null }) {
  const { content } = proposal;
  const { header } = content;
  const precio = proposal.precio_promocional ?? proposal.precio_normal;
  const hasPromo =
    proposal.precio_promocional != null && proposal.precio_normal != null && proposal.precio_promocional < proposal.precio_normal;

  return (
    <div style={{ width: 800, background: "#ffffff", color: "#1d1d1f", fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* Encabezado */}
      <div style={{ background: "#0b0b0d", color: "#ffffff", padding: "56px 48px", textAlign: "center" }}>
        {header.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.logoUrl} alt="Logo" crossOrigin="anonymous" style={{ height: 64, margin: "0 auto 24px", display: "block" }} />
        )}
        <h1 style={{ fontSize: 34, fontWeight: 700, margin: 0 }}>{header.title || proposal.titulo}</h1>
        {header.subtitle && <p style={{ fontSize: 16, color: "#c7c7cc", marginTop: 14 }}>{header.subtitle}</p>}
        {header.trainerName && (
          <p style={{ fontSize: 13, color: "#98989d", marginTop: 20 }}>Presentado por {header.trainerName}</p>
        )}
      </div>

      {/* Video -> QR */}
      {content.video.enabled && content.video.url && qrDataUrl && (
        <PdfSection title="Video">
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Código QR" style={{ width: 160, height: 160, margin: "0 auto" }} />
            <p style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "#3b5bfd" }}>Ver Video</p>
            <p style={{ fontSize: 11, color: "#6e6e73" }}>Escanea el código con tu celular</p>
          </div>
        </PdfSection>
      )}

      {/* Descripción */}
      {content.description.html && content.description.html !== "<p></p>" && (
        <PdfSection title="Descripción">
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#3a3a3c" }} dangerouslySetInnerHTML={{ __html: content.description.html }} />
        </PdfSection>
      )}

      {/* Objetivos */}
      {content.objectives.length > 0 && (
        <PdfSection title="Objetivos">
          {content.objectives.map((o, i) => (
            <PdfListRow key={o.id} index={i + 1} text={o.text} />
          ))}
        </PdfSection>
      )}

      {/* Beneficios */}
      {content.benefits.length > 0 && (
        <PdfSection title="Beneficios">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {content.benefits.map((b) => {
              const Icon = getBenefitIcon(b.icon);
              return (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e5ea", borderRadius: 10, padding: "10px 12px" }}>
                  <Icon size={16} color="#3b5bfd" />
                  <span style={{ fontSize: 12.5 }}>{b.text}</span>
                </div>
              );
            })}
          </div>
        </PdfSection>
      )}

      {/* Temario */}
      {content.agenda.length > 0 && (
        <PdfSection title="Temario">
          {content.agenda.map((m, i) => (
            <div key={m.id} style={{ border: "1px solid #e5e5ea", borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>
                {i + 1}. {m.titulo}
              </p>
              {m.descripcion && <p style={{ fontSize: 12, color: "#6e6e73", marginTop: 4 }}>{m.descripcion}</p>}
              {m.temas.length > 0 && (
                <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12 }}>
                  {m.temas.map((t, ti) => (
                    <li key={ti}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </PdfSection>
      )}

      {/* Metodología y duración */}
      {(content.methodology.items.length > 0 || content.duration.horas) && (
        <PdfSection title="Metodología y duración">
          {content.duration.horas && (
            <p style={{ fontSize: 13, marginBottom: 10 }}>
              <strong>{content.duration.horas}</strong> · {content.duration.modalidad}
            </p>
          )}
          {content.methodology.items.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {content.methodology.items.map((m, i) => (
                <span key={i} style={{ fontSize: 11.5, background: "#f0f2ff", color: "#3b5bfd", borderRadius: 999, padding: "5px 12px" }}>
                  {m}
                </span>
              ))}
            </div>
          )}
        </PdfSection>
      )}

      {/* Incluye */}
      {content.includes.length > 0 && (
        <PdfSection title="Qué incluye">
          {content.includes.map((it) => (
            <PdfListRow key={it.id} text={it.text} />
          ))}
        </PdfSection>
      )}

      {/* Bonus */}
      {content.bonus.length > 0 && (
        <PdfSection title="Bonus">
          {content.bonus.map((it) => (
            <PdfListRow key={it.id} text={it.text} tone="gold" />
          ))}
        </PdfSection>
      )}

      {/* Facilitador */}
      {(content.facilitator.bio || content.facilitator.experiencia || content.facilitator.photoUrl) && (
        <PdfSection title="Perfil del facilitador">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {content.facilitator.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.facilitator.photoUrl}
                alt=""
                crossOrigin="anonymous"
                style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover" }}
              />
            )}
            <div>
              {header.trainerName && <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{header.trainerName}</p>}
              {content.facilitator.bio && <p style={{ fontSize: 12, color: "#6e6e73", marginTop: 6 }}>{content.facilitator.bio}</p>}
              {content.facilitator.experiencia && <p style={{ fontSize: 12, marginTop: 6 }}>{content.facilitator.experiencia}</p>}
              {content.facilitator.certificaciones.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {content.facilitator.certificaciones.map((c, i) => (
                    <span
                      key={i}
                      style={{ fontSize: 11, background: "#fbf3e0", color: "#b8860b", borderRadius: 999, padding: "5px 12px" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PdfSection>
      )}

      {/* Testimonios */}
      {content.testimonials.length > 0 && (
        <PdfSection title="Testimonios">
          {content.testimonials.map((t) => (
            <div key={t.id} style={{ border: "1px solid #e5e5ea", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <p style={{ fontSize: 12.5, fontStyle: "italic", margin: 0 }}>&ldquo;{t.comentario}&rdquo;</p>
              <p style={{ fontSize: 11, color: "#6e6e73", marginTop: 6 }}>
                {t.nombre} — {t.empresa}
              </p>
            </div>
          ))}
        </PdfSection>
      )}

      {/* Empresas que confían en nosotros */}
      {content.clientLogos.length > 0 && (
        <PdfSection title="Empresas que confían en nosotros">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 24 }}>
            {content.clientLogos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={logo.id}
                src={logo.url}
                alt={logo.nombre || ""}
                crossOrigin="anonymous"
                style={{ maxHeight: 36, maxWidth: 110, objectFit: "contain" }}
              />
            ))}
          </div>
        </PdfSection>
      )}

      {/* Galería (solo fotos — los videos ya están cubiertos por el QR de arriba) */}
      {content.gallery.some((g) => g.type === "photo") && (
        <PdfSection title="Galería">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {content.gallery
              .filter((g) => g.type === "photo")
              .map((g) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={g.id}
                  src={g.url}
                  alt=""
                  crossOrigin="anonymous"
                  style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 8 }}
                />
              ))}
          </div>
        </PdfSection>
      )}

      {/* Precio */}
      {proposal.mostrar_precio && precio != null && (
        <PdfSection title="Inversión">
          <div style={{ textAlign: "center", border: "1px solid #e6c675", borderRadius: 12, padding: 20 }}>
            {hasPromo && (
              <div style={{ position: "relative", display: "inline-block", height: 18, lineHeight: "18px" }}>
                <p style={{ fontSize: 13, lineHeight: "18px", color: "#98989d", margin: 0 }}>
                  {formatCurrency(proposal.precio_normal, proposal.moneda)}
                </p>
                {/* text-decoration: line-through no se posiciona bien al capturarse con html2canvas,
                    así que dibujamos la línea nosotros mismos. Usamos un "top" en píxeles (mitad exacta
                    de los 18px de alto) en vez de "50%": los porcentajes tampoco se calculan bien acá. */}
                <div style={{ position: "absolute", left: 0, right: 0, top: 9, height: 1, background: "#98989d" }} />
              </div>
            )}
            <p style={{ fontSize: 28, fontWeight: 700, margin: "4px 0" }}>{formatCurrency(precio, proposal.moneda)}</p>
            {proposal.validez_oferta && <p style={{ fontSize: 12.5, color: "#b8860b", fontWeight: 600 }}>{proposal.validez_oferta}</p>}
            {proposal.notas_precio && <p style={{ fontSize: 11, color: "#6e6e73", marginTop: 8 }}>{proposal.notas_precio}</p>}
          </div>
        </PdfSection>
      )}

      {/* Firma */}
      <div style={{ padding: "40px 48px 56px", textAlign: "center", borderTop: "1px solid #e5e5ea" }}>
        {header.firmaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            data-role="firma-img"
            src={header.firmaUrl}
            alt="Firma"
            crossOrigin="anonymous"
            style={{ height: 56, margin: "0 auto 8px", display: "block" }}
          />
        )}
        {header.firmaTexto && <p style={{ fontSize: 12.5, fontWeight: 600, margin: 0 }}>{header.firmaTexto}</p>}
        <p style={{ fontSize: 10.5, color: "#98989d", marginTop: 16 }}>Propuesta {proposal.numero}</p>
      </div>
    </div>
  );
}

function PdfSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "26px 48px", borderTop: "1px solid #f0f0f2" }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#3b5bfd", margin: "0 0 12px" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function PdfListRow({ text, index, tone = "primary" }: { text: string; index?: number; tone?: "primary" | "gold" }) {
  const color = tone === "gold" ? "#b8860b" : "#3b5bfd";
  const bg = tone === "gold" ? "#fbf3e0" : "#f0f2ff";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: bg, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
      {index ? (
        <span style={{ fontSize: 10.5, fontWeight: 700, color, width: 16 }}>{index}</span>
      ) : (
        <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
      )}
      <span style={{ fontSize: 12.5 }}>{text}</span>
    </div>
  );
}
