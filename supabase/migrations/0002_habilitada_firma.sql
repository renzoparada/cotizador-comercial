-- ============================================================================
-- Habilitar/deshabilitar propuesta manualmente + firma en el bloque de encabezado
-- ============================================================================

alter table public.proposals
  add column if not exists habilitada boolean not null default true;

comment on column public.proposals.habilitada is
  'Interruptor manual del admin: si es false, la landing pública siempre muestra la pantalla de "vencida", sin importar el estado o la fecha de vencimiento.';
