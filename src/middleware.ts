import { defineMiddleware } from 'astro:middleware';

const KEYSTATIC_SAVE_FEEDBACK_SCRIPT = `
<script>
(function() {
  if (window.__keystaticFeedbackInstalled) return;
  window.__keystaticFeedbackInstalled = true;

  function ensureToastContainer() {
    let el = document.getElementById('ks-toast');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'ks-toast';
    el.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:99999',
      'padding:14px 20px',
      'border-radius:10px',
      'font-family:system-ui,sans-serif',
      'font-size:14px',
      'font-weight:500',
      'color:#fff',
      'box-shadow:0 10px 30px rgba(0,0,0,0.35)',
      'opacity:0',
      'transform:translateY(20px)',
      'transition:opacity .25s ease,transform .25s ease',
      'pointer-events:none',
      'max-width:360px',
    ].join(';');
    document.body.appendChild(el);
    return el;
  }

  function showToast(message, kind) {
    const el = ensureToastContainer();
    el.textContent = message;
    el.style.background = kind === 'error' ? '#dc2626' : '#16a34a';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    clearTimeout(el.__t);
    el.__t = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    }, 2800);
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const isGithubGraphql = url.indexOf('api.github.com/graphql') !== -1;
    let isCommitMutation = false;
    if (isGithubGraphql && init && init.body) {
      try {
        const body = typeof init.body === 'string' ? init.body : '';
        if (body.indexOf('createCommitOnBranch') !== -1) {
          isCommitMutation = true;
        }
      } catch (_) {}
    }

    const response = await originalFetch(input, init);

    if (isCommitMutation) {
      const clone = response.clone();
      clone.json().then(function(data) {
        const errors = (data && data.errors) || null;
        const commitCreated = !!(data && data.data && data.data.createCommitOnBranch && data.data.createCommitOnBranch.commit);
        if (commitCreated && !errors) {
          showToast('✓ Saved — committed to GitHub', 'success');
        } else if (errors && errors.length) {
          showToast('✗ Save failed: ' + (errors[0].message || 'unknown error'), 'error');
        }
      }).catch(function() {});
    }

    return response;
  };
})();
</script>
`;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (!context.url.pathname.startsWith('/keystatic')) {
    return response;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const injected = html.replace('</body>', `${KEYSTATIC_SAVE_FEEDBACK_SCRIPT}</body>`);

  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
