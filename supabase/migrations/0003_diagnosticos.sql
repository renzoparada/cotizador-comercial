-- ============================================================================
-- Diagnóstico Empresarial 360°: campañas por cliente y respuestas de participantes
-- ============================================================================
-- Una "campaña" es un diagnóstico aplicado a un cliente. Tiene un enlace público
-- (/diagnostico/<slug>) que el consultor comparte con los participantes de la
-- empresa. Las respuestas solo pueden escribirse a través de la función
-- submit_diagnostic_response (security definer); nadie anónimo puede leerlas.

create table if not exists public.diagnostic_campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 20),
  client_id uuid not null references public.clients (id) on delete cascade,
  owner_id uuid references public.profiles (id) on delete set null,
  titulo text not null default 'Diagnóstico Empresarial 360°',
  abierta boolean not null default true,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists diagnostic_campaigns_client_idx on public.diagnostic_campaigns (client_id);
create index if not exists diagnostic_campaigns_owner_idx on public.diagnostic_campaigns (owner_id);

alter table public.diagnostic_campaigns enable row level security;

create policy "diagnostic_campaigns: select" on public.diagnostic_campaigns
  for select using (public.is_admin() or owner_id = auth.uid());

create policy "diagnostic_campaigns: insert" on public.diagnostic_campaigns
  for insert with check (
    (public.is_admin() or owner_id = auth.uid())
    and exists (
      select 1 from public.clients c
      where c.id = client_id and (public.is_admin() or c.owner_id = auth.uid())
    )
  );

create policy "diagnostic_campaigns: update" on public.diagnostic_campaigns
  for update using (public.is_admin() or owner_id = auth.uid());

create policy "diagnostic_campaigns: delete" on public.diagnostic_campaigns
  for delete using (public.is_admin() or owner_id = auth.uid());

-- ----------------------------------------------------------------------------

create table if not exists public.diagnostic_responses (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.diagnostic_campaigns (id) on delete cascade,
  info jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  global_score integer,
  dimension_scores jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists diagnostic_responses_campaign_idx on public.diagnostic_responses (campaign_id);

alter table public.diagnostic_responses enable row level security;

create policy "diagnostic_responses: select" on public.diagnostic_responses
  for select using (
    public.is_admin() or exists (
      select 1 from public.diagnostic_campaigns d where d.id = campaign_id and d.owner_id = auth.uid()
    )
  );

-- El consultor puede importar respuestas (JSON) en sus campañas
create policy "diagnostic_responses: insert" on public.diagnostic_responses
  for insert with check (
    public.is_admin() or exists (
      select 1 from public.diagnostic_campaigns d where d.id = campaign_id and d.owner_id = auth.uid()
    )
  );

create policy "diagnostic_responses: delete" on public.diagnostic_responses
  for delete using (
    public.is_admin() or exists (
      select 1 from public.diagnostic_campaigns d where d.id = campaign_id and d.owner_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- FUNCIONES PÚBLICAS
-- ----------------------------------------------------------------------------

-- Datos mínimos de la campaña para mostrar el cuestionario público
create or replace function public.get_diagnostic_campaign(p_slug text)
returns table (id uuid, titulo text, empresa text, abierta boolean)
language sql
security definer
stable
set search_path = public
as $$
  select d.id, d.titulo, c.empresa, d.abierta
  from public.diagnostic_campaigns d
  join public.clients c on c.id = d.client_id
  where d.slug = p_slug;
$$;

grant execute on function public.get_diagnostic_campaign(text) to anon, authenticated;

-- Guarda (o actualiza) la respuesta de un participante mientras la campaña esté abierta.
-- El id lo genera el navegador del participante, para que pueda corregir sus respuestas.
create or replace function public.submit_diagnostic_response(
  p_slug text,
  p_response_id uuid,
  p_info jsonb,
  p_answers jsonb,
  p_global integer,
  p_dimensions jsonb,
  p_completed boolean,
  p_ip text,
  p_user_agent text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_campaign public.diagnostic_campaigns%rowtype;
begin
  select * into v_campaign from public.diagnostic_campaigns where slug = p_slug;
  if not found then
    raise exception 'Diagnóstico no encontrado';
  end if;
  if not v_campaign.abierta then
    raise exception 'El diagnóstico está cerrado';
  end if;
  if octet_length(coalesce(p_answers::text, '')) > 200000 or octet_length(coalesce(p_info::text, '')) > 10000 then
    raise exception 'Respuesta demasiado grande';
  end if;

  insert into public.diagnostic_responses as r
    (id, campaign_id, info, answers, global_score, dimension_scores, completed_at, ip, user_agent)
  values
    (p_response_id, v_campaign.id, p_info, p_answers, p_global, p_dimensions,
     case when p_completed then now() end, p_ip, p_user_agent)
  on conflict (id) do update set
    info = excluded.info,
    answers = excluded.answers,
    global_score = excluded.global_score,
    dimension_scores = excluded.dimension_scores,
    completed_at = coalesce(r.completed_at, excluded.completed_at),
    ip = excluded.ip,
    user_agent = excluded.user_agent,
    updated_at = now()
  -- nunca sobrescribir respuestas de otra campaña
  where r.campaign_id = v_campaign.id;

  update public.diagnostic_campaigns set updated_at = now() where id = v_campaign.id;

  return p_response_id;
end;
$$;

grant execute on function public.submit_diagnostic_response(text, uuid, jsonb, jsonb, integer, jsonb, boolean, text, text) to anon, authenticated;
