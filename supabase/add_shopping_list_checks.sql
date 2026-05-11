create table if not exists public.shopping_list_checks (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  item_key text not null,
  checked boolean not null default false,
  constraint shopping_list_checks_week_start_item_key_unique unique (week_start, item_key)
);

create index if not exists shopping_list_checks_week_start_idx
  on public.shopping_list_checks (week_start);
