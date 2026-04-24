/**
 * Contact Form API — POST /api/contact
 *
 * ─────────────────────────────────────────────
 * FLUJO GENERAL
 * ─────────────────────────────────────────────
 * 1. El cliente envía un JSON con { name, email, subject, message, _trap }.
 * 2. El servidor aplica las capas de seguridad (ver abajo).
 * 3. Si todo es válido, envía dos emails via Resend:
 *    a) Notificación a info@aitorevi.dev con el contenido del mensaje.
 *    b) Confirmación al remitente con un HTML de marca (buildConfirmationHtml).
 *
 * ─────────────────────────────────────────────
 * CAPAS DE SEGURIDAD (en orden de ejecución)
 * ─────────────────────────────────────────────
 * 1. Rate limiting (Upstash Redis)
 *    - 5 envíos por IP por hora, ventana deslizante.
 *    - Si Upstash no está configurado o falla, el request pasa igualmente
 *      (fail-open) para no romper el formulario si el servicio cae.
 *    - Devuelve 429 cuando se supera el límite.
 *
 * 2. Honeypot (_trap)
 *    - Campo oculto que los bots rellenan automáticamente; los humanos no.
 *    - Si llega con valor, se devuelve 200 silencioso (el bot no sabe que fue bloqueado).
 *
 * 3. Límites de longitud
 *    - name ≤ 100 · email ≤ 254 · subject ≤ 200 · message ≤ 5000 caracteres.
 *    - Evita payloads abusivos y agotamiento de cuota en Resend.
 *
 * 4. Limpieza de errores
 *    - Los errores de Resend nunca se exponen al cliente (sin detail: error.message).
 *
 * ─────────────────────────────────────────────
 * SERVICIOS EXTERNOS
 * ─────────────────────────────────────────────
 * Resend (envío de email)
 *   - Dashboard : https://resend.com/emails
 *   - Dominio verificado: aitorevi.dev
 *   - Variable: RESEND_API_KEY
 *
 * Upstash Redis (rate limiting)
 *   - Dashboard : https://console.upstash.com
 *   - Base de datos: la del proyecto aitorevi-blog (tier gratuito, 10k cmds/día)
 *   - Variables: UPSTASH_REDIS_REST_URL · UPSTASH_REDIS_REST_TOKEN
 *   - Las variables deben estar en .env (dev) y en Vercel → Settings → Environment Variables (prod)
 *   - Librería: @upstash/ratelimit + @upstash/redis
 *
 * ─────────────────────────────────────────────
 * VARIABLES DE ENTORNO NECESARIAS
 * ─────────────────────────────────────────────
 * RESEND_API_KEY              → clave API de Resend
 * UPSTASH_REDIS_REST_URL      → endpoint REST de la bbdd Upstash
 * UPSTASH_REDIS_REST_TOKEN    → token de autenticación de Upstash
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const prerender = false;

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function buildConfirmationHtml(name: string, message: string, lang: 'es' | 'en'): string {
  const escapedName = escapeHtml(name);
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const copy = lang === 'en'
    ? {
        htmlLang: 'en',
        title: 'I received your message',
        greeting: `Hi, ${escapedName}.`,
        body: "I've received your message and will get back to you as soon as possible. Here's a copy of what you sent:",
        cta: 'Visit aitorevi.dev',
      }
    : {
        htmlLang: 'es',
        title: 'He recibido tu mensaje',
        greeting: `Hola, ${escapedName}.`,
        body: 'He recibido tu mensaje y te responderé lo antes posible. Aquí tienes una copia de lo que me enviaste:',
        cta: 'Visitar aitorevi.dev',
      };

  return `<!DOCTYPE html>
<html lang="${copy.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${copy.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#020617;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;text-align:center;">
              <span style="font-family:Outfit,system-ui,sans-serif;font-size:28px;font-weight:900;letter-spacing:-0.03em;color:#f1f5f9;">aitorevi</span><span style="font-family:Outfit,system-ui,sans-serif;font-size:28px;font-weight:900;color:#a78bfa;">.</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#0b1120;border:1px solid #1e293b;border-radius:16px;padding:40px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px 0;font-family:Outfit,system-ui,sans-serif;font-size:22px;font-weight:700;color:#f1f5f9;">${copy.greeting}</p>

              <!-- Confirmation -->
              <p style="margin:0 0 32px 0;font-size:15px;line-height:1.6;color:#cbd5e1;">${copy.body}</p>

              <!-- Quote block -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
                <tr>
                  <td style="border-left:3px solid #60a5fa;padding:12px 16px;background-color:#0f1629;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#94a3b8;font-style:italic;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:8px;background-color:#60a5fa;">
                    <a href="https://www.aitorevi.dev/" style="display:inline-block;padding:12px 24px;font-family:Outfit,system-ui,sans-serif;font-size:14px;font-weight:600;color:#020617;text-decoration:none;letter-spacing:0.01em;">${copy.cta}</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                <a href="https://www.aitorevi.dev/" style="color:#475569;text-decoration:none;">aitorevi.dev</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Rate limiter — only active when Upstash env vars are present
function getRatelimiter(): Ratelimit | null {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
  });
}

export const POST: APIRoute = async ({ request }) => {
  // Rate limiting (skipped if Upstash is not configured or unreachable)
  const ratelimiter = getRatelimiter();
  if (ratelimiter) {
    try {
      const forwarded = request.headers.get('x-forwarded-for') ?? '';
      const ip = forwarded.split(',')[0].trim() || 'anonymous';
      const { success } = await ratelimiter.limit(ip);
      if (!success) {
        return new Response(JSON.stringify({ error: 'too_many_requests' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch {
      // Upstash unreachable — allow the request through rather than blocking all traffic
    }
  }

  let data: Record<string, string> = {};
  try {
    const text = await request.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot — bots fill this, humans don't
  if (data._trap) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = (data.name ?? '').toString().trim();
  const email = (data.email ?? '').toString().trim();
  const subject = (data.subject ?? '').toString().trim();
  const message = (data.message ?? '').toString().trim();
  const consent = (data.consent ?? '').toString().trim();
  const lang: 'es' | 'en' = (data.lang ?? '') === 'en' ? 'en' : 'es';

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (consent !== 'true') {
    return new Response(JSON.stringify({ error: 'consent_required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Length limits
  if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 5000) {
    return new Response(JSON.stringify({ error: 'invalid_input' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <noreply@aitorevi.dev>',
    to: 'info@aitorevi.dev',
    ...(isValidEmail ? { replyTo: email } : {}),
    subject: `[Portfolio] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return new Response(JSON.stringify({ error: 'send_failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Confirmation email to the sender
  if (isValidEmail) {
    await resend.emails.send({
      from: 'Aitor Reviriego <noreply@aitorevi.dev>',
      to: email,
      subject: `Re: ${subject}`,
      text: lang === 'en'
        ? `Hi ${name},\n\nI've received your message and will reply as soon as possible.\n\n---\n${message}\n\n---\naitorevi.dev`
        : `Hola ${name},\n\nHe recibido tu mensaje y te responderé lo antes posible.\n\n---\n${message}\n\n---\naitorevi.dev`,
      html: buildConfirmationHtml(name, message, lang),
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
