---
name: docs
description: Crea o actualiza documentación del blog con diagramas Mermaid en workspace/articles/ o workspace/reports/
argument-hint: '[feature, proceso o arquitectura a documentar]'
userInvocable: true
---

# Documentación

Crea documentación con diagramas (Mermaid) para features, procesos, arquitectura o auditorías del blog.

## Steps

1. **Entender qué documentar**:
   - Si `$ARGUMENTS` lo describe, úsalo. Si no, pregunta:
     - ¿Qué se quiere documentar? (feature, proceso, arquitectura, troubleshooting, auditoría)
     - ¿Quién es la audiencia? (futuro yo, lector del blog, agente)
   - Decide si va a `workspace/articles/` (referencia / tutorial / nota técnica) o a `workspace/reports/` (auditoría, deuda técnica, code review extendido).

2. **Recopilar contexto**:
   - Leer el código relevante en `src/`.
   - Revisar documentación existente en `workspace/articles/`, `workspace/reports/` y `CLAUDE.md`.
   - Identificar dependencias y flujos.

3. **Decidir si hacen falta diagramas**:
   - **Arquitectura**: componentes, capas, módulos.
   - **Secuencia**: flujos entre piezas (build, despliegue, generación de OG/CV).
   - **Estado**: transiciones (lifecycle de un task file en el WORKFLOW: planning → progress → review → completed).
   - **Flowchart**: árboles de decisión (cuándo Simplified vs SDD).

4. **Estructura del documento**:
   - Título.
   - Contexto / motivación.
   - Visión general (1 párrafo).
   - Arquitectura / diseño (con diagrama si aporta).
   - Flujo paso a paso.
   - Ejemplos de uso.
   - Referencias internas (otros docs, código, issues).

5. **Mermaid**:
   - Un concepto por diagrama.
   - Etiquetas claras y cortas.
   - Sólo lo relevante; lo accesorio fuera.

6. **Enlazar**:
   - Referencias cruzadas con `[texto](ruta-relativa)`.
   - Si es una feature mayor, valorar añadir un puntero en `CLAUDE.md` (preguntando antes).

## Localizaciones

- `workspace/articles/` — artículos de referencia, tutoriales, decisiones técnicas duraderas.
- `workspace/reports/` — auditorías, code reviews extendidas, análisis de deuda técnica.
- `workspace/planning/` — **NO** usar para docs; reservado para task files del WORKFLOW.

## Reglas

- Los documentos en `workspace/` se escriben en **español** (con tildes correctas).
- Los comentarios técnicos dentro de código siguen en inglés.
- Los diagramas simplifican; si no aclaran, no se añaden.
- Los ejemplos valen más que las explicaciones largas.
- No se modifica `README.md` ni `CLAUDE.md` sin confirmación previa del usuario.
