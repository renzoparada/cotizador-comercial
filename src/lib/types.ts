// ============================================================================
// Tipos de dominio compartidos por toda la aplicación
// ============================================================================

export type UserRole = "admin" | "vendedor" | "instructor";

export type ProposalStatus =
  | "borrador"
  | "enviada"
  | "vista"
  | "aceptada"
  | "rechazada"
  | "vencida";

export const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  vista: "Vista",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  vencida: "Vencida",
};

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  empresa: string;
  nombre_contacto: string;
  cargo: string | null;
  celular: string | null;
  whatsapp: string | null;
  email: string | null;
  ciudad: string | null;
  pais: string | null;
  observaciones: string | null;
  owner_id: string | null;
  ultimo_contacto: string | null;
  proximo_seguimiento: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientNote {
  id: string;
  client_id: string;
  nota: string;
  created_by: string | null;
  created_at: string;
}

// ------------------------------ Bloques de la propuesta -------------------

export interface HeaderBlock {
  logoUrl: string | null;
  trainerName: string;
  trainerPhotoUrl: string | null;
  title: string;
  subtitle: string;
  firmaUrl: string | null;
  firmaTexto: string | null;
  /** La web puede estar en modo oscuro (firma clara se ve bien) pero el PDF siempre
   *  tiene fondo blanco. Si es true, la firma se invierte a oscura solo en el PDF. */
  firmaInvertirEnPdf: boolean;
}

export interface VideoBlock {
  enabled: boolean;
  url: string; // YouTube o Vimeo
}

export interface DescriptionBlock {
  html: string;
}

export interface ListItem {
  id: string;
  text: string;
}

export interface BenefitItem {
  id: string;
  icon: string; // nombre del icono lucide
  text: string;
}

export interface AgendaModule {
  id: string;
  titulo: string;
  descripcion: string;
  temas: string[];
}

export interface MethodologyBlock {
  items: string[]; // ej: Taller, Coaching, Dinámicas...
}

export interface DurationBlock {
  horas: string; // ej: "16 horas"
  modalidad: "Presencial" | "Virtual" | "Híbrida";
}

export interface FacilitatorBlock {
  photoUrl: string | null;
  bio: string;
  experiencia: string;
  certificaciones: string[];
}

export interface Testimonial {
  id: string;
  photoUrl: string | null;
  nombre: string;
  empresa: string;
  comentario: string;
}

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  url: string;
  caption?: string;
}

export interface ClientLogo {
  id: string;
  url: string;
  nombre?: string;
}

export interface ProposalContent {
  header: HeaderBlock;
  video: VideoBlock;
  description: DescriptionBlock;
  objectives: ListItem[];
  benefits: BenefitItem[];
  agenda: AgendaModule[];
  methodology: MethodologyBlock;
  duration: DurationBlock;
  includes: ListItem[];
  bonus: ListItem[];
  facilitator: FacilitatorBlock;
  testimonials: Testimonial[];
  clientLogos: ClientLogo[];
  gallery: GalleryItem[];
}

export const EMPTY_PROPOSAL_CONTENT: ProposalContent = {
  header: {
    logoUrl: null,
    trainerName: "",
    trainerPhotoUrl: null,
    title: "Nueva propuesta comercial",
    subtitle: "",
    firmaUrl: null,
    firmaTexto: "",
    firmaInvertirEnPdf: false,
  },
  video: { enabled: false, url: "" },
  description: { html: "" },
  objectives: [],
  benefits: [],
  agenda: [],
  methodology: { items: [] },
  duration: { horas: "16 horas", modalidad: "Presencial" },
  includes: [],
  bonus: [],
  facilitator: { photoUrl: null, bio: "", experiencia: "", certificaciones: [] },
  testimonials: [],
  clientLogos: [],
  gallery: [],
};

/**
 * Las cotizaciones guardadas antes de agregar un campo nuevo a ProposalContent no
 * lo tienen en su JSON en la base de datos (ej. clientLogos). Esta función rellena
 * cualquier campo de nivel superior que falte con su valor por defecto, para que
 * los componentes nunca reciban `undefined` donde esperan un arreglo/objeto.
 */
export function normalizeProposalContent(content: Partial<ProposalContent> | null | undefined): ProposalContent {
  return { ...EMPTY_PROPOSAL_CONTENT, ...content };
}

export interface Proposal {
  id: string;
  numero: string;
  slug: string;
  client_id: string | null;
  owner_id: string | null;
  estado: ProposalStatus;
  titulo: string;
  content: ProposalContent;
  precio_normal: number | null;
  precio_promocional: number | null;
  mostrar_precio: boolean;
  moneda: string;
  validez_oferta: string | null;
  notas_precio: string | null;
  fecha: string;
  sent_at: string | null;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
  accepted_at: string | null;
  rejected_at: string | null;
  vencimiento: string | null;
  habilitada: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProposalWithClient extends Proposal {
  client: Client | null;
}

export interface ProposalView {
  id: string;
  proposal_id: string;
  viewed_at: string;
  ip: string | null;
  user_agent: string | null;
  device: string | null;
  browser: string | null;
}

export interface ProposalEvent {
  id: string;
  proposal_id: string;
  tipo: string;
  ip: string | null;
  user_agent: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}
