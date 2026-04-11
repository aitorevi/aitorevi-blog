import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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
  const name = (data.name ?? '').toString().trim();
  const email = (data.email ?? '').toString().trim();
  const subject = (data.subject ?? '').toString().trim();
  const message = (data.message ?? '').toString().trim();

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
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
    return new Response(JSON.stringify({ error: 'send_failed', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
