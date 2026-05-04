# Workspace Workflow

Documento de referencia para gestionar tareas en aitorevi-blog. Inspirado en el workflow de IMS pero adaptado a un proyecto unipersonal.

## Estructura de directorios

```
workspace/
├── WORKFLOW.md       ← este archivo (workflow + plantillas)
├── planning/         ← tareas planificadas, aún no iniciadas
├── progress/         ← tareas en curso (WIP)
├── review/           ← tareas terminadas, esperando revisión final
├── completed/        ← tareas revisadas y cerradas
├── articles/         ← artículos de referencia y recursos (estático)
└── reports/          ← auditorías, deuda técnica, code reviews (estático)
```

## Flujo de tareas

```
planning/ → progress/ → review/ → completed/
```

| Carpeta      | Cuándo está aquí una tarea                       | Cuándo se mueve            |
| ------------ | ------------------------------------------------ | -------------------------- |
| `planning/`  | Tarea definida, aún no aprobada para implementar | Al aprobar el plan          |
| `progress/`  | Implementación en curso                          | Al terminar la implementación |
| `review/`    | Implementación lista, pendiente de revisión final | Tras tu aprobación final   |
| `completed/` | Tarea cerrada                                    | (estado final)             |

## Tipos de tarea

| Tipo            | Descripción                                          | Metodología por defecto              |
| --------------- | ---------------------------------------------------- | ------------------------------------ |
| **Feature**     | Funcionalidad nueva, sección, componente con lógica   | Simplified (SDD opcional, ver abajo) |
| **Operational** | CI/CD, scripts, configuración, dependencias, OG, CV  | Simplified                           |
| **Refactor**    | Reestructuración sin cambio de comportamiento        | Simplified                           |

> **Nota**: en este blog la **Simplified Template** es el flujo por defecto incluso para Features. SDD (Spec → Tests → Impl con dos approval gates) sólo se usa cuando aporta valor — típicamente al tocar `src/lib/` o componentes con lógica que merecen tests unitarios. En cambios visuales, contenido de blog, o ajustes de i18n el flujo simplificado es suficiente.

## Quién hace qué (commits y push)

El flujo usa worktrees: cada tarea vive en su propio directorio hermano del repo. Dentro del worktree **el agente hace los commits** — el usuario no necesita entrar al worktree para nada. El usuario solo hace push y abre el PR desde ahí cuando la tarea está lista.

- **Los agentes ejecutan `git commit`** dentro del worktree tras cada paso natural. Mensaje: solo el nombre del fichero de tarea en kebab-case (ej. `wcag-aaa-compliance`). Sin prefijos, sin cuerpo.
- **Los agentes NO ejecutan `git push`, `gh pr create` ni hacen merge.** Eso lo hace Aitor.
- **Aitor hace push y abre el PR** cuando el agente avisa de que la tarea está lista.
- La skill `/git-commit` sigue disponible para commits manuales puntuales fuera del flujo de worktrees.

---

## Worktrees

Cada tarea se desarrolla en su propio worktree hermano del repo. El directorio principal (`aitorevi-blog/`) queda siempre en master.

### Convención de nombres

| Tipo    | Rama                    | Worktree                              |
| ------- | ----------------------- | ------------------------------------- |
| Feature | `feat/descripcion`      | `../aitorevi-blog-feat-descripcion`   |
| Fix     | `fix/descripcion`       | `../aitorevi-blog-fix-descripcion`    |
| Chore   | `chore/descripcion`     | `../aitorevi-blog-chore-descripcion`  |

### Ciclo de vida

```bash
# Crear (desde el repo principal, en master)
git worktree add -b feat/<nombre> ../aitorevi-blog-feat-<nombre> master

# Listar worktrees activos
git worktree list

# Push y PR (el usuario, desde el worktree o desde cualquier terminal)
cd ../aitorevi-blog-feat-<nombre>
git push -u origin feat/<nombre>
gh pr create

# Al hacer merge del PR, limpiar
git worktree remove ../aitorevi-blog-feat-<nombre>
git branch -d feat/<nombre>
```

---

## Flujo Simplificado (default)

### Fase 1: Plan (único Approval Gate)

Crea un fichero de tarea en `workspace/planning/` con:

- **Contexto**: por qué se hace
- **Scope**: qué entra y qué no
- **Implementation Steps**: checklist accionable
- **Verification**: cómo se confirma que está hecho (build, tests, manual)

Esperas aprobación antes de seguir.

### Fase 2: Implementación

1. Mueve el fichero a `workspace/progress/` con `git mv`, actualiza `Status: IN PROGRESS`.
2. Sigue el checklist. Escribe tests cuando aplique.
3. Tras cada paso lógico completado, **haz un commit** con el nombre del fichero de tarea (ej. `wcag-aaa-compliance`) y **avisa al usuario** con un resumen breve de qué cambió.
4. Verifica que `npx astro check` pasa y `npm run test:unit` está verde.

### Fase 3: Revisión

Revisar con `astro-reviewer` (o el agente que aplique). Corregir críticos antes de cerrar.

### Fase 4: Cierre

1. Mueve el fichero a `workspace/review/`, `Status: REVIEW`. Commitea el movimiento.
2. Ejecuta `npm run build` para verificar compilación, OG images y CV PDF.
3. Notifica que la tarea está lista: resumen de cambios, estado de verificación, rama y ruta del worktree para que el usuario haga push y abra el PR.
4. **El usuario** hace `git push` y abre el PR, espera CI verde y mergea.
5. Tras el merge, limpiar: `git worktree remove ../<worktree>` y `git branch -d <rama>`. Mover el fichero a `workspace/completed/` con `Status: COMPLETED`.
6. Si la tarea es una issue de GitHub: el usuario cierra la issue.

---

## Flujo SDD (opcional, sólo cuando aporta valor)

Útil al añadir lógica a `src/lib/`, scripts no triviales o componentes con comportamiento testeable.

### Fase 1: Spec (Approval Gate 1)

Fichero en `workspace/planning/` con:

- **Acceptance Criteria**: GIVEN [precondición] → WHEN [acción] → THEN [resultado], con IDs `AC-1`, `AC-2`...
- **Contracts**: interfaces TypeScript, signatures, esquemas Zod
- **Test Skeletons**: bloques `describe/it` de Vitest mapeados 1:1 a los ACs (esqueletos, no implementaciones)

Espera aprobación de la Spec.

### Fase 2: Plan (Approval Gate 2)

Sin tocar la Spec, completa:

- **Implementation Plan**: checklist con archivos y pasos concretos
- **Testing Plan**: resumen de categorías (unit, integration si aplica)

Espera aprobación del Plan.

### Fase 3: Implementación (TDD estricto)

1. Mueve a `workspace/progress/`, `Status: IN PROGRESS`.
2. **RED**: convierte test skeletons en tests reales. Todos deben fallar. Commitea con el nombre del plan y avisa al usuario.
3. **GREEN**: implementa siguiendo el plan. Tras cada paso completado, commitea con el nombre del plan y avisa brevemente.
4. **Refactor** manteniendo verde. Commitea y avisa al terminar.
5. Verifica que cada AC tiene al menos un test pasando.

### Fase 4 y 5: Igual que el flujo simplificado.

En particular, **el cierre (commit, push, PR, CI verde, merge) lo realiza siempre el usuario**.

---

## Plantillas

### Plantilla Simplified (default)

```markdown
# [Título de la tarea]

## Contexto

Por qué se hace.

## Scope

Qué entra y qué no.

## Implementation Steps

- [ ] Step 1: ...
- [ ] Step 2: ...

## Verification

- [ ] `npx astro check` sin errores
- [ ] `npm run test:unit` verde
- [ ] `npm run build` pasa
- [ ] Verificación manual: [describir]

## Progress

- [ ] Plan aprobado
- [ ] Rama creada
- [ ] Implementación completa
- [ ] Verificado
- [ ] Code review pasado
- [ ] Commit + PR + CI verde + merge (lo hace el usuario)

## Status: PLANNING
```

### Plantilla Feature SDD (opcional)

```markdown
# [Título de la tarea]

## Contexto

Por qué se hace.

## Scope

Qué entra y qué no.

## Spec

### Acceptance Criteria

- **AC-1**: [Nombre descriptivo]
  - GIVEN [precondición]
  - WHEN [acción]
  - THEN [resultado esperado]

### Contracts

[Interfaces TypeScript, signatures, esquemas Zod]

### Test Skeletons

[Bloques describe/it de Vitest con asserts comentadas. 1:1 con los ACs.]

## Implementation Plan

- [ ] Step 1: ...
- [ ] Step 2: ...

## Testing Plan

[Resumen de tests unit / integration]

## Progress

- [ ] Spec aprobada
- [ ] Plan aprobado
- [ ] Rama creada
- [ ] Tests de aceptación escritos (RED)
- [ ] Implementación completa (GREEN)
- [ ] Refactor
- [ ] Tests pasando
- [ ] Build pasando
- [ ] Code review pasado
- [ ] Commit + PR + CI verde + merge (lo hace el usuario)

## Status: PLANNING
```

---

## Reglas

1. **Un fichero por tarea**. Nombre en kebab-case: `add-skills-section-homepage.md`.
2. **El campo `Status:` debe coincidir con la carpeta**:
   - `planning/` → `Status: PLANNING`
   - `progress/` → `Status: IN PROGRESS`
   - `review/` → `Status: REVIEW`
   - `completed/` → `Status: COMPLETED`
3. **Actualiza `Status:` siempre que muevas un fichero**.
4. **No archivos sueltos en `workspace/`**. Auditorías y reportes van en `reports/`.
5. **Movimientos sólo con `git mv`** para preservar historial.
6. **Workflow opcional, no obligatorio**. Para hotfixes triviales o cambios de un par de líneas no merece la pena crear un fichero. Úsalo cuando aporta trazabilidad.
7. **Dentro del worktree, el agente hace los commits** tras cada paso natural (mensaje: nombre del fichero de tarea en kebab-case). **Push, PR y merge los hace siempre el usuario.**

## Convenciones de idioma

- **Documentos en `workspace/`**: español.
- **Código, tests, comentarios técnicos**: inglés.
- **Mensajes de commit**: inglés (Conventional Commits).

## Comandos de verificación habituales

```bash
npm run dev              # dev server
npm run test:unit        # vitest
npx astro check          # type check (0 errores esperados)
npm run build            # check + build + OG images + CV PDF
npm run og:generate      # solo OG image principal
npm run og:katas         # solo OG image de katas
```

## Agentes disponibles

- `astro-architect` — decisiones de arquitectura, Content Layer, hidratación. Útil como planner.
- `astro-developer` — implementador (Sonnet). Ejecuta planes aprobados paso a paso, deteniéndose en puntos naturales para que el usuario commitee atómicamente. No ejecuta `git commit` ni propone wording de mensajes.
- `astro-reviewer` — review de código nuevo o refactorizado.
- `astro-designer` — componentes UI, design system, dark mode, animaciones.
- `security` — antes de merge a main, cambios en deps, Actions, Vercel.
- `claude-code-config` — auditoría de la configuración de Claude Code.

## Directorios estáticos (no participan en el flujo)

- **`articles/`** — artículos y tutoriales de referencia.
- **`reports/`** — auditorías, code reviews, deuda técnica.
