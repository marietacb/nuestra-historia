# Nuestra Historia en el iPhone, gratis

La app se puede usar en un iPhone sin pagar el programa de desarrollador de Apple (99 USD al año). Hay dos caminos gratuitos. Publicarla en la App Store sí exige esa cuota.

Los datos siguen en Supabase. El iPhone y el ordenador ven las mismas citas si el build incluye `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## 1. Instalarla desde Safari (sin Mac)

Esta es la forma gratuita que no necesita Xcode.

1. Despliega la web en Vercel, como en [DEPLOY.md](DEPLOY.md).
2. En el iPhone, abre esa URL con **Safari** (no con Chrome).
3. Pulsa el botón **Compartir**.
4. Elige **Añadir a pantalla de inicio**.
5. Confirma el nombre **Nuestra Historia**.

Queda un icono de corazón en la pantalla de inicio y se abre a pantalla completa, con la barra de pestañas de abajo. Para actualizarla, vuelve a desplegar en Vercel y abre la app otra vez.

## 2. Instalarla como app nativa en tu iPhone (con un Mac)

El proyecto de Xcode está en `ios/`. Con un Apple ID gratuito se instala en tu propio iPhone. Apple deja esa instalación unos 7 días; después hay que volver a pulsar Run en Xcode. No se puede subir a la App Store ni a TestFlight con la cuenta gratuita.

En el Mac, dentro de esta carpeta:

```bash
cp .env.example .env
# Edita .env con la URL y la clave anon de Supabase.

npm install
npm run cap:sync
npm run ios
```

`npm run ios` abre Xcode. Después:

1. Conecta el iPhone y desbloquéalo.
2. En Xcode, elige el proyecto **App** y la pestaña **Signing & Capabilities**.
3. Marca **Automatically manage signing**.
4. En **Team**, entra con tu Apple ID (Personal Team). Si Xcode cambia el identificador `app.nuestrahistoria.ios`, déjalo: con la cuenta gratuita a veces hay que añadirle un sufijo.
5. Elige tu iPhone como destino y pulsa **Run**.
6. En el iPhone: **Ajustes → General → VPN y gestión de dispositivos** y confía en tu certificado.

La primera vez hace falta red para cargar la tipografía. Las fotos se eligen desde el selector del sistema al añadir una cita.

## 3. App Store

Para que cualquier persona la descargue de la App Store hace falta el [Apple Developer Program](https://developer.apple.com/programs/) (99 USD al año). Con la cuenta de pago, en Xcode: **Product → Archive** y sube el archivo a App Store Connect. El identificador del paquete es `app.nuestrahistoria.ios`.
