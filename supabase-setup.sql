-- Dieses Skript im Supabase SQL Editor ausführen (Projekt öffnen → SQL Editor → New query → einfügen → Run)

create table if not exists app_storage (
  storage_key text not null,
  scope_id text not null,
  value jsonb,
  updated_at timestamptz default now(),
  primary key (storage_key, scope_id)
);

-- Row Level Security aktivieren
alter table app_storage enable row level security;

-- Öffentlichen Lese- und Schreibzugriff erlauben (kein Login-System in der App vorhanden,
-- entspricht dem bisherigen Verhalten mit Claudes geteiltem/persönlichem Speicher)
create policy "Öffentlicher Lesezugriff" on app_storage
  for select using (true);

create policy "Öffentlicher Schreibzugriff (Insert)" on app_storage
  for insert with check (true);

create policy "Öffentlicher Schreibzugriff (Update)" on app_storage
  for update using (true);
