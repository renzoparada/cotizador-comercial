import type { DimensionId } from "./types";

export interface Tool {
  id: string;
  name: string;
  category: "Estrategia" | "Gobierno" | "Clientes" | "Comercial" | "Innovación" | "Personas" | "Procesos" | "Cambio";
  what: string;
  when: string;
}

export const TOOLS: Record<string, Tool> = {
  golden_circle: {
    id: "golden_circle",
    name: "Golden Circle (Por qué · Cómo · Qué)",
    category: "Estrategia",
    what: "Taller para redefinir el propósito de la empresa empezando por el «por qué» existe.",
    when: "Cuando la misión y los valores no guían decisiones o el equipo no sabe para qué trabaja.",
  },
  okr: {
    id: "okr",
    name: "OKR (Objetivos y Resultados Clave)",
    category: "Estrategia",
    what: "3–5 objetivos inspiradores por trimestre con resultados clave medibles, públicos y revisados cada semana.",
    when: "Para aterrizar la visión en metas medibles y alinear a todas las áreas.",
  },
  hoshin: {
    id: "hoshin",
    name: "Hoshin Kanri (despliegue de la estrategia)",
    category: "Estrategia",
    what: "Despliega pocos objetivos estratégicos en cascada hasta cada área (matriz X), con revisión mensual.",
    when: "Cuando cada área tiene su propia visión y hay que alinear esfuerzos.",
  },
  bsc: {
    id: "bsc",
    name: "Balanced Scorecard / Cuadro de mando",
    category: "Estrategia",
    what: "Tablero con indicadores en 4 perspectivas: clientes, procesos, aprendizaje y resultados.",
    when: "Cuando se gestiona «a ciegas», sin indicadores para decidir.",
  },
  foda: {
    id: "foda",
    name: "FODA cruzado (TOWS)",
    category: "Estrategia",
    what: "Cruza fortalezas y debilidades con oportunidades y amenazas para generar estrategias FO, DO, FA y DA.",
    when: "Para convertir este diagnóstico en opciones estratégicas concretas.",
  },
  pestel: {
    id: "pestel",
    name: "Análisis PESTEL + radar de tendencias",
    category: "Estrategia",
    what: "Revisión periódica de factores Políticos, Económicos, Sociales, Tecnológicos, Ecológicos y Legales.",
    when: "Cuando la empresa reacciona tarde a los cambios del entorno.",
  },
  porter: {
    id: "porter",
    name: "5 Fuerzas de Porter",
    category: "Comercial",
    what: "Analiza rivalidad, poder de clientes y proveedores, sustitutos y nuevos entrantes.",
    when: "Cuando la competencia y los precios presionan el negocio.",
  },
  oceano_azul: {
    id: "oceano_azul",
    name: "Estrategia Océano Azul (matriz ERIC)",
    category: "Comercial",
    what: "Eliminar, Reducir, Incrementar y Crear atributos para salir de la guerra de precios.",
    when: "Cuando competir por precio está erosionando el negocio.",
  },
  bmc: {
    id: "bmc",
    name: "Business Model Canvas",
    category: "Innovación",
    what: "Mapa de 9 bloques para revisar y rediseñar cómo la empresa crea, entrega y captura valor.",
    when: "Cuando el modelo de negocio no se renueva hace años.",
  },
  vpc: {
    id: "vpc",
    name: "Value Proposition Canvas",
    category: "Clientes",
    what: "Contrasta tareas, dolores y alegrías del cliente con lo que la empresa ofrece.",
    when: "Cuando no está claro por qué los clientes eligen a la empresa.",
  },
  jtbd: {
    id: "jtbd",
    name: "Jobs To Be Done (entrevistas a clientes)",
    category: "Clientes",
    what: "Entrevistas para descubrir el «trabajo» que el cliente realmente contrata al comprar.",
    when: "Cuando cambian las necesidades de los clientes y se pierde relevancia.",
  },
  nps: {
    id: "nps",
    name: "NPS y circuito de voz del cliente",
    category: "Clientes",
    what: "Pregunta «¿nos recomendaría?» (0–10) + seguimiento de detractores y mejora continua.",
    when: "Cuando no se mide la satisfacción ni la lealtad del cliente.",
  },
  journey: {
    id: "journey",
    name: "Customer Journey Map",
    category: "Clientes",
    what: "Dibuja la experiencia completa del cliente para detectar puntos de fricción y momentos clave.",
    when: "Para mejorar la experiencia y la retención de clientes.",
  },
  crm_funnel: {
    id: "crm_funnel",
    name: "Embudo comercial + CRM",
    category: "Comercial",
    what: "Etapas de venta definidas, metas de actividad, pipeline visible y seguimiento en un CRM.",
    when: "Cuando cada vendedor trabaja a su manera o las ventas dependen del dueño.",
  },
  icp: {
    id: "icp",
    name: "Perfil de cliente ideal (ICP) y segmentación",
    category: "Comercial",
    what: "Define a qué clientes apuntar y con qué mensaje, para prospectar con foco.",
    when: "Cuando faltan nuevos clientes o la cartera está muy concentrada.",
  },
  raci: {
    id: "raci",
    name: "Matriz RACI",
    category: "Gobierno",
    what: "Define quién Responde, Aprueba, es Consultado e Informado en cada decisión o proceso.",
    when: "Cuando los roles se mezclan o hay duplicidad de funciones.",
  },
  gobierno: {
    id: "gobierno",
    name: "Gobierno corporativo (directorio + protocolo de accionistas)",
    category: "Gobierno",
    what: "Directorio con reglas, agenda y actas; protocolo familiar o pacto de accionistas que separa propiedad y gestión.",
    when: "Cuando los accionistas intervienen en la operación o no hay consenso entre ellos.",
  },
  delegacion: {
    id: "delegacion",
    name: "Tablero de delegación (Management 3.0)",
    category: "Gobierno",
    what: "Define 7 niveles de delegación por tipo de decisión: de «yo decido» a «tú decides».",
    when: "Cuando todo requiere autorización y los gerentes no tienen autonomía.",
  },
  sucesion: {
    id: "sucesion",
    name: "Plan de sucesión y continuidad",
    category: "Gobierno",
    what: "Identifica roles críticos, sucesores y documenta el conocimiento clave.",
    when: "Cuando la empresa depende de una o pocas personas.",
  },
  decision_cadence: {
    id: "decision_cadence",
    name: "Comité de decisiones con plazos (DACI)",
    category: "Gobierno",
    what: "Reunión semanal corta, decisiones con un responsable, fecha límite y criterio explícito.",
    when: "Cuando las decisiones se postergan o se pierden oportunidades.",
  },
  design_thinking: {
    id: "design_thinking",
    name: "Design Thinking",
    category: "Innovación",
    what: "Empatizar, definir, idear, prototipar y testear soluciones centradas en el cliente.",
    when: "Cuando falta innovación en productos o servicios.",
  },
  lean_startup: {
    id: "lean_startup",
    name: "Lean Startup (MVP y experimentos)",
    category: "Innovación",
    what: "Probar ideas con experimentos baratos y rápidos antes de invertir a gran escala.",
    when: "Antes de diversificar o lanzar nuevos negocios.",
  },
  madurez_digital: {
    id: "madurez_digital",
    name: "Hoja de ruta de transformación digital",
    category: "Innovación",
    what: "Evalúa la madurez digital, prioriza procesos a digitalizar e integra sistemas (ERP/CRM).",
    when: "Cuando predominan procesos manuales o los sistemas no están integrados.",
  },
  ia: {
    id: "ia",
    name: "Pilotos de IA y automatización",
    category: "Innovación",
    what: "Identificar 3 tareas repetitivas y automatizarlas con IA en 30 días, midiendo horas ahorradas.",
    when: "Para ganar productividad rápida y construir cultura digital.",
  },
  enps: {
    id: "enps",
    name: "eNPS y encuesta de clima",
    category: "Personas",
    what: "Medición trimestral del compromiso del equipo con acciones visibles sobre los resultados.",
    when: "Cuando hay desmotivación o incertidumbre en el equipo.",
  },
  talento_9box: {
    id: "talento_9box",
    name: "Matriz 9-Box y plan de desarrollo",
    category: "Personas",
    what: "Mapea desempeño vs. potencial para decidir desarrollo, retención e incorporación de perfiles.",
    when: "Cuando faltan competencias o liderazgo para la siguiente etapa.",
  },
  rituales: {
    id: "rituales",
    name: "Rituales de comunicación (town hall, 1:1, check-ins)",
    category: "Personas",
    what: "Ritmo fijo de comunicación de la estrategia, avances y decisiones, en ambos sentidos.",
    when: "Cuando la visión no llega a todos o hay silos.",
  },
  mckinsey7s: {
    id: "mckinsey7s",
    name: "Modelo 7S de McKinsey",
    category: "Personas",
    what: "Revisa la coherencia entre estrategia, estructura, sistemas, valores, estilo, personal y habilidades.",
    when: "Cuando hay desalineación entre lo que se quiere y cómo está organizada la empresa.",
  },
  lean_vsm: {
    id: "lean_vsm",
    name: "Lean · Mapa de flujo de valor (VSM)",
    category: "Procesos",
    what: "Dibuja el flujo de un proceso de punta a punta para eliminar desperdicios y esperas.",
    when: "Cuando hay burocracia, reprocesos o problemas operativos.",
  },
  sipoc: {
    id: "sipoc",
    name: "SIPOC y documentación de procesos",
    category: "Procesos",
    what: "Define proveedores, entradas, proceso, salidas y clientes de cada proceso clave con su responsable.",
    when: "Cuando el conocimiento vive en la cabeza de las personas.",
  },
  kaizen: {
    id: "kaizen",
    name: "Kaizen (mejora continua)",
    category: "Procesos",
    what: "Pequeñas mejoras diarias propuestas por el propio equipo, con tablero visual.",
    when: "Para mejorar procesos y comprometer al equipo al mismo tiempo.",
  },
  ansoff: {
    id: "ansoff",
    name: "Matriz Ansoff",
    category: "Estrategia",
    what: "Elige la vía de crecimiento: penetración, desarrollo de mercados, de productos o diversificación.",
    when: "Para decidir con criterio hacia dónde crecer.",
  },
  horizontes: {
    id: "horizontes",
    name: "3 Horizontes de crecimiento",
    category: "Estrategia",
    what: "Balancea el portafolio: H1 defender el núcleo, H2 negocios emergentes, H3 opciones de futuro.",
    when: "Cuando se busca diversificar sin descuidar el negocio actual.",
  },
  kotter: {
    id: "kotter",
    name: "Modelo de cambio de Kotter (8 pasos)",
    category: "Cambio",
    what: "Crear urgencia, formar una coalición, comunicar la visión, lograr victorias tempranas y anclar el cambio.",
    when: "Cuando hay resistencia al cambio o zona de confort.",
  },
  adkar: {
    id: "adkar",
    name: "ADKAR (gestión del cambio en personas)",
    category: "Cambio",
    what: "Conciencia, Deseo, Conocimiento, Habilidad y Refuerzo: el cambio persona a persona.",
    when: "Para que las personas adopten nuevos procesos o tecnologías.",
  },
  fourdx: {
    id: "fourdx",
    name: "Las 4 Disciplinas de la Ejecución (4DX)",
    category: "Cambio",
    what: "Enfocarse en lo crucialmente importante, actuar sobre medidas predictivas, tablero visible y rendición de cuentas semanal.",
    when: "Cuando las iniciativas arrancan pero no se terminan.",
  },
  priorizacion: {
    id: "priorizacion",
    name: "Matriz impacto / esfuerzo",
    category: "Cambio",
    what: "Ordena iniciativas por impacto y esfuerzo para elegir pocas y terminarlas.",
    when: "Cuando hay demasiadas iniciativas o no hay prioridades claras.",
  },
};

export interface Pain {
  id: string;
  title: string;
  symptom: string;
  dimension: DimensionId;
  severity: 1 | 2 | 3;
  tools: string[];
}

const P: Pain[] = [
  { id: "sin_rumbo", title: "Falta de rumbo estratégico", symptom: "No hay una dirección definida: cada decisión responde a la urgencia del momento.", dimension: "vision", severity: 3, tools: ["golden_circle", "okr", "foda"] },
  { id: "desalineacion", title: "Desalineación entre áreas", symptom: "Cada área persigue su propia visión y los esfuerzos se neutralizan.", dimension: "vision", severity: 3, tools: ["hoshin", "okr", "mckinsey7s"] },
  { id: "comunicacion_estrategica", title: "La estrategia no baja a la organización", symptom: "La visión existe en la dirección, pero el equipo no la conoce ni la comparte.", dimension: "vision", severity: 2, tools: ["rituales", "okr"] },
  { id: "proposito_difuso", title: "Propósito y valores difusos", symptom: "La misión y los valores no guían las decisiones cotidianas.", dimension: "vision", severity: 2, tools: ["golden_circle"] },
  { id: "sin_prioridades", title: "Sin prioridades claras", symptom: "Todo es importante, por lo tanto nada lo es: se dispersan recursos y energía.", dimension: "vision", severity: 3, tools: ["priorizacion", "okr", "fourdx"] },
  { id: "sin_seguimiento", title: "Estrategia sin seguimiento", symptom: "Las metas no se traducen en objetivos medibles ni se revisan con frecuencia.", dimension: "vision", severity: 2, tools: ["okr", "bsc"] },
  { id: "sin_indicadores", title: "Gestión a ciegas (sin indicadores)", symptom: "Se decide por intuición: no hay datos para evaluar el desempeño.", dimension: "operaciones", severity: 2, tools: ["bsc", "madurez_digital"] },
  { id: "decisiones_lentas", title: "Decisiones lentas o postergadas", symptom: "Los procesos de decisión frenan a la empresa y generan costo de oportunidad.", dimension: "liderazgo", severity: 3, tools: ["decision_cadence", "delegacion", "raci"] },
  { id: "centralizacion", title: "Centralización excesiva", symptom: "Las decisiones se concentran en pocas personas, que se convierten en el cuello de botella.", dimension: "liderazgo", severity: 3, tools: ["delegacion", "raci", "gobierno"] },
  { id: "gobierno_difuso", title: "Gobierno corporativo difuso", symptom: "Se mezclan los roles de accionistas, dirección y gerencia.", dimension: "liderazgo", severity: 3, tools: ["gobierno", "raci"] },
  { id: "oportunidades_perdidas", title: "Oportunidades que se pierden", symptom: "Las oportunidades llegan, pero la empresa no decide a tiempo.", dimension: "liderazgo", severity: 3, tools: ["decision_cadence", "lean_startup"] },
  { id: "dependencia_clave", title: "Dependencia de personas clave", symptom: "La continuidad del negocio depende del dueño o de unas pocas personas.", dimension: "liderazgo", severity: 3, tools: ["sucesion", "delegacion", "sipoc"] },
  { id: "conflicto_accionistas", title: "Falta de consenso entre accionistas", symptom: "Los dueños no comparten una visión sobre el futuro del negocio.", dimension: "liderazgo", severity: 3, tools: ["gobierno", "golden_circle"] },
  { id: "propuesta_valor_debil", title: "Propuesta de valor poco diferenciada", symptom: "No está claro por qué los clientes eligen a la empresa, o la eligen solo por precio.", dimension: "clientes", severity: 3, tools: ["vpc", "jtbd", "oceano_azul"] },
  { id: "sin_voz_cliente", title: "No se escucha al cliente", symptom: "La empresa se entera de los problemas cuando el cliente ya se fue.", dimension: "clientes", severity: 2, tools: ["nps", "journey"] },
  { id: "concentracion_clientes", title: "Cartera de clientes concentrada", symptom: "Pocos clientes concentran el negocio: perder uno sería un golpe fuerte.", dimension: "clientes", severity: 3, tools: ["icp", "crm_funnel", "ansoff"] },
  { id: "cliente_cambiante", title: "Clientes que cambian más rápido que la empresa", symptom: "Las necesidades del cliente evolucionan y la oferta no las acompaña.", dimension: "clientes", severity: 2, tools: ["jtbd", "design_thinking", "journey"] },
  { id: "perdida_competitividad", title: "Pérdida de competitividad comercial", symptom: "La capacidad comercial se ha estancado o retrocede frente al mercado.", dimension: "comercial", severity: 3, tools: ["porter", "oceano_azul", "crm_funnel"] },
  { id: "guerra_precios", title: "Atrapada en la guerra de precios", symptom: "Se compite por precio porque no hay una diferenciación clara.", dimension: "comercial", severity: 2, tools: ["oceano_azul", "porter", "vpc"] },
  { id: "falta_clientes", title: "Escasez de nuevos clientes", symptom: "No hay un motor de prospección que genere nuevos clientes de forma constante.", dimension: "comercial", severity: 2, tools: ["icp", "crm_funnel"] },
  { id: "estrategia_comercial", title: "Proceso comercial informal", symptom: "Las ventas dependen del talento individual o del dueño, no de un sistema.", dimension: "comercial", severity: 2, tools: ["crm_funnel", "icp"] },
  { id: "equipo_comercial", title: "Gestión débil del equipo comercial", symptom: "Faltan metas, seguimiento y entrenamiento del equipo de ventas.", dimension: "comercial", severity: 2, tools: ["crm_funnel", "fourdx"] },
  { id: "falta_metodologia", title: "Sin método para detectar oportunidades", symptom: "Las oportunidades se descubren por casualidad, no por un proceso.", dimension: "comercial", severity: 2, tools: ["pestel", "jtbd", "lean_startup"] },
  { id: "falta_innovacion", title: "Portafolio sin renovación", symptom: "Los productos y servicios no evolucionan al ritmo del mercado.", dimension: "innovacion", severity: 2, tools: ["design_thinking", "lean_startup", "bmc"] },
  { id: "estancamiento", title: "Modelo de negocio estancado", symptom: "Hace años que no hay una transformación relevante en el negocio.", dimension: "innovacion", severity: 3, tools: ["bmc", "horizontes", "design_thinking"] },
  { id: "resistencia_cambio", title: "Resistencia al cambio", symptom: "Las nuevas ideas generan rechazo o se descartan sin probarlas.", dimension: "innovacion", severity: 3, tools: ["kotter", "adkar", "lean_startup"] },
  { id: "brecha_digital", title: "Brecha digital", symptom: "Predominan procesos manuales y no hay una estrategia digital.", dimension: "innovacion", severity: 2, tools: ["madurez_digital", "ia"] },
  { id: "sistemas_aislados", title: "Sistemas no integrados", symptom: "Hay herramientas, pero la información está dispersa y se duplica.", dimension: "innovacion", severity: 1, tools: ["madurez_digital", "bsc"] },
  { id: "baja_autonomia", title: "Mandos medios sin autonomía", symptom: "Los gerentes necesitan autorización para todo y no se hacen cargo de resultados.", dimension: "talento", severity: 2, tools: ["delegacion", "raci", "okr"] },
  { id: "desmotivacion", title: "Desmotivación del equipo", symptom: "El compromiso es bajo y aumenta el riesgo de rotación.", dimension: "talento", severity: 3, tools: ["enps", "rituales", "golden_circle"] },
  { id: "silos", title: "Silos y comunicación deficiente", symptom: "La información no fluye entre áreas ni entre la dirección y los equipos.", dimension: "talento", severity: 2, tools: ["rituales", "raci", "mckinsey7s"] },
  { id: "brecha_talento", title: "Brecha de talento y liderazgo", symptom: "Faltan las competencias o el liderazgo para la siguiente etapa.", dimension: "talento", severity: 2, tools: ["talento_9box", "sucesion"] },
  { id: "burocracia", title: "Burocracia y exceso de procedimientos", symptom: "Los procesos agregan pasos y aprobaciones que no generan valor.", dimension: "operaciones", severity: 2, tools: ["lean_vsm", "kaizen"] },
  { id: "descoordinacion", title: "Descoordinación operativa", symptom: "Duplicidad de funciones y problemas operativos que afectan resultados.", dimension: "operaciones", severity: 3, tools: ["sipoc", "raci", "lean_vsm"] },
  { id: "conocimiento_tacito", title: "Conocimiento no documentado", symptom: "El saber clave vive en la cabeza de las personas y se pierde con ellas.", dimension: "operaciones", severity: 2, tools: ["sipoc", "sucesion"] },
  { id: "recursos_subutilizados", title: "Recursos y capacidades subutilizados", symptom: "Infraestructura, experiencia o inversiones que no rinden todo su potencial.", dimension: "operaciones", severity: 1, tools: ["ansoff", "horizontes", "lean_vsm"] },
  { id: "huida_hacia_adelante", title: "Diversificar para escapar", symptom: "Se busca un negocio nuevo para huir de los problemas del actual, sin resolverlos.", dimension: "diversificacion", severity: 2, tools: ["horizontes", "lean_startup", "foda"] },
  { id: "zona_confort", title: "Zona de confort / falta de urgencia", symptom: "No se percibe la necesidad de cambiar, aunque el entorno sí cambia.", dimension: "futuro", severity: 2, tools: ["kotter", "pestel"] },
  { id: "ejecucion_debil", title: "Brecha de ejecución", symptom: "Se identifican oportunidades y se lanzan iniciativas, pero no se terminan.", dimension: "futuro", severity: 3, tools: ["fourdx", "priorizacion", "okr"] },
  { id: "miopia_entorno", title: "Miopía del entorno", symptom: "La empresa reacciona tarde a los cambios tecnológicos, regulatorios y del mercado.", dimension: "futuro", severity: 2, tools: ["pestel", "horizontes"] },
];

export const PAINS = Object.fromEntries(P.map((p) => [p.id, p])) as Record<string, Pain>;

export interface MaturityLevel {
  id: number;
  name: string;
  min: number;
  color: string;
  description: string;
}

export const MATURITY_LEVELS: MaturityLevel[] = [
  { id: 1, name: "Crítico", min: 0, color: "var(--danger)", description: "La empresa opera en modo supervivencia: hay fallas de base que requieren intervención inmediata." },
  { id: 2, name: "Reactivo", min: 25, color: "#f97316", description: "Se gestiona apagando incendios. Existen intenciones, pero faltan sistemas, foco y disciplina." },
  { id: 3, name: "En desarrollo", min: 45, color: "var(--warning)", description: "Hay bases y prácticas, pero son irregulares. Es el momento de estructurar y alinear." },
  { id: 4, name: "Estructurado", min: 65, color: "var(--accent)", description: "La gestión es ordenada y medible. El desafío es acelerar la innovación y la ejecución." },
  { id: 5, name: "Alto desempeño", min: 82, color: "var(--success)", description: "Organización alineada, ágil y que aprende. El foco está en sostener y escalar." },
];

export function maturityFor(score: number): MaturityLevel {
  let level = MATURITY_LEVELS[0];
  for (const l of MATURITY_LEVELS) if (score >= l.min) level = l;
  return level;
}

/** Acciones de hoja de ruta por dimensión: rápidas (0–30 días), de estructura (30–90) y de transformación (3–12 meses). */
export const ROADMAP_ACTIONS: Record<DimensionId, { quick: string; build: string; transform: string }> = {
  vision: {
    quick: "Taller de 1 día con la dirección para acordar visión a 5 años y las 3 prioridades del año.",
    build: "Definir OKR trimestrales por área y comunicarlos a toda la organización.",
    transform: "Instalar un ciclo de planificación estratégica anual con revisión trimestral (Hoshin Kanri).",
  },
  liderazgo: {
    quick: "Crear un comité semanal de decisiones con responsables y plazos explícitos.",
    build: "Elaborar matriz RACI y tablero de delegación para las decisiones clave.",
    transform: "Formalizar el gobierno corporativo: directorio con reglas y pacto de accionistas.",
  },
  clientes: {
    quick: "Entrevistar a 10 clientes (5 fieles y 5 perdidos) para entender por qué nos eligen o nos dejan.",
    build: "Rediseñar la propuesta de valor con Value Proposition Canvas e implementar NPS.",
    transform: "Gestionar la experiencia del cliente de punta a punta (Customer Journey) con indicadores.",
  },
  comercial: {
    quick: "Definir el perfil de cliente ideal y revisar el pipeline de oportunidades abiertas.",
    build: "Implementar un embudo comercial con etapas, metas de actividad y un CRM.",
    transform: "Construir un motor comercial predecible: nuevos canales, segmentos y propuesta diferenciada.",
  },
  innovacion: {
    quick: "Elegir 3 tareas repetitivas y automatizarlas (IA o herramientas no-code) en 30 días.",
    build: "Hoja de ruta digital: integrar sistemas y crear un tablero de gestión con datos.",
    transform: "Instalar un sistema de innovación: cartera de experimentos, presupuesto y aprendizaje (Lean Startup).",
  },
  talento: {
    quick: "Aplicar una encuesta corta de clima (eNPS) y compartir los resultados con el equipo.",
    build: "Instalar rituales de comunicación (town hall mensual, 1:1) y planes de desarrollo.",
    transform: "Modelo de talento: matriz 9-Box, plan de sucesión y escuela de líderes.",
  },
  operaciones: {
    quick: "Mapear el proceso más problemático (VSM) e identificar 3 desperdicios a eliminar.",
    build: "Documentar los procesos clave (SIPOC) con responsables e indicadores.",
    transform: "Cultura de mejora continua (Kaizen) con tablero visual y revisión mensual.",
  },
  diversificacion: {
    quick: "Inventariar activos, capacidades y relaciones que podrían generar nuevos negocios.",
    build: "Evaluar opciones con la matriz Ansoff y validarlas con experimentos de bajo costo.",
    transform: "Gestionar un portafolio en 3 Horizontes con reglas de inversión para cada uno.",
  },
  futuro: {
    quick: "Priorizar con matriz impacto/esfuerzo y quedarse con máximo 3 iniciativas.",
    build: "Aplicar 4DX: medidas predictivas, tablero visible y reunión semanal de rendición de cuentas.",
    transform: "Programa de cambio (Kotter): coalición guía, victorias tempranas y anclaje cultural.",
  },
};
