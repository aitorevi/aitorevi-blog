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

## Checklist

- [ ] Añadir prop `projectId?: string` a `ProjectMock.astro`
- [ ] En `WorkCinematic.astro`, pasar `projectId={p.id}` a `<ProjectMock>`
- [ ] En `ProjectMock.astro`, renderizar terminal diferente si `projectId === 'opencleaner'`
- [ ] Verificar que el mock de `self` (aitorevi.dev) sigue mostrando sus datos correctos
- [ ] `npx astro check` sin errores
- [ ] `npm run test:unit` verde
