---
name: code-review
description: Revisa cambios de código en el blog (calidad, seguridad, accesibilidad, design system, i18n)
argument-hint: "[ruta de archivo, número de PR, o 'recent changes']"
userInvocable: true
---

# Code Review

Revisa cambios de código contra los estándares del blog. Delega siempre en `astro-reviewer` y, según el alcance, también en otros agentes.

## Steps

1. **Identificar qué revisar**:
   - Si `$ARGUMENTS` es una ruta de archivo: revisar ese archivo.
   - Si es un número de PR: usar `gh pr diff <num>` para obtener el diff.
   - Si es `recent changes` o vacío: `git diff HEAD~1`.
   - Si hay cambios sin commitear: `git diff` y/o `git diff --cached`.

2. **Delegar al agente principal**:
   - Lanzar `astro-reviewer` con el diff o las rutas afectadas.
   - El agente produce un reporte estructurado.

3. **Delegar a agentes adicionales según el alcance**:
   - **`security`** si los cambios tocan:
     - Dependencias (`package.json`, `package-lock.json`).
     - GitHub Actions (`.github/workflows/`).
     - Configuración de Vercel (variables, headers, middleware).
     - Generación de OG images (Satori) o CV PDF (Playwright en scripts).
     - Formularios o islas React con input de usuario.
   - **`astro-designer`** si los cambios introducen o modifican componentes UI, animaciones, design system o dark mode.
   - Lanzar los agentes en paralelo cuando aplique.

4. **Presentar el reporte consolidado**:
   - **Críticos** (bloquean merge).
   - **Mayores** (deberían arreglarse antes de merge).
   - **Menores** (mejoras opcionales).
   - **Positivos** (qué se ha hecho bien).

5. **Si hay issues**:
   - Preguntar al usuario si quiere arreglarlos ahora.
   - Si sí, lanzar `astro-developer` con instrucciones puntuales.
   - Re-ejecutar la review tras los fixes.

## Estándares del blog

### Calidad de código

- Código auto-documentado (comentarios sólo para WHY no obvio, nunca WHAT).
- Tipos TypeScript explícitos (jamás `any` sin justificación).
- Estilo funcional: `.map()`, `.filter()`, `.reduce()` sobre `for` loops cuando aporte claridad.
- Nullish coalescing (`??`) cuando sólo `null`/`undefined` deba activarlo.

### Arquitectura

- Atomic design: `src/components/{atoms,shared,home,cv,...}`.
- Lógica pura en `src/lib/` con tests unitarios.
- Datos estáticos en `src/data/`.
- Alias `@/` → `src/`.
- Astro estático/SSR-first; islands sólo cuando hace falta interactividad.

### i18n

- Toda página tiene versión ES (`/`) y EN (`/en/`).
- Strings en `src/i18n/ui.ts` con bloques `es` y `en` paralelos — añadir un string a un bloque exige añadirlo al otro.
- Posts del blog en `src/content/blog/` con `lang` en frontmatter.

### Accesibilidad

- WCAG 2.1 AA mínimo.
- HTML semántico, alt en imágenes, focus visible.
- Contraste suficiente en light y dark mode.

### Estilo

- Tailwind v3, mobile-first.
- Toda clase `bg-*` claro debe tener variante `dark:` correspondiente.
- Tokens en `tailwind.config.cjs`.

### Tests

- Tests unitarios en `tests/unit/*.test.ts` para lógica nueva o modificada en `src/lib/`.
- Nombres descriptivos en inglés.
- 161 tests es la línea base (a menos que se haya añadido cobertura nueva).

### CI / Build

- `npx astro check` debe pasar con 0 errores.
- `npm run build` debe compilar incluyendo OG images y CV PDF.
- En GitHub Actions: SHA pinning obligatorio, `permissions: contents: read` mínimo.
- Fuentes en CDN siempre con versión exacta (`@5.2.8`), nunca `@latest`.
