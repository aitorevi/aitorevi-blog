import { defineMiddleware } from 'astro:middleware';

const KEYSTATIC_SAVE_FEEDBACK_SCRIPT = `
<script>
(function() {
  if (window.__keystaticFeedbackInstalled) return;
  window.__keystaticFeedbackInstalled = true;
  console.log('[ks-toast] installed');

  var SAVING_SELECTOR = '[aria-label="Saving changes"]';

  function ensureToastContainer() {
    var el = document.getElementById('ks-toast');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'ks-toast';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;padding:14px 20px;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px;font-weight:500;color:#fff;background:#16a34a;box-shadow:0 10px 30px rgba(0,0,0,0.35);opacity:0;transform:translateY(20px);transition:opacity .25s ease,transform .25s ease;pointer-events:none;max-width:360px';
    document.body.appendChild(el);
    return el;
  }

  function showToast(message) {
    var el = ensureToastContainer();
    el.textContent = message;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    clearTimeout(el.__t);
    el.__t = setTimeout(function() {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    }, 2500);
  }

  function hasUnsavedBadge() {
    var nodes = document.querySelectorAll('span,div');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.children.length === 0 && n.textContent === 'Unsaved') return true;
    }
    return false;
  }

  var wasSaving = false;
  var observer = new MutationObserver(function() {
    var saving = !!document.querySelector(SAVING_SELECTOR);
    if (saving && !wasSaving) {
      wasSaving = true;
      return;
    }
    if (!saving && wasSaving) {
      wasSaving = false;
      setTimeout(function() {
        if (!hasUnsavedBadge()) showToast('\u2713 Saved');
      }, 120);
    }
  });

  function start() {
    observer.observe(document.body, { subtree: true, childList: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
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
  // Keystatic's SSR response has no </body> to anchor against — it's a
  // minimal shell that mounts a client:only React app. Append at the end.
  const injected = html.includes('</body>')
    ? html.replace('</body>', `${KEYSTATIC_SAVE_FEEDBACK_SCRIPT}</body>`)
    : html + KEYSTATIC_SAVE_FEEDBACK_SCRIPT;

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-type', 'text/html; charset=utf-8');

  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
