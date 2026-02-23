# Configuración de Supabase para Nuestra Historia

Sigue estos pasos **en la web de Supabase** y en tu proyecto local.

---

## 1. Crear proyecto en Supabase (si no tienes uno)

1. Entra en [supabase.com](https://supabase.com) e inicia sesión.
2. **New project** → elige nombre, contraseña de base de datos y región.
3. Espera a que el proyecto esté listo.

---

## 2. Ejecutar el SQL (tablas y políticas)

1. En el proyecto: **SQL Editor** → **New query**.
2. Abre el archivo `supabase-schema.sql` de este repo, copia todo su contenido y pégalo en el editor.
3. Pulsa **Run**.
4. Debe indicar que las tablas y políticas se han creado correctamente.

---

## 3. Crear el bucket de Storage (fotos de recuerdos)

1. En el menú: **Storage**.
2. **New bucket**:
   - Name: `memories` (tiene que ser exactamente este nombre).
   - **Public bucket**: activado (para que las fotos tengan URL pública).
3. Crea el bucket.
4. Entra en el bucket `memories` → **Policies** → **New policy**:
   - Para **lectura**: "Allow public read" o política que permita `SELECT` a todos.
   - Para **subida**: política que permita `INSERT` (uploads) con la anon key (por ejemplo "Allow authenticated and anon uploads" o una policy que permita todo en el bucket `memories`).

Si prefieres políticas manuales en SQL (Storage policies), en el editor SQL puedes usar algo como:

```sql
-- Permitir lectura pública del bucket memories
create policy "Public read"
on storage.objects for select
using ( bucket_id = 'memories' );

-- Permitir subida con anon
create policy "Allow uploads"
on storage.objects for insert
with check ( bucket_id = 'memories' );
```

---

## 4. Obtener URL y anon key

1. **Project Settings** (icono de engranaje) → **API**.
2. Copia:
   - **Project URL** (algo como `https://xxxxx.supabase.co`).
   - **anon public** (clave larga bajo "Project API keys").

---

## 5. Qué proporcionar al proyecto (variables de entorno)

En la **raíz del proyecto** crea un archivo `.env` (no lo subas a Git). Contenido:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Sustituye por la **Project URL** y la **anon public** que copiaste en el paso 4.

---

## 6. Instalar dependencias y probar

En la raíz del proyecto:

```bash
npm install
npm run dev
```

Abre la app en el navegador; los datos se guardarán en Supabase y las fotos en el bucket `memories`.
