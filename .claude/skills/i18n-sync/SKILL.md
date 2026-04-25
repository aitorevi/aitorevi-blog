---
name: i18n-sync
description: Validates ES/EN translation parity in ui.ts and checks blog posts for missing counterparts
userInvocable: true
---

# i18n-sync

Valida que las traducciones ES/EN estén sincronizadas.

## Steps

1. Read `src/i18n/ui.ts` and extract all translation keys for `es` and `en`
2. Report keys present in `es` but missing in `en` (and vice versa)
3. List blog posts in `src/content/blog/` and group by slug — flag slugs that only exist in one language
4. Report summary: N keys in sync, M keys missing, P posts without counterpart

## What good looks like

- Every key in `es` has an `en` counterpart with the same key name
- Every blog post slug has both an ES and EN version (or is explicitly draft-only in one language)

## Notes

- Translation keys follow the pattern `'section.subsection.key'`
- Blog post language is determined by the `lang` field in frontmatter, not the file path
