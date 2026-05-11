alter table public.reminders
add column if not exists completed boolean not null default false;

create index if not exists reminders_completed_idx on public.reminders (completed);
