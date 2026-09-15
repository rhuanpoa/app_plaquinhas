-- ============================================================================
-- ReviewQR: estrutura do banco
-- Rode este arquivo inteiro no SQL Editor do Supabase. Pode ser executado de novo
-- sem apagar dados.
-- ============================================================================

-- Sequência dos códigos das placas (QR001, QR002...). Nunca é reiniciada nem
-- reaproveitada: o código impresso na placa física é permanente, mesmo se a
-- placa for excluída.
create sequence if not exists public.plate_code_seq;

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------
create table if not exists public.plates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  client_name text,
  destination_url text,
  status text not null default 'available'
    constraint plates_status_check check (status in ('available', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Placa ativa ou desativada precisa ter cliente e link configurados.
  constraint plates_configured_check check (
    status = 'available' or (client_name is not null and destination_url is not null)
  )
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  plate_id uuid not null references public.plates (id) on delete cascade,
  created_at timestamptz not null default now(),
  user_agent text
);

create index if not exists scans_plate_id_idx on public.scans (plate_id);
create index if not exists scans_created_at_idx on public.scans (created_at);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists plates_set_updated_at on public.plates;
create trigger plates_set_updated_at
before update on public.plates
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Gerar placas em lote com códigos sequenciais
-- ---------------------------------------------------------------------------
create or replace function public.create_plates(quantity integer)
returns setof public.plates
language plpgsql
set search_path = ''
as $$
begin
  if quantity is null or quantity < 1 or quantity > 500 then
    raise exception 'A quantidade deve estar entre 1 e 500.';
  end if;

  return query
  insert into public.plates (code)
  select 'QR' || lpad(seq.n::text, greatest(3, length(seq.n::text)), '0')
  from (
    select nextval('public.plate_code_seq') as n
    from generate_series(1, quantity)
  ) as seq
  returning *;
end;
$$;

-- ---------------------------------------------------------------------------
-- Acessos por dia (horário de Brasília), para o gráfico do dashboard
-- ---------------------------------------------------------------------------
create or replace function public.daily_scans(days integer default 30)
returns table (day date, total bigint)
language sql
stable
set search_path = ''
as $$
  with period as (
    select generate_series(
      ((now() at time zone 'America/Sao_Paulo')::date - (days - 1))::timestamp,
      (now() at time zone 'America/Sao_Paulo')::date::timestamp,
      interval '1 day'
    )::date as day
  )
  select period.day, count(s.id) as total
  from period
  left join public.scans s
    on (s.created_at at time zone 'America/Sao_Paulo')::date = period.day
  group by period.day
  order by period.day;
$$;

-- ---------------------------------------------------------------------------
-- Segurança (RLS)
-- O cadastro de novos usuários está desligado, então "authenticated" é só a
-- conta do dono. Se um dia o cadastro for liberado, estas regras precisam mudar.
-- ---------------------------------------------------------------------------
alter table public.plates enable row level security;
alter table public.scans enable row level security;

drop policy if exists plates_select_authenticated on public.plates;
create policy plates_select_authenticated on public.plates
  for select to authenticated using (true);

drop policy if exists plates_insert_authenticated on public.plates;
create policy plates_insert_authenticated on public.plates
  for insert to authenticated with check (true);

drop policy if exists plates_update_authenticated on public.plates;
create policy plates_update_authenticated on public.plates
  for update to authenticated using (true) with check (true);

drop policy if exists plates_delete_authenticated on public.plates;
create policy plates_delete_authenticated on public.plates
  for delete to authenticated using (true);

drop policy if exists scans_select_authenticated on public.scans;
create policy scans_select_authenticated on public.scans
  for select to authenticated using (true);

-- Visitantes sem login não acessam nada.
revoke all on table public.plates, public.scans from anon;
revoke all on sequence public.plate_code_seq from anon;

grant select, insert, update, delete on table public.plates to authenticated;
grant select on table public.scans to authenticated;
grant usage, select on sequence public.plate_code_seq to authenticated;

revoke execute on function public.create_plates(integer) from public, anon;
grant execute on function public.create_plates(integer) to authenticated;

revoke execute on function public.daily_scans(integer) from public, anon;
grant execute on function public.daily_scans(integer) to authenticated;
