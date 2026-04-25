# aitorevi-blog — Claude Code

Blog personal bilingüe (ES/EN) construido con Astro 6, Tailwind v3, TypeScript y Vercel.

## Comandos clave

```bash
npm run dev              # dev server en localhost:4321
npm run test:unit        # vitest (161 tests)
npx astro check          # type-check (0 errores esperados)
npm run build            # check + build + OG images + CV PDF
npm run og:generate      # genera public/og/og-image.png
npm run og:katas         # genera public/og/og-katas.png
```

## Rutas importantes

| Ruta | Qué es |
|---|---|
| `src/pages/` | Páginas ES (raíz) + `en/` para inglés |
| `src/components/` | Atomic design: `atoms/`, `shared/`, `home/`, `cv/`, etc. |
| `src/content/blog/` | Posts en Markdoc con frontmatter tipado |
| `src/i18n/ui.ts` | Todas las traducciones ES/EN |
| `src/lib/` | Utilidades puras y testeadas |
| `src/data/` | Datos del CV y katas |
| `scripts/` | Generación de OG images y CV PDF (Node, one-shot) |
| `public/og/` | OG images generadas (commitear tras `og:generate`) |
| `public/fonts/` | Fuentes self-hosted (Outfit + JetBrains Mono) |

## Alias TypeScript

`@/` → `src/` (configurado en `tsconfig.json`)

## Agentes disponibles

| Agente | Cuándo usarlo |
|---|---|
| `astro-code-reviewer` | Review de código nuevo o refactorizado |
| `astro6-architect` | Decisiones de arquitectura, Content Layer, hidratación |
| `ui-ux-astro-specialist` | Componentes UI, design system, dark mode, animaciones |
| `security-agent` | Antes de merge a main, cambios en deps, Actions, Vercel |
| `claude-code-config` | Auditoría de la configuración de Claude Code |

## Convenciones

- **i18n**: todas las páginas tienen versión ES (`/`) y EN (`/en/`). La clave de idioma se pasa como prop `lang`.
- **Componentes**: los compartidos entre secciones van en `src/components/shared/`.
- **Tests**: `tests/unit/` con vitest. Ejecutar antes de cada PR.
- **OG images**: generadas con satori + resvg. Commitear el PNG resultante.
- **Fuentes CDN en scripts**: siempre pinear versión exacta (e.g., `@5.2.8`), nunca `@latest`.
- **GitHub Actions**: SHA pinning obligatorio, `permissions: contents: read` mínimo.
