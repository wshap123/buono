alter table public.shopping_list_checks enable row level security;

drop policy if exists "shopping_list_checks_select" on public.shopping_list_checks;
drop policy if exists "shopping_list_checks_insert" on public.shopping_list_checks;
drop policy if exists "shopping_list_checks_update" on public.shopping_list_checks;
drop policy if exists "shopping_list_checks_delete" on public.shopping_list_checks;

create policy "shopping_list_checks_select"
  on public.shopping_list_checks
  for select
  using (true);

create policy "shopping_list_checks_insert"
  on public.shopping_list_checks
  for insert
  with check (true);

create policy "shopping_list_checks_update"
  on public.shopping_list_checks
  for update
  using (true)
  with check (true);

create policy "shopping_list_checks_delete"
  on public.shopping_list_checks
  for delete
  using (true);
