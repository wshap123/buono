delete from public.meal_plan
where meal_type in ('breakfast', 'lunch');

alter table public.meal_plan
drop constraint if exists meal_plan_meal_type_check;

alter table public.meal_plan
add constraint meal_plan_meal_type_check check (meal_type in ('dinner'));
