---
paths:
  - src/components/**
---

# Component conventions

## Structure

- `atoms/` — primitivos sin estado (Button, Tag, Badge, Icon)
- `shared/` — componentes reutilizables entre secciones (StatCard, TestimonialCard, ServiceCard, SectionHeader)
- `home/`, `cv/`, `case-study/`, `katas/`, `blog/`, `nav/`, `footer/` — orquestradores de sección
- Un componente nuevo que se use en más de una sección va en `shared/`, no en la carpeta de feature

## Hydration

- Default: sin directiva (renderizado solo en servidor)
- Interactividad básica (toggle, menú): `client:load` solo si es above the fold, `client:idle` si no
- Islas React: usar solo cuando el componente necesita estado local persistente o interactividad compleja
- Nunca usar `client:load` en componentes below the fold

## Dark mode

- Usar clases de Tailwind con prefijo `dark:` — nunca CSS vars ni media queries inline
- Paleta: `dark:bg-[#0f1419]`, `dark:text-[#f1f5f9]`, `dark:text-accent-violet`, `dark:text-accent-blue`

## Accesibilidad

- Todo elemento interactivo: `aria-label` o texto visible
- Imágenes: `alt` siempre descriptivo, nunca vacío salvo decorativas
- Animaciones: respetar `prefers-reduced-motion` con `motion-safe:` / `motion-reduce:`
