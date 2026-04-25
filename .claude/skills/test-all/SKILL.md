---
name: test-all
description: Runs the full quality check suite (type check + unit tests) and reports a summary
userInvocable: true
---

# test-all

Ejecuta el ciclo completo de verificación de calidad del proyecto.

## Steps

1. Run `npx astro check` — type-check all .astro, .ts and .tsx files
2. Run `npm run test:unit` — vitest unit test suite
3. Report results: pass/fail counts, any errors, and overall status

## Expected output

- `npx astro check` → 0 errors, 0 warnings
- `npm run test:unit` → 161 tests passing

If anything fails, show the error output and suggest the likely fix.
