# Propuestas — Cotizador Comercial

Plataforma SaaS para crear, enviar y dar seguimiento a propuestas comerciales de capacitaciones, entrenamientos, conferencias y consultorías. Incluye panel administrativo, constructor de propuestas por bloques, landing pública premium con seguimiento de interacción, CRM básico de clientes, dashboard con métricas, reportes exportables y extras de IA.

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS 4, Framer Motion, TipTap (editor de texto enriquecido), Recharts.
- **Backend:** Supabase (Postgres, Auth, Storage, Row Level Security).
- **IA (opcional):** Google Gemini (nivel gratuito, sin tarjeta), para los "Extras inteligentes".

## 1. Crear el proyecto de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** y ejecuta el contenido de [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql). Esto crea:
   - Tablas: `profiles`, `clients`, `client_notes`, `proposals`, `proposal_views`, `proposal_events`.
   - Políticas de RLS (cada usuario ve solo lo suyo; el rol `admin` ve todo).
   - Funciones `register_proposal_view`, `accept_proposal`, `reject_proposal`, `mark_proposal_sent` (usadas por la landing pública y el panel).
   - El bucket público de Storage `proposal-assets` (logos, fotos, galería).

   Luego ejecuta, en orden, las migraciones siguientes:
   - [`0002_habilitada_firma.sql`](./supabase/migrations/0002_habilitada_firma.sql)
   - [`0003_diagnosticos.sql`](./supabase/migrations/0003_diagnosticos.sql): tablas `diagnostic_campaigns` y `diagnostic_responses` del **Diagnóstico 360°**, con RLS y las funciones públicas `get_diagnostic_campaign` y `submit_diagnostic_response`.
3. En **Authentication → Providers**, deja habilitado el login por correo/contraseña.
4. Crea tu primer usuario administrador:
   - En **Authentication → Users**, crea un usuario con tu correo.
   - En **Table Editor → profiles**, edita la fila creada automáticamente y cambia `role` a `admin`.

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key   # solo servidor, para invitar usuarios
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GEMINI_API_KEY=                                  # opcional, habilita los extras de IA (gratis en aistudio.google.com/apikey)
NOTIFY_WEBHOOK_URL=                              # opcional, webhook al aceptar una propuesta
```

## 3. Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — te llevará a `/login`.

## Estructura del producto

### Panel administrativo (`/admin`)

- **Dashboard** — total de cotizaciones, aceptadas/rechazadas/pendientes, monto cotizado/aceptado, conversión %, gráfico mensual y top clientes.
- **Clientes** — alta/edición, búsqueda, ficha con historial de cotizaciones, notas (CRM) y próximo seguimiento.
- **Cotizaciones** — listado con filtros (empresa, contacto, correo, celular, ciudad, estado, fecha), export a CSV/Excel/PDF.
- **Constructor de propuesta** — encabezado, video (YouTube/Vimeo), descripción (rich text), objetivos, beneficios (con íconos), temario por módulos, metodología, duración, incluye, **bonus**, perfil del facilitador, testimonios, galería y precio (con opción de ocultar el precio). Autoguardado y vista previa en vivo.
- **Asistente IA** — generación de propuesta completa, reescritura de tono, objetivos y temario por IA, sugerencia de precio, carta de presentación personalizada, resumen ejecutivo y cross-selling (requiere `GEMINI_API_KEY`, gratis en [Google AI Studio](https://aistudio.google.com/apikey)).
- **Reportes** — tendencia mensual y exportación de cotizaciones filtradas.
- **Configuración** — invitar usuarios y administrar roles (`admin`, `vendedor`, `instructor`). Solo administradores.

### Landing pública (`/cotizacion/[slug]`)

Página única y animada por propuesta. Registra automáticamente vistas (fecha, IP, dispositivo, navegador), cuenta de visitas y permite **Aceptar Cotización** (con confirmación) o indicar que no está interesado — todo sin pasarelas de pago.

## Roles y seguridad

- **Administrador:** ve y administra todo.
- **Vendedor / Instructor:** solo ven sus propios clientes y cotizaciones (aplicado vía RLS en Postgres, no solo en la UI).

## Notas de diseño

Interfaz inspirada en el lenguaje visual de Apple: espacios amplios, tipografía Inter, iconografía Lucide, modo claro/oscuro automático (con toggle manual) y animaciones suaves con Framer Motion en la landing pública.

## Marca (logo y firma)

El logo y la foto del entrenador se suben directamente desde el constructor de cada propuesta (bloque "Encabezado" y "Perfil del facilitador"), quedan guardados en Supabase Storage y se reutilizan igual en todas las propuestas nuevas si los subes una vez y copias esa propuesta como plantilla.
