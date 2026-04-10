# Contact form — production setup

## Estado actual (funciona en local)

- Resend instalado y configurado en `src/pages/api/contact.ts`
- `RESEND_API_KEY` en `.env` (cuenta gratuita de Resend)
- `CONTACT_TO=aitorevi@gmail.com` en `.env` (temporal — solo para testing)
- `from: onboarding@resend.dev` (dominio de prueba de Resend)
- Limitación: sin dominio verificado, Resend solo envía al email del titular de la cuenta

---

## Pasos para producción

### 1. Verificar dominio en Resend

1. Entra en [resend.com/domains](https://resend.com/domains)
2. Añade el dominio `aitorevi.dev`
3. Resend te dará registros DNS (TXT + MX) que añadir en tu proveedor de DNS
4. Espera la verificación (suele tardar minutos)

### 2. Actualizar `from` en el endpoint

Una vez verificado `aitorevi.dev`, cambia en `src/pages/api/contact.ts`:

```ts
// Antes (dominio de prueba)
from: 'Portfolio Contact <onboarding@resend.dev>',

// Después (dominio propio)
from: 'Portfolio Contact <noreply@aitorevi.dev>',
```

### 3. Actualizar variables de entorno en Vercel

En el dashboard de Vercel → proyecto → Settings → Environment Variables:

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | la key de resend.com/api-keys |
| `CONTACT_TO` | `info@aitorevi.dev` |

Eliminar `CONTACT_TO=aitorevi@gmail.com` del `.env` local (o dejarlo solo para dev).

### 4. Limpiar el endpoint de producción

Una vez verificado el dominio, eliminar el debug log y el fallback de `CONTACT_TO`:

```ts
// Eliminar:
console.error('[contact] Resend error:', error);
// y simplificar:
to: 'info@aitorevi.dev',
```

---

## Archivos implicados

- `src/pages/api/contact.ts` — endpoint servidor
- `src/components/home/ContactSection.astro` — formulario + fetch handler
- `.env` — variables locales (no commiteado)
- `astro.config.mjs` — adapter Vercel configurado

## Verificación final

1. Deploy en Vercel con las env vars configuradas
2. Enviar formulario desde la URL de producción
3. Confirmar que llega a `info@aitorevi.dev`
4. Confirmar que el `Reply-To` funciona (responder al email abre el cliente con el email del remitente)
