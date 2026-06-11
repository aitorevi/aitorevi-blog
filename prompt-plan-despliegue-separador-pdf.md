# Prompt: plan de despliegue del "Separador de PDF"

> Rellena los huecos entre `[corchetes]` antes de enviarlo. Si usas Claude Code, abre el repo de la app (y/o el del portfolio) para que tenga acceso a los ficheros.

---

Actúa como un desarrollador senior que me ayuda a planificar (todavía **no** a implementar). Quiero un **plan de acción ordenado y accionable**, no código aún.

## Contexto

- Soy desarrollador. Tengo una web personal que uso como **carta de presentación y portfolio**, hecha en **Astro**, desplegada en **Vercel**, con el repo en **GitHub**. El dominio es `[TU-DOMINIO]` y está registrado en **Dondominio**, donde también gestiono la zona DNS (no uso nameservers de Vercel ni Cloudflare).
- Tengo ya hecha una **app estática** llamada "Separador de PDF": coge un PDF y descarga cada página como un fichero independiente (opcionalmente todo en un ZIP). Funciona **100% en el cliente** con `pdf-lib` + `JSZip`, en un único fichero HTML. **No tiene backend.** (Te adjunto/está en el repo el HTML actual.)

## Objetivo

1. Desplegar la app como **proyecto independiente en su propio subdominio** (`[NOMBRE-SUBDOMINIO].[TU-DOMINIO]`, p. ej. `pdf.[TU-DOMINIO]`), separado por completo del proyecto de la web.
2. Añadir en el **portfolio (Astro)** una **sección que presente la app** (tarjeta con título, descripción breve, captura/mockup y un CTA que abra el subdominio), **sin que reste protagonismo a la web principal**.

## Decisiones ya tomadas (no las cuestiones, respétalas)

- La app va **fuera** de la web: proyecto Vercel **separado** del portfolio.
- Subdominio vía registro **CNAME en la zona DNS de Dondominio** (un único subdominio; sin comodín, sin migrar nameservers a Vercel).
- La **web sigue siendo la principal de cara a SEO**. La app no debe competir por posicionamiento: quiero `noindex` en la app o un `canonical` hacia la ficha del proyecto en el portfolio (recomiéndame cuál y por qué).
- El enlace desde el portfolio abre la app en pestaña nueva con `target="_blank"` y `rel="noopener"`.

## Qué quiero que produzcas

Un plan en fases, cada una con pasos concretos:

1. **Repo de la app**: estructura mínima recomendada (¿`index.html` en raíz?, ¿necesito `vercel.json`?, README), y cómo dejarlo listo para Vercel sin build.
2. **Despliegue en Vercel**: pasos para crear el proyecto nuevo desde GitHub (framework, build command, output) hasta tenerlo en la URL de Vercel.
3. **Subdominio**: qué añadir en *Settings → Domains* de Vercel y, sobre todo, **el registro DNS exacto a crear en Dondominio** (tipo, nombre/host, valor) y cómo verificar.
4. **Sección en el portfolio Astro**: dónde colocarla, qué componente crear, qué contenido (copy de ejemplo incluido) y cómo enlazar al subdominio respetando las decisiones de arriba.
5. **SEO/indexación**: tu recomendación concreta (`noindex` vs `canonical`) y cómo aplicarla.
6. **Checklist final** de verificación (HTTPS, propagación DNS, enlace funcionando, app abriendo bien).

## Formato

- Antes de empezar, si te falta algún dato clave (nombre definitivo del subdominio, si quiero captura real o mockup, etc.), **pregúntamelo** en una lista corta. Si prefieres, asume valores razonables y **márcalos como supuestos**.
- Plan en pasos numerados, conciso. Marca claramente las **decisiones que aún tengo que tomar yo**.
- En español.
