alter table public.user_admin
add column if not exists is_active boolean not null default true;

alter table public.user_admin
add column if not exists email text;

create index if not exists user_admin_is_active_idx on public.user_admin (is_active);
create index if not exists user_admin_email_idx on public.user_admin (email);

update public.user_admin
set is_active = true
where is_active is null;

update public.user_admin ua
set email = au.email
from auth.users au
where au.id = ua.auth_id
  and ua.email is null;
