# opencleaner-terminal-data

**Issue:** #208 — Datos erróneos open cleaner
**Status:** IN PROGRESS
**Branch:** fix/opencleaner-terminal-data

## Problema

El mock de tipo `terminal` en `/work` muestra datos hardcodeados de `aitorevi.dev` (161 tests, 73 routes, CV PDFs). OpenCleaner también usa `mockType: terminal`, por lo que hereda esos datos incorrectos.

## Solución

Pasar el `id` del proyecto como prop a `ProjectMock.astro` y renderizar contenido de terminal diferente para `opencleaner` vs `self`.

**Datos reales de OpenCleaner** (obtenidos del repo `aitorevi/open-cleaner`):
- 4 use cases: `CheckPermissions`, `FindJunkFiles`, `MoveToTrash`, `ScanApplications`
- 2 ports: `IAppScannerPort`, `IFileSystemPort`
- 2 adapters: `MacOSAppScannerAdapter`, `NodeFileSystemAdapter`
- 3 capas Clean Architecture (domain, use cases, infrastructure)
- Build: `electron-vite build` → typecheck + main + renderer
- Electron 39, React 19

## Solución data-driven (Opción B — aprobada)

El componente `ProjectMock.astro` NO debe conocer IDs de proyectos. El contenido del terminal viaja desde el YAML del proyecto hasta el componente como datos tipados.

### Tipo de línea

```typescript
{ kind: 'cmd' | 'ok' | 'building'; text: string }
// cmd      → "$ {text}"   (slate-500, mt-1 si no es la primera)
// ok       → "{text}"     (emerald-400)
// building → "building <accent>{text}</accent> ..."
// cursor   → siempre al final, renderizado por el componente
```

### Contenido para self.yaml

```yaml
terminalLines:
  - kind: cmd
    text: npm run test:unit
  - kind: ok
    text: "✓ 167 tests passed (12 files)"
  - kind: cmd
    text: npm run build
  - kind: building
    text: aitorevi.dev
  - kind: ok
    text: "  ✓ 73 routes"
  - kind: ok
    text: "  ✓ OG images generated"
  - kind: ok
    text: "  ✓ CV PDFs (es, en)"
  - kind: ok
    text: build complete in 9.2s
```

### Contenido para opencleaner.yaml

```yaml
terminalLines:
  - kind: cmd
    text: npm test
  - kind: ok
    text: "✓ 4 use cases (3 files)"
  - kind: cmd
    text: npm run build:mac
  - kind: building
    text: open-cleaner
  - kind: ok
    text: "  ✓ typecheck passed"
  - kind: ok
    text: "  ✓ main (Electron 39)"
  - kind: ok
    text: "  ✓ renderer (React 19)"
  - kind: ok
    text: build complete in 8.3s
```

## Checklist

- [ ] Añadir `terminalLines` al schema Zod en `src/content.config.ts` (opcional, array de `{kind, text}`)
- [ ] Añadir `terminalLines` a `src/content/projects/self.yaml`
- [ ] Añadir `terminalLines` a `src/content/projects/opencleaner.yaml`
- [ ] En `WorkCinematic.astro`: mapear `terminalLines: p.data.terminalLines` y pasarlo a `<ProjectMock>`
- [ ] En `ProjectMock.astro`: reemplazar la implementación actual (con `projectId`) por renderer data-driven. Sin magic strings, sin `projectId`.
- [ ] `npx astro check` sin errores
- [ ] `npm run test:unit` verde
