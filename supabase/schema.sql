create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.admin_users enable row level security;
grant select on public.admin_users to authenticated;

create policy "Admins can read their own access"
  on public.admin_users for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

create table public.site_content (
  id smallint primary key default 1 check (id = 1),
  products jsonb not null default '[]'::jsonb check (jsonb_typeof(products) = 'array'),
  whatsapp_number text not null default ''
    check (whatsapp_number = '' or whatsapp_number ~ '^[0-9]{8,15}$'),
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

create policy "Storefront content is readable by everyone"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "Admins can create storefront content"
  on public.site_content for insert
  to authenticated
  with check ((select public.is_site_admin()));

create policy "Admins can update storefront content"
  on public.site_content for update
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Product images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and (select public.is_site_admin()));

create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_site_admin()))
  with check (bucket_id = 'product-images' and (select public.is_site_admin()));

create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_site_admin()));
