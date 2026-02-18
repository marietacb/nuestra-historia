
# Web Love Analytics (este nombre tiene mas gancho)

Hola Daniel:-) Te pongo aquí la info de como va ahora
## Cómo verla en el portátil (Desarrollo)

1. **Descargate todos los archivos** en una carpeta.
2. Importanta tener instalado **Node.js** ([descárgalo aquí si no lo tienes](https://nodejs.org/)).
3. Abrir una terminal en esa carpeta.
4. Ejecutar los siguientes comandos:
   ```bash
   npm install
   npm run dev
   ```
5. Abre el enlace que aparecerá (normalmente `http://localhost:5173`).

Ahora mismo se compartiria asi con guille
## Despliegue

Para que Guille pueda entrar desde su propio portátil en su casa:

1. Tengo una cuenta en [Vercel](https://vercel.com/) También he visto que esto está bien pero no lo tengo [Netlify](https://www.netlify.com/).
2. He hecho un proyecto en Vercel para esto y ya.
3. Luego en una pestaña me dan un enlace público (ej. `nuestra-historia.vercel.app`).
4. **¡Paso Importante para sincronizar!**: Como los datos se guardan en el navegador por privacidad, el ve la app vacía al principio. 
   - Ve a **Ajustes** en el ordenador donde se han puesto todas las citas.
   - Pulsa "Descargar Nuestra Historia".
   - Le enviaría ese archivo `.json` por chat.
   - Él debe entrar en el enlace desde SU portátil, ir a **Ajustes** y pulsar "Cargar Historia Compartida".
