create table if not exists public.dormitory_state (
  id integer primary key check (id = 1),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.dormitory_state enable row level security;
revoke all on public.dormitory_state from anon;
grant select, insert, update on public.dormitory_state to authenticated;

drop policy if exists "Authenticated staff can read dormitory state" on public.dormitory_state;
drop policy if exists "Authenticated staff can insert dormitory state" on public.dormitory_state;
drop policy if exists "Authenticated staff can update dormitory state" on public.dormitory_state;

create policy "Authenticated staff can read dormitory state"
on public.dormitory_state
for select
to authenticated
using (true);

create policy "Authenticated staff can insert dormitory state"
on public.dormitory_state
for insert
to authenticated
with check (true);

create policy "Authenticated staff can update dormitory state"
on public.dormitory_state
for update
to authenticated
using (true)
with check (true);

alter table public.dormitory_state replica identity full;
do $$
begin
  alter publication supabase_realtime add table public.dormitory_state;
exception
  when duplicate_object then null;
end $$;