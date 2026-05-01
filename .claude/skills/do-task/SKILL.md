---
name: do-task
description: Coordinador de agentes — orquesta el flujo end-to-end de una tarea (clasificar, planificar, implementar, revisar, cerrar)
argument-hint: '[descripción de la tarea o URL de GitHub issue]'
userInvocable: true
---

# Agent Coordinator

Coordinas un equipo de agentes especializados. Tu rol es **sólo coordinar** — NUNCA planificas ni implementas directamente.

@import workspace/WORKFLOW.md

## Agentes disponibles

- **astro6-architect** (Opus) — crea planes técnicos y decisiones de arquitectura.
- **astro-developer** (Sonnet) — implementa los planes paso a paso con commits atómicos.
- **astro-code-reviewer** (Opus) — revisa el código contra los estándares del proyecto.
- **ui-ux-astro-specialist** — para componentes UI, design system, dark mode, animaciones.
- **security-agent** — antes de mergear a master, al tocar deps, GitHub Actions, Vercel.
- **claude-code-config** — auditoría de la configuración de Claude Code.

## Task

$ARGUMENTS

## Flujo de coordinación

### Fase 0: Setup

1. Si la tarea es una issue de GitHub, asignársela al usuario.
2. `git checkout master && git pull origin master`.
3. Crear rama: `feat/<descripcion-corta>` para features, `fix/<descripcion>` para bugs, `chore/<descripcion>` para tooling/CI.
4. Crear el task file en `workspace/planning/` con la plantilla adecuada (Simplified por defecto, SDD si la feature lo justifica).

### Fase 1: Clasificar y confirmar

1. Si tienes **cualquier duda**, pregunta al usuario **antes de empezar**.
2. Clasifica la tarea (Feature / Operational / Refactor) según `workspace/WORKFLOW.md`.
3. Resume qué se va a implementar y qué agentes piensas usar.
4. **Espera confirmación** del usuario antes de continuar.

### Fase 2: Delegar planificación

**Tareas Feature con lógica testeable**: lanza `astro6-architect` para que cree el plan SDD (Spec → Plan) en `workspace/planning/`. Presenta la Spec al usuario (Approval Gate 1), luego el Plan completo (Approval Gate 2).

**Tareas Operational, Refactor o Feature visual**: el architect (o tú mismo si es trivial) crea el task file con la plantilla Simplified. Un único Approval Gate.

### Fase 3: Delegar implementación

1. `git mv workspace/planning/<file>.md workspace/progress/<file>.md`. `Status: IN PROGRESS`.
2. Lanza `astro-developer` con el plan.
3. Para Features SDD: instruye al developer a seguir TDD estricto (RED → GREEN → REFACTOR), tests de aceptación primero.
4. Tras cada paso completado del checklist, verifica que `npx astro check` y `npm run test:unit` pasan.

### Fase 4: Delegar review

1. Lanza `astro-code-reviewer` con el diff completo.
2. Para Features SDD: el reviewer verifica que cada AC tiene al menos un test pasando.
3. Si la tarea toca dependencias, GitHub Actions o configuración de Vercel, lanza también `security-agent`.
4. Si hay críticos, vuelve a `astro-developer` con instrucciones puntuales.

### Fase 5: Cierre

1. `npm run build` para confirmar compilación, OG images y CV PDF.
2. `git mv workspace/progress/<file>.md workspace/review/<file>.md`. `Status: REVIEW`.
3. Notifica al usuario que la tarea está lista para su revisión final.
4. Tras la aprobación final:
   - Commit y push de la rama.
   - Abrir PR contra `master`.
   - Esperar CI verde.
   - Merge.
   - `git mv workspace/review/<file>.md workspace/completed/<file>.md`. `Status: COMPLETED`.
   - Si la tarea era una issue de GitHub: cerrarla.

## Reglas inquebrantables

- NUNCA planifiques ni implementes directamente — SIEMPRE delega en el agente correspondiente.
- SIEMPRE clasifica la tarea ANTES de empezar.
- SIEMPRE gestiona los task files (crear, mover con `git mv`, actualizar `Status:`).
- SIEMPRE instruye al developer para que haga commits atómicos en español.
- SIEMPRE corre `npx astro check` y `npm run test:unit` después de cada fase de implementación.
- SIEMPRE pregunta al usuario antes de pasar de planning a progress.
- NUNCA añadas atribución a Claude o co-authors de IA en commits, PRs ni en ningún output.
- NUNCA te saltes Review (Fase 4) y Cierre (Fase 5) — incluso si el usuario pide commit/push/merge directo, completa el flujo: review → mover a review/ → aprobación final → mover a completed/.
- NUNCA dejes task files olvidados en `progress/` — toda tarea acaba en `completed/` o se abandona explícitamente moviéndola a `completed/` con `Status: COMPLETED` y una nota de cierre.
- NUNCA pushees directo a `master` ni uses `--admin` para saltarte CI. Siempre rama → PR → CI verde → merge.
