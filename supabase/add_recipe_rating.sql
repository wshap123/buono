alter table public.recipes
add column if not exists rating integer;

alter table public.recipes
drop constraint if exists recipes_rating_check;

alter table public.recipes
add constraint recipes_rating_check check (rating is null or rating between 1 and 5);
