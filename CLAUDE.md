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
| `src/content/blog/` | Posts en Markdown con frontmatter tipado |
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
| `astro-architect` | Decisiones de arquitectura, Content Layer, hidratación, planner |
| `astro-developer` | Implementación de planes aprobados; se detiene en puntos naturales para que el usuario commitee (Sonnet) |
| `astro-reviewer` | Review de código nuevo o refactorizado |
| `astro-designer` | Componentes UI, design system, dark mode, animaciones |
| `security` | Antes de merge a main, cambios en deps, Actions, Vercel |
| `claude-code-config` | Auditoría de la configuración de Claude Code |

## Convenciones

- **i18n**: todas las páginas tienen versión ES (`/`) y EN (`/en/`). La clave de idioma se pasa como prop `lang`.
- **Componentes**: los compartidos entre secciones van en `src/components/shared/`.
- **Tests**: `tests/unit/` con vitest. Ejecutar antes de cada PR.
- **OG images**: generadas con satori + resvg. Commitear el PNG resultante.
- **Fuentes CDN en scripts**: siempre pinear versión exacta (e.g., `@5.2.8`), nunca `@latest`.
- **GitHub Actions**: SHA pinning obligatorio, `permissions: contents: read` mínimo.

## Task workflow

Para tareas no triviales, usar el flujo definido en `workspace/WORKFLOW.md`:

```
workspace/planning/ → workspace/progress/ → workspace/review/ → workspace/completed/
```

Por defecto se usa la **Plantilla Simplified** (un único approval gate). El flujo SDD con TDD estricto es opcional y sólo se aplica cuando aporta valor (lógica en `src/lib/`, scripts no triviales, componentes con comportamiento testeable). Documentos en `workspace/` en español; código en inglés.

Para hotfixes triviales no es necesario crear un fichero de tarea.

### Commits, push, PR y merge

- **Los agentes y skills NO ejecutan `git commit`, `git push`, `gh pr create` ni `gh pr merge`.** Preparan el código, se detienen en puntos naturales de corte y avisan al usuario con un resumen.
- **Aitor (el usuario) hace los commits, push, abre PR y mergea**, y **redacta él mismo los mensajes de commit**. Estilo: muchos commits pequeños y atómicos.
- Excepción: la skill `/git-commit` sí ejecuta `git commit` porque el usuario la invoca explícitamente para ese fin.
