---
name: refactor
description: Refactor de código siguiendo Sustainable Code y Clean Code, manteniendo el comportamiento intacto
argument-hint: '[ruta de archivo o componente]'
userInvocable: true
---

# Refactor

Aplica refactors siguiendo Sustainable Code (Carlos Blé) y Clean Code, sin cambiar el comportamiento observable.

## Steps

1. **Identificar el target**:
   - Si `$ARGUMENTS` apunta a un archivo o componente, úsalo. Si no, pregunta o analiza el repo buscando malos olores:
     - Funciones largas (>15 líneas).
     - Demasiadas responsabilidades en un componente.
     - Duplicación.
     - Nombres poco claros.
     - Acoplamiento innecesario.

2. **Asegurar cobertura de tests previa**:
   - Ejecuta `npm run test:unit` — todos los tests deben pasar antes de empezar.
   - Si la zona a refactorizar no tiene tests, **escríbelos primero** y haz commit aparte (`test(scope): add tests for <area>`) antes de refactorizar.
   - `npx astro check` debe estar en 0 errores.

3. **Planificar el refactor**:
   - Identifica el smell concreto.
   - Elige la técnica: Extract Function, Extract Component, Rename, Simplify Conditionals, Inline, Replace Conditional with Polymorphism, etc.
   - Explica el plan al usuario antes de tocar código.

4. **Aplicar el refactor de forma incremental**:
   - UN cambio pequeño cada vez.
   - Tras cada cambio: `npm run test:unit` debe quedar verde.
   - Commits atómicos con prefijo `refactor(scope):` (cuerpo en español, sin atribuciones a Claude).
   - Principios:
     - Nombres claros, humanos.
     - Funciones pequeñas y enfocadas.
     - Estilo funcional para operaciones sobre arrays.
     - Reutilizar componentes compartidos en `src/components/shared/`.

5. **Verificar que el comportamiento no cambia**:
   - `npm run test:unit` verde.
   - `npx astro check` sin errores.
   - `npm run build` pasa (incluyendo OG images y CV PDF).
   - No se añade ni se elimina funcionalidad.

## Patrones del blog

- **Extract Component**: divide componentes Astro grandes en piezas más pequeñas dentro del directorio de su sección (`home/`, `cv/`, `katas/`, etc.) o en `shared/` si se reutilizan.
- **Extract Logic**: lleva lógica pura de un componente a `src/lib/` con tests unitarios.
- **Extract Data**: si un componente lleva datos hardcoded que se reutilizan, muévelos a `src/data/`.
- **Tipos compartidos**: extrae interfaces y tipos a `src/types/` o al archivo `types.ts` cercano.
- **i18n**: si un string aparece más de una vez, llévalo a `src/i18n/ui.ts` (siempre en `es` y `en`).

## Reglas

- Los tests DEBEN pasar antes de empezar y mantenerse verdes durante todo el refactor.
- Nada de funcionalidad nueva durante un refactor.
- Pasos pequeños con ejecución frecuente de tests.
- Código y comentarios técnicos en inglés; mensajes de commit en español.
- Sin atribución a Claude en ningún commit.
