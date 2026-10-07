-- ============================================================================
-- Redirecionamento dos QR Codes
-- Rode este arquivo no SQL Editor do Supabase, depois de schema.sql.
--
-- A função roda com permissão elevada (security definer) porque quem escaneia
-- a plaquinha não tem login. Ela devolve apenas o link de destino de placas
-- ativas e registra o acesso. Nenhum outro dado é exposto.
-- ============================================================================
create or replace function public.resolve_plate(plate_code text, agent text default null)
returns table (destination_url text, status text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  plate_row public.plates;
begin
  select * into plate_row
  from public.plates p
  where p.code = upper(btrim(plate_code));

  if not found then
    return query select null::text, 'not_found'::text;
    return;
  end if;

  if plate_row.status <> 'active' or plate_row.destination_url is null then
    return query select null::text, plate_row.status;
    return;
  end if;

  insert into public.scans (plate_id, user_agent)
  values (plate_row.id, left(agent, 500));

  return query select plate_row.destination_url, 'active'::text;
end;
$$;

-- Quem escaneia não tem login: o papel "anon" precisa executar a função.
revoke execute on function public.resolve_plate(text, text) from public;
grant execute on function public.resolve_plate(text, text) to anon, authenticated;
