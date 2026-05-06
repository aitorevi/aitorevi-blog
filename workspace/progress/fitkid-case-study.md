# FitKid Competitions — Análisis de opciones: open source + caso de estudio

**Status:** IN PROGRESS
**Tipo:** Operational (análisis + decisión estratégica)
**Fecha:** 2026-05-05

---

## Contexto

FitKid Competitions es una app web para gestionar horarios de competiciones de FitKid (deporte infantil). Permite a participantes buscar su nombre y ver a qué hora compiten. Está en producción y desplegada en Vercel.

### Stack actual
- Astro 5 SSR en Vercel
- Content Collections con Zod (datos en Markdown)
- Autenticación por contraseña (admin / viewer)
- Scripts TypeScript para generar competiciones desde PDFs
- CSS puro con dark theme, React islands para animaciones

### El problema de privacidad
Los ficheros `src/content/competitions/*/day-N.md` contienen **nombres reales de menores** (nombre completo, dorsal, club, categoría, hora de actuación). FitKid es un deporte infantil. Esto activa:

- **RGPD art. 8**: datos de menores requieren tratamiento especial
- **LOPD-GDD** española (art. 7): edad de consentimiento digital en España = 14 años
- El código es perfectamente publicable; los datos, NO.

---

## Opciones analizadas

### Opción A — Caso de estudio en el blog (repo privado)

**Qué implica:** Escribir un post detallado en aitorevi.dev sobre el proyecto: problema que resuelve, arquitectura, decisiones técnicas, capturas de pantalla con datos anonimizados. El repo sigue privado.

**Pros:**
- Sin riesgo RGPD (cero exposición de datos)
- Esfuerzo bajo (1–2 horas)
- Se puede publicar ya

**Contras:**
- No hay código visible para empleadores / comunidad
- Menos "prueba" del trabajo

**Valoración:** Válido como primer paso o como complemento a otra opción.

---

### Opción B — Open source con datos de demo (RECOMENDADA)

**Qué implica:**
1. Crear un repo público `fitkid-competitions` en GitHub con el código actual
2. Sustituir los datos reales por competidores ficticios generados (nombres inventados, datos coherentes)
3. Añadir un script `seed:demo` que genere competiciones de ejemplo
4. El README explica el caso de uso y cómo desplegar
5. La instancia de producción sigue corriendo desde un fork privado (o desde el mismo repo ignorando los ficheros de datos reales con `.gitignore` local + deploy desde rama protegida)

**Estructura propuesta:**
```
src/content/competitions/
  demo-national-2025/          ← datos ficticios, en el repo público
  .gitignore-local             ← ignora competiciones reales si usas el mismo repo
```

**Estrategia de producción (sub-opción B1 — fork privado):**
- Repo público: código + demo data
- Fork privado: datos reales (gitignored en el público)
- Deploy desde el fork privado

**Estrategia de producción (sub-opción B2 — rama protegida):**
- `main` branch: código + demo data (público)
- `production` branch: privada (GitHub branch protection + no push)
- Menos limpio que el fork

**Pros:**
- El código es open source y atrae atención de la comunidad
- El caso de estudio en el blog puede enlazar directamente al repo
- Muestra arquitectura real (Astro SSR, auth, Content Collections, scripts de generación)
- Cualquiera puede desplegarlo para su propio campeonato
- La producción sigue protegida

**Contras:**
- Trabajo de setup: ~3–4 horas (generador de datos ficticios, README, fork/repo nuevo)
- Mantener sincronía entre repo público y fork privado si se añaden features

**Valoración:** La opción con más valor. El fork privado es el patrón estándar (p.ej. Hashicorp con Vault open core).

---

### Opción C — Un único repo con datos vía variable de entorno

**Qué implica:** Los ficheros de datos reales no van al repo (`.gitignore`). Los datos se inyectan en build time desde una fuente privada (Vercel env vars con el contenido codificado, o un bucket S3/R2 privado, o un repo privado usado como submodule).

**Pros:**
- Un solo repo
- Técnicamente interesante

**Contras:**
- Complejidad alta: los Content Collections de Astro esperan ficheros en disco, no env vars
- Requeriría un loader custom o un script pre-build
- Frágil y overengineered para el caso de uso

**Valoración:** No merece la pena frente a B.

---

### Opción D — Publicar con datos anonimizados (iniciales o nombres genéricos)

**Qué implica:** Mantener el repo como está, pero antes de hacer público reemplazar nombres con iniciales (`N.O.C.`) o descripciones genéricas (`Participante #1`).

**Pros:**
- Un solo repo, datos reales de estructura pero anonimizados

**Contras:**
- La app pierde su función principal (buscar por nombre)
- Las iniciales aún pueden identificar personas según RGPD
- No aporta ventaja sobre Opción B con demo data

**Valoración:** Peor que B en todos los aspectos.

---

## Recomendación

**Opción B (fork privado)** es la mejor combinación de:
- Open source real con código publicable
- Producción protegida con datos reales
- Caso de estudio rico en aitorevi.dev

**Ruta de implementación sugerida:**

1. **Crear repo público** `aitorevi/fitkid-competitions` en GitHub
2. **Generar demo data**: script que crea nombres ficticios coherentes (p.ej. con una lista de nombres españoles genéricos)
3. **Limpiar README** para explicar el proyecto como herramienta genérica para campeonatos
4. **Fork privado** con los datos reales + pipeline de producción
5. **Caso de estudio en el blog** (post en ES + EN) con:
   - El problema: gestionar horarios de campeonatos de FitKid
   - La solución técnica: Astro SSR + Content Collections + auth
   - Decisiones de diseño: por qué Markdown en lugar de una DB
   - El enfoque open source + producción privada
   - Enlace al repo público

---

## Checklist

- [x] Decidir la opción → Opción B (fork privado + repo público `fitkid-schedule`)
- [x] Crear repo público en GitHub → https://github.com/aitorevi/fitkid-schedule
- [x] Generar datos de demo ficticios (26 participantes ficticios, 2 días)
- [x] Actualizar README del repo público (EN, con data format, privacy note, MIT)
- [x] Eliminar datos reales de los scripts (scripts/generate-*.ts → template genérico)
- [x] PRIMARY_CLUB hardcodeado → reemplazado por URL param `?club=yourclub`
- [ ] Crear fork privado para producción (después del campeonato)
- [ ] Redactar caso de estudio (post blog ES + EN)
- [ ] Añadir FitKid a la sección de proyectos en aitorevi.dev
- [ ] Publicar y verificar
