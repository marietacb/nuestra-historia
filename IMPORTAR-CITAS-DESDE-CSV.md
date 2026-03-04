## Cómo preparar un CSV/Excel para importar citas en Supabase

Aquí tienes la guía para crear un archivo CSV (o Excel que luego exportas a CSV) con todas tus citas y subirlo a la tabla `memories` de Supabase.

### 1. Columnas de la tabla `memories`

Estas son las columnas tal y como están definidas en `supabase-schema.sql`:

- **id** (texto, `primary key`, **obligatoria**)
  - Identificador único de la cita.
  - Ejemplos: `cita-001`, `viaje-roma-2023`, etc.
- **title** (texto, `not null`, **obligatoria**)
  - Título de la cita.
  - Ejemplo: `Cena aniversario`, `Viaje a Roma`.
- **date** (texto, `not null`, **obligatoria**)
  - Fecha principal en formato `YYYY-MM-DD`.
  - Ejemplo: `2024-02-14`.
- **end_date** (texto, puede ser `null`)
  - Fecha de fin para planes de varios días, también en formato `YYYY-MM-DD`.
  - Déjalo **vacío** si es un solo día.
- **location** (texto, `not null`, valor por defecto `''`)
  - Lugar de la cita. Si lo dejas vacío y no se indica en el CSV, Supabase usará una cadena vacía.
- **description** (texto, `not null`, valor por defecto `''`)
  - Descripción o comentario de la cita.
- **image_urls** (`jsonb`, `not null`, valor por defecto `[]`)
  - Lista de URLs de imágenes en formato JSON (por ejemplo `["https://foto1.jpg","https://foto2.jpg"]`).
  - Si no tienes aún fotos, puedes poner simplemente `[]` o incluso no incluir esta columna al importar.
- **category** (texto, `not null`, valor por defecto `'Viaje'`)
  - Categoría de la cita. Valores usados en la app:
    - `Viaje`, `Comida`, `Cine`, `Hito`, `Tometa`.
  - Si no rellenas nada y la columna no se incluye, Supabase pondrá `'Viaje'`.
- **is_favorite** (boolean, valor por defecto `false`)
  - Marca si la cita es favorita.
  - Valores recomendados en el CSV: `true` o `false`.
- **km** (numérico, puede ser `null`)
  - Kilómetros recorridos (solo tiene sentido para `Viaje`).
  - Déjalo vacío si no aplica.
- **movie** (texto, puede ser `null`)
  - Título de la película (solo si `category = 'Cine'`).
  - Déjalo vacío si no es una cita de cine.
- **rating_maria** (`smallint`, puede ser `null`)
  - Nota de 1 a 5 de María (solo para cine).
  - Déjalo vacío si no aplica.
- **rating_guillem** (`smallint`, puede ser `null`)
  - Nota de 1 a 5 de Guillem (solo para cine).
  - Déjalo vacío si no aplica.

### 2. Cabecera recomendada para el CSV

En tu Excel, crea una primera fila con esta cabecera (cada coma separa una columna):

```text
id,title,date,end_date,location,description,image_urls,category,is_favorite,km,movie,rating_maria,rating_guillem
```

Luego, en las filas siguientes, rellenas una cita por fila.

### 3. Qué poner cuando no tienes dato

- **Campos que pueden ser `null`** → deja la celda **vacía**:
  - `end_date`, `km`, `movie`, `rating_maria`, `rating_guillem`.
- **Campos con valor por defecto**:
  - `location`, `description`, `image_urls`, `category`, `is_favorite`.
  - Si **no incluyes la columna** en el CSV, Supabase usará su valor por defecto.
  - Si incluyes la columna pero dejas celdas vacías, según el tipo puede interpretarse como `''` (cadena vacía), `false` o `null`.

Para no complicarte:

- Rellena siempre: `id`, `title`, `date`, `location`, `description`, `category`.
- Para el resto, deja la celda vacía cuando no tengas dato.

### 4. Ejemplo de contenido del CSV

Aquí tienes un ejemplo de dos filas, una de comida y otra de cine:

```text
id,title,date,end_date,location,description,image_urls,category,is_favorite,km,movie,rating_maria,rating_guillem
cita-001,Cena aniversario,2024-02-14,,Madrid,"Cena especial por San Valentín","[]",Comida,true,,,
cita-002,Inside Out 2,2024-06-20,,Cinesa Proyecciones,"Lloramos un poquito con Ansiedad.","[\"https://mi-cartel.jpg\"]",Cine,true,,Inside Out 2,5,5
```

Notas:

- En Excel, cada parte separada por comas es una columna.
- Si las comillas dobles del JSON (`"`) te resultan liosas, puedes empezar usando simplemente `[]` en `image_urls`; la app irá añadiendo URLs reales cuando subas fotos.

### 5. Pasos para importar el CSV en Supabase

1. Entra en tu proyecto de Supabase.
2. Ve a **Table editor** y abre la tabla `memories`.
3. Pulsa **Import data** / **Upload CSV**.
4. Selecciona el CSV que has exportado desde Excel.
5. En el asistente, asegúrate de que cada columna del CSV se mapea con la columna correcta de la tabla:
   - `id` → `id`
   - `title` → `title`
   - `date` → `date`
   - etc.
6. Ejecuta la importación.

Después de importar, al abrir la app, las citas deberían cargarse directamente desde Supabase.

