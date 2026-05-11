create table if not exists public.made_log (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  made_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists made_log_recipe_id_idx on public.made_log (recipe_id);
create index if not exists made_log_made_at_idx on public.made_log (made_at);
