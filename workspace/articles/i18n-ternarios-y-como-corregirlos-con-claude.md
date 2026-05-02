# i18n, ternarios y cómo corregirlos con Claude

## El problema original

Al construir el blog bilingüe (ES/EN), la implementación inicial de las traducciones seguía un patrón que parece razonable a primera vista:

```astro
const featuredLabel = lang === 'es' ? 'destacado' : 'featured';
const ctaLabel = lang === 'es' ? 'Leer artículo' : 'Read article';
const updatedLabel = lang === 'es' ? 'Última actualización' : 'Last updated';
```

Y en los templates:

```astro
{lang === 'es' ? 'Campos obligatorios' : 'Required fields'}
{lang === 'es' ? 'Constelación de tecnologías' : 'Tech constellation'}
{lang === 'es' ? 'Instalaciones · activas' : 'Installations · active'}
```

El proyecto ya tenía un sistema i18n bien montado en `src/i18n/` con `t(lang, 'key')`, archivos de mensajes por dominio y utilidades. Pero en muchos componentes se lo saltaba directamente.

**Claude lo hizo así.** No porque no supiera del sistema i18n — lo usaba en algunos sitios — sino porque al implementar componentes nuevos o añadir texto inline, tomaba el camino más corto: el ternario directo. Sin una regla explícita que lo prohibiera, era un comportamiento perfectamente razonable desde su perspectiva.

## El diagnóstico

Al auditar el proyecto encontramos 39 instancias de `lang === 'es'` repartidas por 15+ archivos. Algunas eran ternarios de traducción genuinos. Otras eran lógica legítima que no debía cambiar:

| Tipo | Ejemplo | ¿Tocar? |
|---|---|---|
| String de UI | `'Leer artículo' : 'Read article'` | ✅ Sí → `t(lang, 'blog.cta.read')` |
| Locale code | `'es-ES' : 'en-US'` | ✅ Sí → `getLangLocale(lang)` |
| Selección de datos YAML | `p.data.taglineEs : p.data.taglineEn` | ❌ No — son datos, no UI |
| Lógica de rutas | `internalUrl : alternateUrl` en hreflang | ❌ No — lógica estructural |
| Flag booleano | `const isEs = lang === 'es'` en Nav | ❌ No — controla lógica de componente |

La clasificación fue clave. Sin ella, el refactor habría sido mecánico y habría tocado cosas que no debía.

## La solución

### 1. `getLangLocale()` para los locale codes

El patrón `lang === 'es' ? 'es-ES' : 'en-US'` aparecía en 6 archivos distintos. En vez de convertirlo en una clave de i18n (no es una cadena de UI), se añadió una función utilitaria a `src/i18n/utils.ts`:

```ts
export function getLangLocale(lang: Lang): string {
  return lang === 'es' ? 'es-ES' : 'en-US';
}
```

Un único lugar para cambiar si algún día el proyecto añade más idiomas.

### 2. Claves existentes que no se usaban

`blog.featured`, `blog.readTime`, `blog.publishedOn` ya existían en los archivos de mensajes. Simplemente no se estaban usando donde deberían. El refactor los conectó.

### 3. Claves nuevas por dominio

Las cadenas que no tenían clave se añadieron al archivo de mensajes correspondiente:

- `blog.cta.read`, `blog.outro.title` → `src/i18n/messages/blog.ts`
- `home.contact.required`, `home.work.mock.*` (9 claves) → `src/i18n/messages/home.ts`
- `misc.skipToContent`, `legal.updated`, `legal.title` → `src/i18n/messages/misc.ts`

### 4. URLs de páginas traducidas

Un caso especial: el enlace a la política de privacidad usaba un ternario de URL:

```astro
<a href={lang === 'es' ? '/privacidad' : '/en/privacy'}>
```

`getLocalePath('/privacidad', 'en')` daría `/en/privacidad`, no `/en/privacy` — los slugs son distintos entre idiomas. La solución fue añadir una clave de URL al messages file:

```ts
'home.contact.privacy.url': '/privacidad',   // es
'home.contact.privacy.url': '/en/privacy',   // en
```

Y usar `t(lang, 'home.contact.privacy.url')` en el template.

## Cómo usamos a Claude para corregirlo

El proceso fue iterativo:

1. **Auditoría**: pedimos a Claude que buscara todos los `lang === 'es'` en el proyecto y los clasificara según el esquema de arriba.
2. **Plan**: Claude generó un task file en `workspace/planning/` con los 5 grupos de cambios, las claves nuevas necesarias y los archivos que no tocar. Esperamos aprobación antes de implementar.
3. **Implementación por pasos**: Claude implementó los cambios grupo a grupo, parando en puntos naturales para que hiciéramos commits atómicos.
4. **Verificación**: `npx astro check` (0 errores) + `npm run test:unit` (167 tests) verde al final de cada paso.

El resultado fue un diff limpio, sin regresiones y con los ternarios de traducción eliminados del código.

## La regla para el futuro

Para que esto no vuelva a ocurrir, añadimos `.claude/rules/i18n.md` a la configuración de Claude Code. Esta regla se carga automáticamente cuando Claude trabaja en `src/i18n/`, `src/pages/`, `src/components/` o `src/layouts/`.

La regla documenta explícitamente:
- Que todo string de UI visible debe ir a `t(lang, 'key')`, sin excepciones
- Que `getLangLocale(lang)` sustituye a `lang === 'es' ? 'es-ES' : 'en-US'`
- Qué tipos de ternarios son legítimos y no deben cambiarse
- El mapeo de prefijos de clave a archivos de messages

El comportamiento de Claude no cambió porque fuera incapaz de hacerlo bien — cambió porque ahora tiene el contexto explícito de cuál es el patrón correcto para este proyecto. Las reglas en `.claude/rules/` son exactamente para esto: codificar decisiones de diseño que no son obvias desde el código.

## Lección

Un sistema i18n bien montado no es suficiente si no hay una convención explícita que diga cuándo y cómo usarlo. Claude (y cualquier desarrollador nuevo) tomará el camino más corto disponible. La documentación que vive cerca del código — en este caso, una rule que se carga en contexto automáticamente — es más efectiva que una guía de estilo en un README que nadie lee antes de implementar.
