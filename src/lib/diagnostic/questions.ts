import type { Dimension, DimensionId, Question, RespondentLevel } from "./types";

export const DIMENSIONS: Dimension[] = [
  {
    id: "vision",
    name: "Visión y dirección estratégica",
    short: "Visión",
    description: "Claridad del rumbo, propósito, prioridades y cómo se traducen en objetivos medibles.",
    framework: "Golden Circle · OKR · Hoshin Kanri",
    weight: 1.3,
  },
  {
    id: "liderazgo",
    name: "Liderazgo y gobierno corporativo",
    short: "Liderazgo",
    description: "Cómo se decide, quién decide y qué tan separados están los roles de propiedad y gestión.",
    framework: "Gobierno corporativo · RACI · Matriz de delegación",
    weight: 1.2,
  },
  {
    id: "clientes",
    name: "Clientes y propuesta de valor",
    short: "Clientes",
    description: "Qué tan bien la empresa entiende a sus clientes, por qué la eligen y cómo mide su lealtad.",
    framework: "Value Proposition Canvas · Jobs To Be Done · NPS",
    weight: 1.1,
  },
  {
    id: "comercial",
    name: "Gestión comercial y mercado",
    short: "Comercial",
    description: "Capacidad de vender, abrir mercado, detectar y convertir oportunidades.",
    framework: "Embudo comercial · Porter · Océano Azul",
    weight: 1.1,
  },
  {
    id: "innovacion",
    name: "Innovación y transformación digital",
    short: "Innovación",
    description: "Ritmo de cambio, apertura a nuevas ideas, madurez digital y uso de datos e IA.",
    framework: "Design Thinking · Lean Startup · Madurez digital",
    weight: 1.0,
  },
  {
    id: "talento",
    name: "Organización, cultura y talento",
    short: "Talento",
    description: "Autonomía, compromiso, comunicación y capacidades del equipo para la siguiente etapa.",
    framework: "McKinsey 7S · eNPS · Management 3.0",
    weight: 1.1,
  },
  {
    id: "operaciones",
    name: "Gestión operativa y eficiencia",
    short: "Operaciones",
    description: "Procesos, coordinación, estandarización y aprovechamiento de los recursos disponibles.",
    framework: "Lean · Kaizen · SIPOC / BPM",
    weight: 1.0,
  },
  {
    id: "diversificacion",
    name: "Diversificación y nuevas oportunidades",
    short: "Diversificación",
    description: "Motivos y disposición para crecer hacia nuevos negocios, mercados o sectores.",
    framework: "Matriz Ansoff · 3 Horizontes de McKinsey",
    weight: 0.8,
  },
  {
    id: "futuro",
    name: "Futuro y capacidad de transformación",
    short: "Futuro",
    description: "Sentido de urgencia, capacidad de ejecución y lectura del entorno.",
    framework: "Kotter 8 pasos · ADKAR · PESTEL · 4DX",
    weight: 1.1,
  },
];

export const DIMENSION_BY_ID = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d])) as Record<DimensionId, Dimension>;

export const LEVELS: { id: RespondentLevel; label: string }[] = [
  { id: "accionista", label: "Accionista / Directorio" },
  { id: "gerencia_general", label: "Gerencia general / Dirección" },
  { id: "gerencia_area", label: "Gerencia de área / Mandos medios" },
  { id: "colaborador", label: "Colaborador / Equipo operativo" },
  { id: "externo", label: "Consultor / Asesor externo" },
];

export const SIZES = ["1–10 personas", "11–50 personas", "51–200 personas", "201–1000 personas", "Más de 1000 personas"];

const Q: Omit<Question, "number">[] = [
  // ───────────────────────── 1. VISIÓN ─────────────────────────
  {
    id: "q1",
    dimension: "vision",
    kind: "single",
    text: "¿Considera que la empresa tiene actualmente una visión clara y compartida sobre hacia dónde quiere llegar en los próximos cinco años?",
    options: [
      { id: "A", label: "Sí, existe una visión clara y compartida.", score: 100, swot: [{ t: "F", text: "Visión clara y compartida a 5 años." }] },
      { id: "B", label: "Existe una visión, pero no todos la conocen.", score: 60, pains: ["comunicacion_estrategica"] },
      { id: "C", label: "Cada área tiene una visión diferente.", score: 25, pains: ["desalineacion"], swot: [{ t: "D", text: "Áreas desalineadas: cada una persigue su propia visión." }] },
      {
        id: "D",
        label: "No existe una dirección estratégica claramente definida.",
        score: 0,
        pains: ["sin_rumbo"],
        critical: "La empresa no tiene una dirección estratégica definida: sin rumbo, cualquier esfuerzo se dispersa.",
        swot: [{ t: "D", text: "Ausencia de dirección estratégica." }],
      },
    ],
  },
  {
    id: "q1b",
    dimension: "vision",
    kind: "single",
    isNew: true,
    text: "¿La misión, el propósito y los valores de la empresa se reflejan en las decisiones del día a día?",
    help: "No basta con que estén escritos en la pared: ¿guían cómo se contrata, se vende y se prioriza?",
    options: [
      { id: "A", label: "Sí, son una guía real para decidir.", score: 100, swot: [{ t: "F", text: "Propósito y valores vividos, no solo declarados." }] },
      { id: "B", label: "Están definidos, pero se aplican de forma irregular.", score: 60 },
      { id: "C", label: "Están escritos, pero casi nadie los recuerda.", score: 30, pains: ["proposito_difuso"] },
      { id: "D", label: "No están definidos o están desactualizados.", score: 5, pains: ["proposito_difuso"], swot: [{ t: "D", text: "Misión, visión y valores no definidos o desactualizados." }] },
    ],
  },
  {
    id: "q2",
    dimension: "vision",
    kind: "single",
    profile: true,
    text: "¿Cuál considera que es hoy el principal propósito de la empresa?",
    help: "Pregunta de perfil: no suma puntaje, define la intención estratégica.",
    options: [
      { id: "A", label: "Consolidar y fortalecer el negocio actual." },
      { id: "B", label: "Recuperar el crecimiento y la rentabilidad." },
      { id: "C", label: "Expandirse hacia nuevos mercados." },
      { id: "D", label: "Diversificar hacia nuevos negocios." },
      { id: "E", label: "No existe una prioridad claramente definida.", pains: ["sin_prioridades"], swot: [{ t: "D", text: "No hay una prioridad estratégica definida." }] },
    ],
  },
  {
    id: "q2b",
    dimension: "vision",
    kind: "single",
    isNew: true,
    text: "¿La empresa traduce su estrategia en objetivos anuales medibles (metas, OKR o KPI) que se revisan periódicamente?",
    options: [
      { id: "A", label: "Sí, con objetivos por área y revisiones frecuentes.", score: 100, swot: [{ t: "F", text: "Estrategia aterrizada en objetivos medibles y revisados." }] },
      { id: "B", label: "Hay metas, pero se revisan poco o solo a fin de año.", score: 55, pains: ["sin_seguimiento"] },
      { id: "C", label: "Solo existen metas de ventas o presupuesto.", score: 35, pains: ["sin_seguimiento"] },
      { id: "D", label: "No existen objetivos formales.", score: 0, pains: ["sin_seguimiento", "sin_indicadores"], swot: [{ t: "D", text: "Sin objetivos ni indicadores formales." }] },
    ],
  },
  {
    id: "q3",
    dimension: "vision",
    kind: "open",
    text: "Si tuviera que identificar el principal obstáculo que impide que la empresa avance, ¿cuál sería?",
    placeholder: "Describa con sus palabras el obstáculo más importante…",
  },

  // ───────────────────────── 2. LIDERAZGO ─────────────────────────
  {
    id: "q4",
    dimension: "liderazgo",
    kind: "single",
    text: "¿Cómo describiría actualmente el proceso de toma de decisiones estratégicas?",
    options: [
      { id: "A", label: "Ágil, ordenado y oportuno.", score: 100, swot: [{ t: "F", text: "Toma de decisiones ágil y ordenada." }] },
      { id: "B", label: "Requiere varias reuniones y evaluaciones.", score: 65 },
      { id: "C", label: "Es lento y depende de pocas personas.", score: 30, pains: ["decisiones_lentas", "centralizacion"] },
      { id: "D", label: "Las decisiones se postergan constantemente.", score: 10, pains: ["decisiones_lentas"], swot: [{ t: "D", text: "Decisiones estratégicas postergadas." }] },
      { id: "E", label: "No existe un procedimiento definido.", score: 15, pains: ["decisiones_lentas", "gobierno_difuso"] },
    ],
  },
  {
    id: "q5",
    dimension: "liderazgo",
    kind: "single",
    text: "¿Considera que existe una separación clara entre los roles de los accionistas, la dirección ejecutiva y los gerentes?",
    options: [
      { id: "A", label: "Sí, cada uno conoce sus responsabilidades.", score: 100, swot: [{ t: "F", text: "Roles de gobierno claros entre propiedad y gestión." }] },
      { id: "B", label: "Existe una separación parcial.", score: 60 },
      { id: "C", label: "Los roles se mezclan frecuentemente.", score: 30, pains: ["gobierno_difuso"] },
      { id: "D", label: "Los accionistas intervienen directamente en decisiones operativas.", score: 15, pains: ["gobierno_difuso", "centralizacion"], swot: [{ t: "D", text: "Accionistas involucrados en la operación diaria." }] },
      { id: "E", label: "No existe claridad en las responsabilidades.", score: 0, pains: ["gobierno_difuso"], critical: "No hay claridad de responsabilidades entre accionistas, dirección y gerencia." },
    ],
  },
  {
    id: "q6",
    dimension: "liderazgo",
    kind: "single",
    text: "Cuando se presenta una oportunidad importante de negocio, ¿qué sucede habitualmente?",
    options: [
      { id: "A", label: "Se analiza y se toma una decisión dentro de un plazo definido.", score: 100 },
      { id: "B", label: "Se solicita información adicional antes de decidir.", score: 65 },
      { id: "C", label: "Se generan muchas opiniones y puntos de vista.", score: 35, pains: ["decisiones_lentas"] },
      { id: "D", label: "Se posterga la decisión hasta nuevo aviso.", score: 15, pains: ["decisiones_lentas", "oportunidades_perdidas"] },
      {
        id: "E",
        label: "Se pierde la oportunidad por falta de decisión.",
        score: 0,
        pains: ["oportunidades_perdidas", "decisiones_lentas"],
        critical: "Se pierden oportunidades de negocio por falta de decisión.",
        swot: [{ t: "D", text: "Oportunidades perdidas por indecisión." }],
      },
    ],
  },
  {
    id: "q6b",
    dimension: "liderazgo",
    kind: "single",
    isNew: true,
    text: "Si el dueño o gerente general se ausentara durante tres meses, ¿qué pasaría con la empresa?",
    help: "Mide la dependencia de personas clave y la institucionalización de la gestión.",
    options: [
      { id: "A", label: "Seguiría funcionando con normalidad.", score: 100, swot: [{ t: "F", text: "Gestión institucionalizada, no depende de una sola persona." }] },
      { id: "B", label: "Funcionaría, pero se frenarían decisiones importantes.", score: 60 },
      { id: "C", label: "Se generarían problemas serios en varias áreas.", score: 25, pains: ["dependencia_clave"] },
      {
        id: "D",
        label: "La empresa prácticamente se paralizaría.",
        score: 0,
        pains: ["dependencia_clave", "centralizacion"],
        critical: "Alta dependencia de una persona clave: la continuidad del negocio está en riesgo.",
        swot: [{ t: "A", text: "Riesgo de continuidad por dependencia de una persona clave." }],
      },
    ],
  },

  // ───────────────────────── 3. CLIENTES ─────────────────────────
  {
    id: "c1",
    dimension: "clientes",
    kind: "single",
    isNew: true,
    text: "¿La empresa sabe con claridad por qué sus clientes la eligen frente a la competencia?",
    options: [
      { id: "A", label: "Sí, tenemos una propuesta de valor clara y validada con clientes.", score: 100, swot: [{ t: "F", text: "Propuesta de valor clara y validada." }] },
      { id: "B", label: "Lo intuimos, pero no lo hemos validado.", score: 55 },
      { id: "C", label: "Creemos que nos eligen principalmente por precio.", score: 25, pains: ["propuesta_valor_debil", "guerra_precios"] },
      { id: "D", label: "No lo tenemos claro.", score: 5, pains: ["propuesta_valor_debil"], swot: [{ t: "D", text: "Propuesta de valor poco clara o no diferenciada." }] },
    ],
  },
  {
    id: "c2",
    dimension: "clientes",
    kind: "single",
    isNew: true,
    text: "¿Cómo escucha la empresa la voz del cliente (satisfacción, lealtad, quejas)?",
    options: [
      { id: "A", label: "Medimos sistemáticamente (NPS, encuestas, reclamos) y actuamos.", score: 100, swot: [{ t: "F", text: "Escucha sistemática del cliente." }] },
      { id: "B", label: "Medimos de vez en cuando.", score: 55 },
      { id: "C", label: "Solo nos enteramos cuando hay quejas.", score: 25, pains: ["sin_voz_cliente"] },
      { id: "D", label: "No tenemos ningún mecanismo.", score: 0, pains: ["sin_voz_cliente", "sin_indicadores"] },
    ],
  },
  {
    id: "c3",
    dimension: "clientes",
    kind: "single",
    isNew: true,
    text: "¿Qué tan concentrada está la cartera de clientes?",
    help: "No necesitamos cifras: basta con su percepción.",
    options: [
      { id: "A", label: "Diversificada: ningún cliente es determinante.", score: 100 },
      { id: "B", label: "Algunos clientes pesan mucho, pero es manejable.", score: 65 },
      { id: "C", label: "Pocos clientes concentran la mayor parte del negocio.", score: 25, pains: ["concentracion_clientes"], swot: [{ t: "A", text: "Alta dependencia de pocos clientes." }] },
      { id: "D", label: "Dependemos de uno o dos clientes.", score: 5, pains: ["concentracion_clientes"], critical: "Dependencia crítica de uno o dos clientes.", swot: [{ t: "A", text: "Dependencia crítica de uno o dos clientes." }] },
    ],
  },

  // ───────────────────────── 4. COMERCIAL ─────────────────────────
  {
    id: "q7",
    dimension: "comercial",
    kind: "single",
    text: "¿Cómo considera que ha evolucionado la capacidad comercial de la empresa en los últimos tres años?",
    options: [
      { id: "A", label: "Ha mejorado significativamente.", score: 100, swot: [{ t: "F", text: "Capacidad comercial en crecimiento." }] },
      { id: "B", label: "Se mantiene estable.", score: 60 },
      { id: "C", label: "Ha perdido competitividad.", score: 25, pains: ["perdida_competitividad"], swot: [{ t: "A", text: "Pérdida de competitividad frente al mercado." }] },
      { id: "D", label: "Ha disminuido considerablemente.", score: 5, pains: ["perdida_competitividad"], critical: "La capacidad comercial ha disminuido considerablemente." },
      { id: "E", label: "No tenemos indicadores suficientes para evaluarla.", score: 20, pains: ["sin_indicadores"] },
    ],
  },
  {
    id: "q8",
    dimension: "comercial",
    kind: "single",
    profile: true,
    text: "¿Qué considera que está afectando principalmente el desempeño comercial?",
    help: "Pregunta de perfil: identifica la causa percibida.",
    options: [
      { id: "A", label: "La competencia y los precios del mercado.", pains: ["guerra_precios"], swot: [{ t: "A", text: "Presión competitiva y de precios." }] },
      { id: "B", label: "La falta de nuevos clientes.", pains: ["falta_clientes"] },
      { id: "C", label: "La falta de innovación en productos.", pains: ["falta_innovacion"], swot: [{ t: "D", text: "Portafolio de productos poco renovado." }] },
      { id: "D", label: "La estrategia comercial y de ventas.", pains: ["estrategia_comercial"] },
      { id: "E", label: "La gestión del equipo comercial.", pains: ["equipo_comercial"] },
      { id: "F", label: "Los cambios en las necesidades de los clientes.", pains: ["cliente_cambiante"], swot: [{ t: "A", text: "Los clientes están cambiando sus necesidades." }] },
      { id: "G", label: "Otros factores.", other: true },
    ],
  },
  {
    id: "q9",
    dimension: "comercial",
    kind: "single",
    text: "¿Qué tan preparada considera que está la empresa para identificar y aprovechar nuevas oportunidades comerciales?",
    options: [
      { id: "A", label: "Muy preparada.", score: 100, swot: [{ t: "F", text: "Buena capacidad para detectar y aprovechar oportunidades." }] },
      { id: "B", label: "Tiene capacidad, pero necesita mejorar.", score: 60 },
      { id: "C", label: "Tiene dificultades para detectar oportunidades.", score: 25, pains: ["falta_metodologia"] },
      { id: "D", label: "Identifica oportunidades, pero no consigue ejecutarlas.", score: 30, pains: ["ejecucion_debil"], swot: [{ t: "O", text: "Ya se identifican oportunidades: falta convertirlas en ejecución." }] },
      { id: "E", label: "No existe una metodología para hacerlo.", score: 15, pains: ["falta_metodologia"] },
    ],
  },
  {
    id: "q9b",
    dimension: "comercial",
    kind: "single",
    isNew: true,
    text: "¿La empresa tiene un proceso comercial definido (prospección, seguimiento, cierre) apoyado en alguna herramienta tipo CRM?",
    options: [
      { id: "A", label: "Sí, con etapas claras, metas y un CRM en uso.", score: 100 },
      { id: "B", label: "Hay un proceso, pero se gestiona en planillas o de memoria.", score: 50, pains: ["estrategia_comercial"] },
      { id: "C", label: "Cada vendedor trabaja a su manera.", score: 20, pains: ["estrategia_comercial", "equipo_comercial"] },
      { id: "D", label: "Las ventas llegan solas o dependen del dueño.", score: 10, pains: ["estrategia_comercial", "dependencia_clave"], swot: [{ t: "D", text: "Ventas sin proceso: dependen del dueño o de la inercia." }] },
    ],
  },

  // ───────────────────────── 5. INNOVACIÓN ─────────────────────────
  {
    id: "q10",
    dimension: "innovacion",
    kind: "single",
    text: "¿Cuándo fue la última vez que la empresa realizó una transformación importante en su modelo de negocio, procesos, productos o estrategia?",
    options: [
      { id: "A", label: "Durante el último año.", score: 100, swot: [{ t: "F", text: "Experiencia reciente en transformación." }] },
      { id: "B", label: "En los últimos tres años.", score: 70 },
      { id: "C", label: "Hace más de cinco años.", score: 30, pains: ["estancamiento"] },
      { id: "D", label: "Hace más de diez años.", score: 10, pains: ["estancamiento"], swot: [{ t: "D", text: "Modelo de negocio sin renovarse en más de una década." }] },
      { id: "E", label: "No recuerdo una transformación significativa.", score: 0, pains: ["estancamiento"] },
    ],
  },
  {
    id: "q11",
    dimension: "innovacion",
    kind: "single",
    text: "¿Cómo reacciona habitualmente la organización frente a nuevas ideas, tecnologías o propuestas de cambio?",
    options: [
      { id: "A", label: "Las impulsa y experimenta con ellas.", score: 100, swot: [{ t: "F", text: "Cultura abierta a la experimentación." }] },
      { id: "B", label: "Las evalúa cuidadosamente.", score: 65 },
      { id: "C", label: "Existe resistencia al cambio.", score: 25, pains: ["resistencia_cambio"], swot: [{ t: "D", text: "Resistencia al cambio." }] },
      { id: "D", label: "Se necesita demasiado tiempo para aprobarlas.", score: 30, pains: ["decisiones_lentas", "burocracia"] },
      { id: "E", label: "Generalmente se descartan.", score: 5, pains: ["resistencia_cambio"], critical: "Las nuevas ideas se descartan sistemáticamente: la innovación está bloqueada." },
    ],
  },
  {
    id: "q12",
    dimension: "innovacion",
    kind: "single",
    text: "¿Qué tan digitalizada considera que está actualmente la gestión de la empresa?",
    options: [
      { id: "A", label: "Alta: utilizamos tecnología para gestionar y tomar decisiones.", score: 100, swot: [{ t: "F", text: "Gestión digitalizada y basada en datos." }] },
      { id: "B", label: "Media: tenemos herramientas, pero no están integradas.", score: 55, pains: ["sistemas_aislados"] },
      { id: "C", label: "Baja: predominan los procesos manuales.", score: 25, pains: ["brecha_digital"] },
      { id: "D", label: "Muy baja: existe una importante brecha tecnológica.", score: 5, pains: ["brecha_digital"], swot: [{ t: "D", text: "Brecha tecnológica importante." }] },
      { id: "E", label: "No se ha definido una estrategia de transformación digital.", score: 20, pains: ["brecha_digital"] },
    ],
  },
  {
    id: "q12b",
    dimension: "innovacion",
    kind: "single",
    isNew: true,
    text: "¿La empresa está explorando la automatización o la inteligencia artificial para mejorar su trabajo?",
    options: [
      { id: "A", label: "Sí, ya la usamos con resultados concretos.", score: 100, swot: [{ t: "F", text: "Adopción temprana de IA y automatización." }] },
      { id: "B", label: "Estamos haciendo pruebas o pilotos.", score: 65, swot: [{ t: "O", text: "Pilotos de IA que pueden escalarse." }] },
      { id: "C", label: "Nos interesa, pero no sabemos por dónde empezar.", score: 30, swot: [{ t: "O", text: "IA y automatización como palanca de productividad aún sin explotar." }] },
      { id: "D", label: "No es un tema que se haya considerado.", score: 5, pains: ["brecha_digital"], swot: [{ t: "A", text: "Riesgo de rezago frente a competidores que adoptan IA." }] },
    ],
  },

  // ───────────────────────── 6. TALENTO ─────────────────────────
  {
    id: "q13",
    dimension: "talento",
    kind: "single",
    text: "¿Considera que los gerentes y responsables de área tienen suficiente autonomía para gestionar sus departamentos y alcanzar resultados?",
    options: [
      { id: "A", label: "Sí, tienen autonomía y responsabilidad.", score: 100, swot: [{ t: "F", text: "Mandos medios con autonomía y responsabilidad." }] },
      { id: "B", label: "Tienen autonomía limitada.", score: 60 },
      { id: "C", label: "Necesitan autorización para muchas decisiones.", score: 30, pains: ["baja_autonomia"] },
      { id: "D", label: "Las decisiones importantes se concentran en los propietarios.", score: 15, pains: ["baja_autonomia", "centralizacion"] },
      { id: "E", label: "No existe claridad sobre sus niveles de autoridad.", score: 10, pains: ["baja_autonomia", "gobierno_difuso"] },
    ],
  },
  {
    id: "q14",
    dimension: "talento",
    kind: "single",
    text: "¿Cómo describiría actualmente el nivel de compromiso, motivación y sentido de pertenencia del equipo?",
    options: [
      { id: "A", label: "Alto.", score: 100, swot: [{ t: "F", text: "Equipo comprometido y con sentido de pertenencia." }] },
      { id: "B", label: "Bueno, pero con oportunidades de mejora.", score: 70 },
      { id: "C", label: "Regular.", score: 40, pains: ["desmotivacion"] },
      { id: "D", label: "Bajo.", score: 15, pains: ["desmotivacion"], swot: [{ t: "D", text: "Bajo compromiso del equipo." }] },
      { id: "E", label: "Existe desmotivación o incertidumbre generalizada.", score: 0, pains: ["desmotivacion"], critical: "Desmotivación o incertidumbre generalizada en el equipo.", swot: [{ t: "A", text: "Riesgo de fuga de talento por desmotivación." }] },
    ],
  },
  {
    id: "q14b",
    dimension: "talento",
    kind: "single",
    isNew: true,
    text: "¿Cómo fluye la información entre la dirección y los equipos?",
    options: [
      { id: "A", label: "Hay comunicación abierta, en ambos sentidos y con rituales definidos.", score: 100 },
      { id: "B", label: "Se comunica lo necesario, principalmente de arriba hacia abajo.", score: 60 },
      { id: "C", label: "Nos enteramos de las decisiones tarde o por rumores.", score: 20, pains: ["comunicacion_estrategica", "silos"] },
      { id: "D", label: "Hay silos: las áreas no se comunican entre sí.", score: 15, pains: ["silos"], swot: [{ t: "D", text: "Silos entre áreas." }] },
    ],
  },
  {
    id: "q15",
    dimension: "talento",
    kind: "single",
    text: "¿Considera que la empresa cuenta con las personas, competencias y liderazgo necesarios para ejecutar una nueva etapa de crecimiento?",
    options: [
      { id: "A", label: "Sí, tenemos el talento necesario.", score: 100, swot: [{ t: "F", text: "Talento preparado para una nueva etapa." }] },
      { id: "B", label: "Tenemos talento, pero necesitamos fortalecer algunas áreas.", score: 65 },
      { id: "C", label: "Necesitamos incorporar nuevos perfiles.", score: 40, pains: ["brecha_talento"] },
      { id: "D", label: "Tenemos dificultades para atraer y retener talento.", score: 20, pains: ["brecha_talento"], swot: [{ t: "A", text: "Dificultad para atraer y retener talento." }] },
      { id: "E", label: "Necesitamos una renovación importante del equipo directivo.", score: 10, pains: ["brecha_talento", "centralizacion"], critical: "Se percibe la necesidad de renovar el equipo directivo." },
    ],
  },

  // ───────────────────────── 7. OPERACIONES ─────────────────────────
  {
    id: "q16",
    dimension: "operaciones",
    kind: "single",
    text: "¿Cómo evaluaría la eficiencia de los procesos internos de la empresa?",
    options: [
      { id: "A", label: "Son eficientes y están bien estructurados.", score: 100, swot: [{ t: "F", text: "Procesos eficientes y estructurados." }] },
      { id: "B", label: "Funcionan, pero tienen oportunidades de mejora.", score: 65 },
      { id: "C", label: "Existen demasiados procedimientos y burocracia.", score: 30, pains: ["burocracia"] },
      { id: "D", label: "Hay duplicidad de funciones y falta de coordinación.", score: 20, pains: ["silos", "descoordinacion"], swot: [{ t: "D", text: "Duplicidad de funciones y falta de coordinación." }] },
      { id: "E", label: "Existen problemas operativos que afectan los resultados.", score: 5, pains: ["descoordinacion"], critical: "Problemas operativos que ya afectan los resultados." },
    ],
  },
  {
    id: "q16b",
    dimension: "operaciones",
    kind: "single",
    isNew: true,
    text: "¿Los procesos clave están documentados y se miden con indicadores?",
    options: [
      { id: "A", label: "Sí, documentados, con responsables e indicadores.", score: 100 },
      { id: "B", label: "Algunos procesos están documentados.", score: 55 },
      { id: "C", label: "El conocimiento está en la cabeza de las personas.", score: 20, pains: ["conocimiento_tacito"], swot: [{ t: "A", text: "Conocimiento crítico no documentado (se va con las personas)." }] },
      { id: "D", label: "No hay procesos definidos: se resuelve sobre la marcha.", score: 5, pains: ["conocimiento_tacito", "descoordinacion"] },
    ],
  },
  {
    id: "q17",
    dimension: "operaciones",
    kind: "single",
    text: "¿Considera que la infraestructura, maquinaria, instalaciones, experiencia y capacidades actuales están siendo aprovechadas al máximo?",
    options: [
      { id: "A", label: "Sí, están bien aprovechadas.", score: 100 },
      { id: "B", label: "Existe capacidad disponible que podría utilizarse mejor.", score: 60, swot: [{ t: "O", text: "Capacidad disponible para crecer sin grandes inversiones." }] },
      { id: "C", label: "Tenemos recursos subutilizados.", score: 35, pains: ["recursos_subutilizados"], swot: [{ t: "O", text: "Recursos subutilizados que pueden monetizarse o reconvertirse." }] },
      { id: "D", label: "Hay inversiones o capacidades que no generan el valor esperado.", score: 20, pains: ["recursos_subutilizados"], swot: [{ t: "D", text: "Inversiones que no generan el valor esperado." }] },
      { id: "E", label: "No tenemos claridad sobre nuestro nivel de aprovechamiento.", score: 15, pains: ["sin_indicadores"] },
    ],
  },

  // ───────────────────────── 8. DIVERSIFICACIÓN ─────────────────────────
  {
    id: "q18",
    dimension: "diversificacion",
    kind: "single",
    profile: true,
    text: "¿Cuál sería el principal motivo por el que considera conveniente invertir en nuevos negocios?",
    help: "Pregunta de perfil: revela la motivación detrás del crecimiento.",
    options: [
      { id: "A", label: "Diversificar las fuentes de ingresos.", swot: [{ t: "O", text: "Diversificar fuentes de ingreso." }] },
      { id: "B", label: "Aprovechar oportunidades de mercado.", swot: [{ t: "O", text: "Oportunidades de mercado identificadas." }] },
      { id: "C", label: "Reducir la dependencia del negocio actual.", swot: [{ t: "A", text: "Alta dependencia del negocio actual." }] },
      { id: "D", label: "Utilizar recursos disponibles para generar nuevos retornos.", swot: [{ t: "O", text: "Recursos disponibles para nuevos negocios adyacentes." }] },
      { id: "E", label: "Buscar alternativas ante las dificultades del negocio actual.", pains: ["huida_hacia_adelante"], swot: [{ t: "A", text: "El negocio actual atraviesa dificultades." }] },
      { id: "F", label: "Otros motivos.", other: true },
    ],
  },
  {
    id: "q19",
    dimension: "diversificacion",
    kind: "single",
    text: "¿Qué nivel de disposición tendría la empresa para desarrollar un negocio completamente diferente a su actividad tradicional?",
    options: [
      { id: "A", label: "Alto: estamos preparados para explorar nuevos sectores.", score: 100, swot: [{ t: "F", text: "Alta disposición a explorar nuevos sectores." }] },
      { id: "B", label: "Medio: estamos abiertos, pero con ciertas condiciones.", score: 70 },
      { id: "C", label: "Bajo: preferimos negocios relacionados con nuestra experiencia.", score: 50 },
      { id: "D", label: "Muy bajo: existe resistencia a salir de nuestro sector.", score: 20, pains: ["resistencia_cambio"] },
      { id: "E", label: "No existe consenso entre los accionistas.", score: 10, pains: ["conflicto_accionistas"], critical: "No existe consenso entre los accionistas sobre el futuro del negocio.", swot: [{ t: "D", text: "Falta de consenso entre accionistas." }] },
    ],
  },

  // ───────────────────────── 9. FUTURO ─────────────────────────
  {
    id: "f1",
    dimension: "futuro",
    kind: "single",
    isNew: true,
    text: "¿Qué tan consciente es la organización de la necesidad de cambiar?",
    help: "El sentido de urgencia es el primer paso del modelo de cambio de Kotter.",
    options: [
      { id: "A", label: "Hay un fuerte sentido de urgencia compartido.", score: 100, swot: [{ t: "F", text: "Sentido de urgencia compartido para cambiar." }] },
      { id: "B", label: "La dirección lo ve, pero el equipo no tanto.", score: 55, pains: ["comunicacion_estrategica"] },
      { id: "C", label: "Pocos lo ven; predomina la zona de confort.", score: 20, pains: ["zona_confort"] },
      { id: "D", label: "No se percibe necesidad de cambio.", score: 5, pains: ["zona_confort"], swot: [{ t: "A", text: "Complacencia: no se percibe necesidad de cambio." }] },
    ],
  },
  {
    id: "f2",
    dimension: "futuro",
    kind: "single",
    isNew: true,
    text: "Cuando la empresa lanza un proyecto o iniciativa de mejora, ¿qué suele pasar?",
    options: [
      { id: "A", label: "Se termina en plazo y se miden los resultados.", score: 100, swot: [{ t: "F", text: "Buena disciplina de ejecución." }] },
      { id: "B", label: "Se termina, aunque con retrasos.", score: 60 },
      { id: "C", label: "Arranca con entusiasmo y se va diluyendo.", score: 20, pains: ["ejecucion_debil"] },
      { id: "D", label: "Hay demasiadas iniciativas a la vez y pocas se terminan.", score: 15, pains: ["ejecucion_debil", "sin_prioridades"], swot: [{ t: "D", text: "Exceso de iniciativas y baja tasa de cierre." }] },
    ],
  },
  {
    id: "f3",
    dimension: "futuro",
    kind: "single",
    isNew: true,
    text: "¿La empresa analiza de forma periódica las tendencias del entorno (tecnología, regulación, competencia, sostenibilidad, cambios sociales)?",
    options: [
      { id: "A", label: "Sí, de forma sistemática y se reflejan en la estrategia.", score: 100 },
      { id: "B", label: "Ocasionalmente, sin un método definido.", score: 50 },
      { id: "C", label: "Reaccionamos cuando el cambio ya nos afecta.", score: 20, pains: ["miopia_entorno"] },
      { id: "D", label: "No se analiza el entorno.", score: 0, pains: ["miopia_entorno"], swot: [{ t: "A", text: "Cambios del entorno no monitoreados." }] },
    ],
  },
  {
    id: "f4",
    dimension: "futuro",
    kind: "open",
    isNew: true,
    optional: true,
    text: "¿Qué es lo que la empresa hace mejor que nadie y no debería perder?",
    help: "Indagación apreciativa: identificar fortalezas para construir sobre ellas.",
    placeholder: "Su principal fortaleza, capacidad o ventaja…",
  },
  {
    id: "q20",
    dimension: "futuro",
    kind: "list3",
    text: "Si pudiera implementar tres cambios fundamentales en la empresa durante los próximos doce meses, ¿cuáles serían?",
  },
];

export const QUESTIONS: Question[] = Q.map((q, i) => ({ ...q, number: i + 1 }));

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q])) as Record<string, Question>;

export function questionsFor(dim: DimensionId) {
  return QUESTIONS.filter((q) => q.dimension === dim);
}
