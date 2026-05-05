# simplify-contact-form

**Issue**: #199
**Rama**: `fix/simplify-contact-form`
**Worktree**: `../aitorevi-blog-fix-simplify-contact-form`
**Status**: REVIEW

## Contexto

El formulario de contacto incluye textos de ayuda por campo (`nameHelp`, `emailHelp`, `subjectHelp`, `messageHelp`) y un paso de revisión/confirmación antes del envío, ambos añadidos para cumplir WCAG AAA (SC 3.3.6). El objetivo de accesibilidad pasa a ser AA, por lo que estos elementos son innecesarios y añaden carga visual.

**Decisión sobre la validación previa**: Se elimina el paso de revisión. WCAG AA (SC 3.3.4) solo exige error prevention para transacciones legales/financieras o con consecuencias graves. Enviar un email de contacto no entra en ese ámbito. La validación de campos en blur + mensajes de error claros es suficiente para AA.

## Archivos afectados

- `src/components/home/ContactSection.astro` — eliminar `<p id="*-help">` y el `<section id="contact-review">`, simplificar el script
- `src/i18n/messages/home.ts` — eliminar claves `nameHelp`, `emailHelp`, `subjectHelp`, `messageHelp`, `review.title`, `review.edit`, `review.confirm` (ES + EN)

## Checklist

- [x] Eliminar los 4 `<p id="*-help">` del markup y sus `aria-describedby` correspondientes
- [x] Eliminar el `<section id="contact-review">` completo del markup
- [x] Simplificar el script: eliminar `showReview`, `sendForm` → `onSubmit` llama directamente al fetch
- [x] Eliminar referencias a `backBtn`, `confirmBtn`, `reviewSection` del script
- [x] Limpiar en `home.ts` (ES + EN): claves `home.contact.nameHelp/emailHelp/subjectHelp/messageHelp` y `home.contact.review.*`
- [x] `npx astro check` — 0 errores
- [x] `npm run test:unit` — todos los tests pasan
