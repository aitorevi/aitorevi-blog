import { describe, it, expect, vi, beforeEach } from 'vitest';
import { escapeHtml, buildConfirmationHtml, POST } from '../src/pages/api/contact';

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------
describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe("it&#x27;s");
  });

  it('handles a full XSS payload', () => {
    const input = '<img src=x onerror="alert(\'xss\')">';
    const result = escapeHtml(input);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('"');
  });

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// buildConfirmationHtml
// ---------------------------------------------------------------------------
describe('buildConfirmationHtml', () => {
  it('contains the user name in EN email', () => {
    const html = buildConfirmationHtml('Alice', 'Hello!', 'en');
    expect(html).toContain('Alice');
    expect(html).toContain('Hi, Alice');
  });

  it('contains the user name in ES email', () => {
    const html = buildConfirmationHtml('Bob', 'Hola!', 'es');
    expect(html).toContain('Hola, Bob');
  });

  it('uses lang="en" in html tag for EN', () => {
    const html = buildConfirmationHtml('Alice', 'msg', 'en');
    expect(html).toContain('lang="en"');
  });

  it('uses lang="es" in html tag for ES', () => {
    const html = buildConfirmationHtml('Bob', 'msg', 'es');
    expect(html).toContain('lang="es"');
  });

  it('escapes XSS in name', () => {
    const html = buildConfirmationHtml('<script>bad</script>', 'msg', 'en');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('contains the message content', () => {
    const html = buildConfirmationHtml('Alice', 'My message here', 'en');
    expect(html).toContain('My message here');
  });
});

// ---------------------------------------------------------------------------
// POST handler — with mocked external services
// ---------------------------------------------------------------------------

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn().mockImplementation(() => ({
    limit: vi.fn().mockResolvedValue({ success: true }),
  })),
  // static method stub
}));

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(),
}));

function makeRequest(body: Record<string, unknown>, headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: 'Alice',
  email: 'alice@example.com',
  subject: 'Hello',
  message: 'This is a test message that is long enough.',
  lang: 'en',
};

describe('POST /api/contact — handler', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
  });

  it('returns 200 when honeypot (_trap) is filled', async () => {
    const req = makeRequest({ ...validBody, _trap: 'bot-value' });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it('returns 400 for missing required fields', async () => {
    const req = makeRequest({ name: 'Alice' });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('missing_fields');
  });

  it('returns 400 when name exceeds 100 characters', async () => {
    const req = makeRequest({ ...validBody, name: 'a'.repeat(101) });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_input');
  });

  it('returns 400 when message exceeds 5000 characters', async () => {
    const req = makeRequest({ ...validBody, message: 'x'.repeat(5001) });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_input');
  });

  it('returns 400 for malformed JSON', async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: 'not-json',
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_json');
  });

  it('returns 500 when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const req = makeRequest(validBody);
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('server_misconfigured');
  });

  it('returns 200 on successful send', async () => {
    const req = makeRequest(validBody);
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it('returns 500 when Resend returns an error', async () => {
    const { Resend } = await import('resend');
    (Resend as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ error: { message: 'fail' } }),
      },
    }));
    const req = makeRequest(validBody);
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('send_failed');
  });
});
