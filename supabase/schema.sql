-- Buono meal planning schema
-- Paste this entire script into the Supabase SQL editor and run it once.

create extension if not exists pgcrypto;

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  source_url text,
  image_url text,
  prep_time integer,
  cook_time integer,
  servings integer,
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  shopping_list jsonb not null default '{"produce":[],"proteins":[],"dairy":[],"pantry":[],"spices":[]}'::jsonb,
  tags text[] not null default '{}'::text[],
  is_favorite boolean not null default false,
  rating integer,
  times_made integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  constraint recipes_rating_check check (rating is null or rating between 1 and 5)
);

create table public.meal_plan (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  meal_type text not null,
  recipe_id uuid references public.recipes (id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint meal_plan_meal_type_check check (meal_type in ('breakfast', 'lunch', 'dinner')),
  constraint meal_plan_date_meal_type_unique unique (date, meal_type)
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references public.meal_plan (id) on delete cascade,
  message text not null,
  remind_at timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.recipe_notes (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index meal_plan_date_idx on public.meal_plan (date);
create index meal_plan_recipe_id_idx on public.meal_plan (recipe_id);
create index reminders_meal_plan_id_idx on public.reminders (meal_plan_id);
create index reminders_remind_at_idx on public.reminders (remind_at);
create index reminders_completed_idx on public.reminders (completed);
create index recipe_notes_recipe_id_idx on public.recipe_notes (recipe_id);

create table public.made_log (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  made_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index made_log_recipe_id_idx on public.made_log (recipe_id);
create index made_log_made_at_idx on public.made_log (made_at);

create table public.shopping_list_checks (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  item_key text not null,
  checked boolean not null default false,
  constraint shopping_list_checks_week_start_item_key_unique unique (week_start, item_key)
);

create index shopping_list_checks_week_start_idx on public.shopping_list_checks (week_start);
