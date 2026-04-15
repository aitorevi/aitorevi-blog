---
title: 'Vercel preview deployments: úsalos, compártelos y deja el proyecto limpio'
description: >-
  Cada rama que subes a Vercel genera una URL pública automáticamente. Te
  explico cómo sacarle partido y cómo limpiar lo que se acumula.
publishDate: 2026-04-14
coverImage: /images/blog/vercel-preview-deployments/coverImage.webp
coverImageAlt: Terminal mostrando el listado de deployments de Vercel con URLs de preview
tags:
  - Vercel
  - DevOps
  - CLI
draft: true
featured: false
author:
  name: aitorevi
  avatar: /avatar.webp
---
Cuando configuras un proyecto en Vercel conectado a GitHub, pasan dos cosas:

1. Cada push a `main` (o `master`) despliega en producción.
1. Cada push a **cualquier otra rama** despliega en una URL pública temporal.

Eso segundo es un *preview deployment*. Vercel lo crea automáticamente, sin que tengas que hacer nada. La URL tiene esta pinta:

```
https://tu-proyecto-abc123xyz-tu-equipo.vercel.app
```

No es producción. No indexa en Google (tiene `noindex`). Nadie la va a encontrar por accidente. Pero es una URL real, pública, accesible desde cualquier sitio.

## Para qué sirve

El caso más habitual: terminas una feature en una rama, no quieres mergear todavía, pero necesitas que alguien la revise en un entorno real.

```bash
git push origin feat/nuevo-formulario
```

Vercel crea la preview automáticamente. En el panel o en el bot del PR de GitHub aparece la URL. La mandas, te dan feedback, corriges, haces otro push, la URL se actualiza.

También sirve para cosas más mundanas: ver cómo queda algo en móvil sin tener que montar nada, o probar en producción antes de tocar `master`.

## Cómo listarlos

Si tienes la Vercel CLI instalada:

```bash
npm i -g vercel   # si no la tienes
vercel login
vercel ls
```

La salida muestra todos los deployments con su estado, entorno y antigüedad:

```
Age     Deployment                                          Status    Environment
1h      https://mi-blog-abc123-equipo.vercel.app            ● Ready   Production
5h      https://mi-blog-def456-equipo.vercel.app            ● Ready   Preview
14h     https://mi-blog-ghi789-equipo.vercel.app            ● Error   Preview
```

Hay tres estados relevantes:

- **Production**: el que está detrás de tu dominio real. No tocar.
- **Preview**: rama de prueba. Borrable cuando ya no lo necesitas.
- **Error**: build fallido. Borrable siempre.

Si tienes muchos deployments, `vercel ls` pagina de 20 en 20:

```bash
vercel ls --next <cursor>   # la propia salida te da el cursor
```

## Cómo eliminar uno concreto

```bash
vercel remove https://mi-blog-def456-equipo.vercel.app --yes
```

El `--yes` se salta la confirmación interactiva. Útil cuando lo metes en un script.

También puedes pasar varios a la vez:

```bash
vercel remove \
  https://mi-blog-def456-equipo.vercel.app \
  https://mi-blog-ghi789-equipo.vercel.app \
  --yes
```

## Limpiar todos los previews de golpe

Si llevas tiempo con el proyecto sin limpiar, se acumulan decenas. En lugar de borrarlos uno a uno, este loop los elimina todos en pasadas sucesivas:

```bash
while true; do
  URLS=$(vercel ls 2>&1 | grep -E "Preview|Error" | grep -oE 'https://[^ ]+')
  if [ -z "$URLS" ]; then
    echo "Nada más que limpiar."
    break
  fi
  echo "$URLS" | xargs vercel remove --yes
  sleep 1
done
```

Cómo funciona:

1. Lista los deployments y filtra los que son Preview o Error.
1. Los borra en bloque.
1. Repite hasta que no quede ninguno (porque `vercel ls` pagina, en cada iteración aparecen los siguientes).

## Que no se vuelva a acumular

La causa raíz es que Vercel guarda todos los deployments indefinidamente por defecto. Puedes cambiarlo:

1. Ve al dashboard de Vercel → tu proyecto → **Settings** → **Git**.
1. Busca la sección **Deployment Retention**.
1. Configura cuántos días quieres conservar los previews antes de que se eliminen solos.

Con eso configurado, no hace falta limpiar manualmente nunca más.

## Resumen

{% table %}
- Qué quieres hacer
- Comando
---
- Ver todos los deployments
- `vercel ls`
---
- Borrar uno
- `vercel remove <url> --yes`
---
- Borrar varios
- `vercel remove <url1> <url2> --yes`
---
- Limpiar todos los previews
- Loop con `grep` + `xargs` de arriba
---
- Evitar que se acumulen
- Deployment Retention en Settings → Git
{% /table %}

Los preview deployments son una herramienta muy útil. El problema no es usarlos, es olvidarse de que existen hasta que tienes cincuenta acumulados. Con la retención automática configurada, dejan de ser un problema.
