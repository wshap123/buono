alter table public.recipes
add column if not exists shopping_list jsonb not null default '{"produce":[],"proteins":[],"dairy":[],"pantry":[],"spices":[]}'::jsonb;
