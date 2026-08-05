-- ============================================================================
-- Cotizador Comercial / Propuestas — esquema inicial
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('admin', 'vendedor', 'instructor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type proposal_status as enum ('borrador', 'enviada', 'vista', 'aceptada', 'rechazada', 'vencida');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- PROFILES (extiende auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  role user_role not null default 'vendedor',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles: leer todos autenticados" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles: admin actualiza cualquiera" on public.profiles
  for update using (public.is_admin() or id = auth.uid());

create policy "profiles: admin inserta" on public.profiles
  for insert with check (true);

-- Crea el profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'vendedor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- CLIENTES
-- ----------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  empresa text not null,
  nombre_contacto text not null,
  cargo text,
  celular text,
  whatsapp text,
  email text,
  ciudad text,
  pais text,
  observaciones text,
  owner_id uuid references public.profiles (id) on delete set null,
  ultimo_contacto timestamptz,
  proximo_seguimiento timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_owner_idx on public.clients (owner_id);
create index if not exists clients_empresa_idx on public.clients using gin (to_tsvector('spanish', coalesce(empresa,'') || ' ' || coalesce(nombre_contacto,'') || ' ' || coalesce(email,'')));

alter table public.clients enable row level security;

create policy "clients: select" on public.clients
  for select using (public.is_admin() or owner_id = auth.uid());

create policy "clients: insert" on public.clients
  for insert with check (public.is_admin() or owner_id = auth.uid());

create policy "clients: update" on public.clients
  for update using (public.is_admin() or owner_id = auth.uid());

create policy "clients: delete" on public.clients
  for delete using (public.is_admin() or owner_id = auth.uid());

-- ----------------------------------------------------------------------------
-- NOTAS DE CLIENTE (CRM)
-- ----------------------------------------------------------------------------
create table if not exists public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  nota text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.client_notes enable row level security;

create policy "client_notes: select" on public.client_notes
  for select using (
    public.is_admin() or exists (
      select 1 from public.clients c where c.id = client_id and c.owner_id = auth.uid()
    )
  );

create policy "client_notes: insert" on public.client_notes
  for insert with check (
    public.is_admin() or exists (
      select 1 from public.clients c where c.id = client_id and c.owner_id = auth.uid()
    )
  );

create policy "client_notes: delete" on public.client_notes
  for delete using (
    public.is_admin() or created_by = auth.uid()
  );

-- ----------------------------------------------------------------------------
-- SECUENCIA DE NUMERO DE COTIZACION
-- ----------------------------------------------------------------------------
create sequence if not exists public.proposal_number_seq start 1000;

-- ----------------------------------------------------------------------------
-- PROPUESTAS / COTIZACIONES
-- ----------------------------------------------------------------------------
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique default ('PROP-' || nextval('public.proposal_number_seq')::text),
  slug text not null unique,
  client_id uuid references public.clients (id) on delete set null,
  owner_id uuid references public.profiles (id) on delete set null,
  estado proposal_status not null default 'borrador',
  titulo text not null default 'Nueva propuesta comercial',
  content jsonb not null default '{}'::jsonb,
  precio_normal numeric(12,2),
  precio_promocional numeric(12,2),
  mostrar_precio boolean not null default true,
  moneda text not null default 'USD',
  validez_oferta text,
  notas_precio text,
  fecha timestamptz not null default now(),
  sent_at timestamptz,
  first_viewed_at timestamptz,
  last_viewed_at timestamptz,
  view_count integer not null default 0,
  accepted_at timestamptz,
  rejected_at timestamptz,
  vencimiento date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_owner_idx on public.proposals (owner_id);
create index if not exists proposals_client_idx on public.proposals (client_id);
create index if not exists proposals_estado_idx on public.proposals (estado);
create index if not exists proposals_slug_idx on public.proposals (slug);

alter table public.proposals enable row level security;

-- Panel: dueño o admin
create policy "proposals: select panel" on public.proposals
  for select using (public.is_admin() or owner_id = auth.uid());

create policy "proposals: insert" on public.proposals
  for insert with check (public.is_admin() or owner_id = auth.uid());

create policy "proposals: update" on public.proposals
  for update using (public.is_admin() or owner_id = auth.uid());

create policy "proposals: delete" on public.proposals
  for delete using (public.is_admin() or owner_id = auth.uid());

-- Público: cualquiera con el slug puede leer una propuesta ya enviada (landing)
create policy "proposals: select publico por slug" on public.proposals
  for select using (estado <> 'borrador');

-- ----------------------------------------------------------------------------
-- VISITAS / SEGUIMIENTO
-- ----------------------------------------------------------------------------
create table if not exists public.proposal_views (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  ip text,
  user_agent text,
  device text,
  browser text
);

alter table public.proposal_views enable row level security;

create policy "proposal_views: insert publico" on public.proposal_views
  for insert with check (true);

create policy "proposal_views: select panel" on public.proposal_views
  for select using (
    public.is_admin() or exists (
      select 1 from public.proposals p where p.id = proposal_id and p.owner_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- EVENTOS (aceptación / rechazo / envío)
-- ----------------------------------------------------------------------------
create table if not exists public.proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  tipo text not null, -- enviada | vista | aceptada | rechazada | vencida
  ip text,
  user_agent text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.proposal_events enable row level security;

create policy "proposal_events: insert publico" on public.proposal_events
  for insert with check (true);

create policy "proposal_events: select panel" on public.proposal_events
  for select using (
    public.is_admin() or exists (
      select 1 from public.proposals p where p.id = proposal_id and p.owner_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- FUNCIONES DE SEGUIMIENTO
-- ----------------------------------------------------------------------------

-- Registra una vista pública y actualiza contadores/estado de la propuesta
create or replace function public.register_proposal_view(
  p_slug text,
  p_ip text,
  p_user_agent text,
  p_device text,
  p_browser text
)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_proposal public.proposals%rowtype;
begin
  select * into v_proposal from public.proposals where slug = p_slug and estado <> 'borrador';
  if not found then
    return;
  end if;

  insert into public.proposal_views (proposal_id, ip, user_agent, device, browser)
  values (v_proposal.id, p_ip, p_user_agent, p_device, p_browser);

  insert into public.proposal_events (proposal_id, tipo, ip, user_agent)
  values (v_proposal.id, 'vista', p_ip, p_user_agent);

  update public.proposals set
    view_count = view_count + 1,
    first_viewed_at = coalesce(first_viewed_at, now()),
    last_viewed_at = now(),
    estado = case when estado = 'enviada' then 'vista' else estado end,
    updated_at = now()
  where id = v_proposal.id;

  return query select v_proposal.id;
end;
$$;

grant execute on function public.register_proposal_view(text, text, text, text, text) to anon, authenticated;

-- Acepta una propuesta públicamente
create or replace function public.accept_proposal(
  p_slug text,
  p_ip text,
  p_user_agent text,
  p_nombre text,
  p_cargo text
)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_proposal public.proposals%rowtype;
begin
  select * into v_proposal from public.proposals where slug = p_slug and estado <> 'borrador';
  if not found then
    raise exception 'Propuesta no encontrada';
  end if;

  update public.proposals set
    estado = 'aceptada',
    accepted_at = now(),
    updated_at = now()
  where id = v_proposal.id;

  insert into public.proposal_events (proposal_id, tipo, ip, user_agent, meta)
  values (v_proposal.id, 'aceptada', p_ip, p_user_agent, jsonb_build_object('nombre', p_nombre, 'cargo', p_cargo));

  return query select v_proposal.id;
end;
$$;

grant execute on function public.accept_proposal(text, text, text, text, text) to anon, authenticated;

-- Rechaza una propuesta públicamente
create or replace function public.reject_proposal(
  p_slug text,
  p_ip text,
  p_user_agent text,
  p_motivo text
)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_proposal public.proposals%rowtype;
begin
  select * into v_proposal from public.proposals where slug = p_slug and estado <> 'borrador';
  if not found then
    raise exception 'Propuesta no encontrada';
  end if;

  update public.proposals set
    estado = 'rechazada',
    rejected_at = now(),
    updated_at = now()
  where id = v_proposal.id;

  insert into public.proposal_events (proposal_id, tipo, ip, user_agent, meta)
  values (v_proposal.id, 'rechazada', p_ip, p_user_agent, jsonb_build_object('motivo', p_motivo));

  return query select v_proposal.id;
end;
$$;

grant execute on function public.reject_proposal(text, text, text, text) to anon, authenticated;

-- Marca como enviada
create or replace function public.mark_proposal_sent(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.proposals set
    estado = 'enviada',
    sent_at = now(),
    updated_at = now()
  where id = p_id and (estado = 'borrador' or estado = 'enviada');

  insert into public.proposal_events (proposal_id, tipo)
  values (p_id, 'enviada');
end;
$$;

grant execute on function public.mark_proposal_sent(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- STORAGE: bucket para imágenes de propuestas (logos, fotos, galería)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('proposal-assets', 'proposal-assets', true)
on conflict (id) do nothing;

create policy "proposal-assets: lectura publica"
  on storage.objects for select
  using (bucket_id = 'proposal-assets');

create policy "proposal-assets: escritura autenticados"
  on storage.objects for insert
  with check (bucket_id = 'proposal-assets' and auth.role() = 'authenticated');

create policy "proposal-assets: actualizar autenticados"
  on storage.objects for update
  using (bucket_id = 'proposal-assets' and auth.role() = 'authenticated');

create policy "proposal-assets: borrar autenticados"
  on storage.objects for delete
  using (bucket_id = 'proposal-assets' and auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- Actualizar updated_at automáticamente
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_clients_updated on public.clients;
create trigger trg_clients_updated before update on public.clients
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_proposals_updated on public.proposals;
create trigger trg_proposals_updated before update on public.proposals
  for each row execute procedure public.set_updated_at();
