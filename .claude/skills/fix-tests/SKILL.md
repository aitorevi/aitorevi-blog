---
name: fix-tests
description: Analiza y arregla tests rotos en el blog (Vitest unit tests + astro check)
argument-hint: "[ruta del archivo de test o 'all']"
userInvocable: true
---

# Fix Failing Tests

Diagnostica y arregla tests rotos. El blog sólo tiene tests unitarios con Vitest y verificación de tipos con `astro check` — nada de integration o E2E.

## Steps

1. **Ejecutar la suite y capturar fallos**:
   - `npm run test:unit` para los tests unitarios.
   - `npx astro check` para errores de tipos.
   - Si `$ARGUMENTS` apunta a un archivo, ejecutar sólo ese: `npx vitest run <ruta>`.
   - Capturar el output completo con stack traces.

2. **Analizar los fallos**:
   - Identificar causa raíz desde los mensajes de error y los stack traces.
   - Clasificar:
     - Bug en la lógica de producción (`src/`).
     - Test mal escrito (assertion incorrecta, setup que no aplica).
     - Problema de async/timing (await olvidado, microtasks pendientes).
     - Fixture o data mock obsoleto.
     - Flake (retries, fechas, locales, ordering).
     - Cambio de API en una dependencia tras un upgrade.
     - Type error que el test ya no compila.

3. **Leer los archivos relevantes**:
   - El test que falla (`tests/unit/<file>.test.ts`).
   - El módulo bajo prueba en `src/lib/`, `src/components/` o `src/data/`.
   - Entender comportamiento esperado vs comportamiento actual.

4. **Explicar al usuario antes de arreglar**:
   - Qué falla y por qué.
   - Si la solución es modificar el test o el código de producción.
   - Si la decisión no es obvia, pregunta al usuario qué prefiere.

5. **Aplicar el fix**:
   - Hacer el cambio mínimo que arregle el fallo.
   - Re-ejecutar `npm run test:unit` y `npx astro check`.
   - Asegurarse de que todos los tests pasan.

6. **Verificar que no hay regresión**:
   - `npm run test:unit` → verde.
   - `npx astro check` → 0 errores.
   - `npm run build` → pasa (incluye OG y CV PDF).

## Convenciones de tests del blog

- Localización: `tests/unit/` con extensión `.test.ts`.
- Estructura: bloques `describe()` / `it()` con nombres descriptivos en inglés.
- Tests aislados, sin estado compartido entre tests.
- Mocks mínimos — preferir tests sobre lógica pura en `src/lib/`.
- Esperado en verde: 161 tests (a menos que se haya añadido una nueva suite recientemente).

## Reglas

- Nunca romper otros tests al arreglar uno.
- Si el cambio toca producción, documentar el "why" en el commit (`fix(scope): ...`).
- Si sólo se reescribe el test, prefijo `test(scope): ...`.
- Cuerpo del commit en español, sin atribuciones a Claude.
