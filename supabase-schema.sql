-- Ejecuta este SQL en Supabase: Dashboard → SQL Editor → New query → Pegar y Run
-- Crea las tablas y políticas para que la app funcione con la anon key

-- Tabla de recuerdos (equivalente a la colección Firestore "memories")
create table if not exists memories (
  id text primary key,
  title text not null,
  date text not null,
  end_date text,
  location text not null default '',
  description text not null default '',
  image_urls jsonb not null default '[]',
  category text not null default 'Viaje',
  is_favorite boolean default false,
  km numeric,
  movie text,
  rating_maria smallint,
  rating_guillem smallint
);

-- Tabla bucket list
create table if not exists bucket (
  id text primary key,
  title text not null,
  description text not null default '',
  is_completed boolean default false,
  category text not null default 'Hito'
);

-- Configuración (un solo registro: usuario compartido)
create table if not exists config (
  key text primary key,
  value jsonb not null
);

-- Meta (p. ej. récord tenis)
create table if not exists meta (
  key text primary key,
  value jsonb not null
);

-- Políticas para permitir leer/escribir con la anon key
alter table memories enable row level security;
alter table bucket enable row level security;
alter table config enable row level security;
alter table meta enable row level security;

create policy "Allow all for memories" on memories for all using (true) with check (true);
create policy "Allow all for bucket" on bucket for all using (true) with check (true);
create policy "Allow all for config" on config for all using (true) with check (true);
create policy "Allow all for meta" on meta for all using (true) with check (true);

-- STORAGE (hacer en Dashboard → Storage): crea un bucket llamado "memories", público,
-- y en Policies añade: "Allow public read" (SELECT) y "Allow uploads" (INSERT) para anon.
