# Declaración de Accesibilidad WCAG 2.2 AA

## Contexto

Se ha completado la auditoría de accesibilidad de aitorevi.dev y se ha alcanzado el cumplimiento de WCAG 2.2 Nivel AA. Ahora es necesario formalizar esta autodeclaración con:

- Una página dedicada con estructura legal estándar europea/española.
- El sello oficial W3C en el footer como señal de confianza.
- Enlace a la nueva página desde el footer (ES + EN).

## Scope

**Entra:**
- `src/pages/accesibilidad.astro` — página ES con texto de autodeclaración conforme al modelo europeo (EN 301 549 + WCAG 2.2 AA).
- `src/pages/en/accessibility.astro` — versión EN bilingüe.
- `src/components/footer/Footer.astro` — añadir link "Accesibilidad"/"Accessibility" en `legalLinks` + insignia WCAG 2.2 AA del W3C.
- `src/i18n/messages/misc.ts` — claves i18n para los nuevos links del footer.

**No entra:**
- Cambios en `Layout.astro` (no existe `<meta>` estándar para accesibilidad; la vinculación desde el footer es la práctica WAI recomendada).
- Modificaciones al sistema de tests (contenido estático, sin lógica testeable).

## Implementation Steps

- [x] Step 1: Añadir claves i18n en `src/i18n/messages/misc.ts`:
  - `'legal.accessibility'` → `'Accesibilidad'` / `'Accessibility'`
- [x] Step 2: Crear `src/pages/accesibilidad.astro` con:
  - Uso de `LegalPageLayout` (lang="es", updatedDate="2026-05-04")
  - Secciones: Compromiso, Nivel de conformidad, Fecha de revisión, Tecnologías utilizadas, Limitaciones conocidas (ninguna), Contacto para reportar barreras
  - Texto legal siguiendo el modelo de autodeclaración europeo (EN 301 549 / Directiva UE 2016/2102)
- [x] Step 3: Crear `src/pages/en/accessibility.astro` (equivalente EN):
  - Mismo contenido traducido al inglés
  - lang="en", mismas secciones
- [x] Step 4: Actualizar `src/components/footer/Footer.astro`:
  - Añadir `{ label: t(lang, 'legal.accessibility'), href: '/accesibilidad' }` al array ES
  - Añadir `{ label: t(lang, 'legal.accessibility'), href: '/en/accessibility' }` al array EN
  - Añadir insignia WCAG 2.2 AA del W3C bajo los enlaces legales:
    - `<img src="https://www.w3.org/WAI/WCAG22/wcag2.2AA-blue-v.svg" ...>` 
    - Alt descriptivo, enlace a la explicación oficial W3C, clases Tailwind para adaptar al dark footer

## Verification

- [x] `npx astro check` sin errores (0 errores esperados)
- [x] `npm run test:unit` verde (167 tests, todos pasan)
- [x] `npm run build` pasa
- [ ] Verificación manual:
  - `/accesibilidad` renderiza con breadcrumb y prose correctos
  - `/en/accessibility` renderiza correctamente en inglés
  - Footer muestra el nuevo link "Accesibilidad" y la insignia W3C en ambos idiomas
  - La insignia es visible tanto en light como en dark mode
  - Los links del footer son accesibles por teclado

## Progress

- [x] Plan aprobado
- [x] Rama creada ✅ (feat/accessibility-declaration)
- [x] Implementación completa
- [x] Verificado (astro check 0 errores, 167 tests verdes)
- [ ] Code review pasado
- [ ] Commit + PR + CI verde + merge (lo hace el usuario)

## Status: REVIEW
