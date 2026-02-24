# Desplegar la app para acceder desde cualquier sitio

Si despliegas la app en internet, podrás abrirla desde el móvil, otro ordenador o cualquier sitio. **Todas las citas y datos se guardan en Supabase**, así que lo que guardes en un dispositivo se verá en todos los demás.

---

## Opción recomendada: Vercel (gratis)

1. **Sube el proyecto a GitHub** (si no lo has hecho ya).
2. Entra en [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub).
3. **Add New** → **Project** → importa el repositorio `nuestra-historia`.
4. En **Environment Variables** añade:
   - `VITE_SUPABASE_URL` = la URL de tu proyecto Supabase (ej. `https://xxxxx.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = la clave **anon public** de Supabase (Project Settings → API)
5. Pulsa **Deploy**.

Cuando termine, Vercel te dará una URL (ej. `https://nuestra-historia-xxx.vercel.app`). Esa es la web que puedes usar desde cualquier sitio.

---

## Variables de entorno en producción

En Vercel (o en la plataforma que uses):

| Variable | Dónde la sacas |
|----------|-----------------|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |

Sin estas variables, la app no podrá conectar con Supabase y no verás ni guardarás datos.

---

## Sincronización entre dispositivos

- Los **recuerdos/citas**, la **bucket list**, la **configuración** y las **fotos** están en tu proyecto de Supabase.
- Cualquier dispositivo que abra la **misma URL desplegada** (con las mismas variables de entorno) usa la **misma base de datos**.
- Por tanto: lo que guardes en un ordenador aparecerá en el otro, en el móvil, etc., porque todos leen y escriben en Supabase.

No hace falta instalar nada en cada dispositivo: solo abre la URL de la app en el navegador.
