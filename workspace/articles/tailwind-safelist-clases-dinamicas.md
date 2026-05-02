# Tailwind y clases dinámicas: por qué el safelist

## El problema

Tailwind genera el CSS en tiempo de build escaneando el código fuente en busca de clases literales. Si una clase aparece como string completo en cualquier archivo del proyecto, Tailwind la incluye en el CSS final. Si no aparece como literal, no la incluye — y en producción el elemento no tiene estilos.

El problema surge cuando construyes clases dinámicamente mediante interpolación:

```astro
<!-- Tailwind NO detecta estas clases -->
<li class={`dark:${accent.text} dark:${accent.border}`}>
```

Aunque `accent.text` contiene el string `'text-accent-emerald'`, la expresión `dark:${accent.text}` nunca aparece como literal completo en el código. Tailwind solo ve la expresión de template, no el valor en runtime.

Contraste con las clases no-dark del mismo `accentMap`:

```ts
const accentMap = {
  emerald: { text: 'text-accent-emerald', border: 'border-accent-emerald/40' },
};
```

Estas **sí** funcionan porque los strings `'text-accent-emerald'` y `'border-accent-emerald/40'` existen literalmente en el archivo `.ts`. Tailwind los encuentra al escanear el contenido.

Con el prefijo `dark:` la situación cambia: `'dark:text-accent-emerald'` no aparece como literal en ningún sitio, así que Tailwind no genera la regla CSS correspondiente. El elemento queda sin color en dark mode.

## La solución: `safelist`

Tailwind ofrece `safelist` en `tailwind.config.mjs` para declarar explícitamente qué clases deben generarse aunque no aparezcan en el código fuente:

```js
// tailwind.config.mjs
export default {
  safelist: [
    'dark:text-accent-violet',  'dark:text-accent-blue',  'dark:text-accent-emerald',  'dark:text-accent-sky',
    'dark:ring-accent-violet/40', 'dark:ring-accent-blue/40', 'dark:ring-accent-emerald/40', 'dark:ring-accent-sky/40',
    'dark:border-accent-violet/40', 'dark:border-accent-blue/40', 'dark:border-accent-emerald/40', 'dark:border-accent-sky/40',
  ],
  // ...
}
```

Con esto, Tailwind genera el CSS para estas clases independientemente de si las encuentra en el código. Los templates pueden usar interpolación con total seguridad:

```astro
<!-- Funciona: el CSS ya está garantizado por el safelist -->
<li class={`... dark:${accent.border} dark:bg-white/5 dark:${accent.text}`}>
```

## Por qué no el workaround alternativo

Una solución habitual cuando se desconoce el `safelist` es añadir los strings literales como campos extra en el objeto de datos:

```ts
const accentMap = {
  emerald: {
    text: 'text-accent-emerald',
    pillDarkText: 'dark:text-accent-emerald',  // literal para que Tailwind lo encuentre
  },
};
```

Funciona porque ahora `'dark:text-accent-emerald'` sí aparece literalmente en el código. Pero tiene varios problemas:

- **Duplicación**: cada token de color necesita su versión `pillDark*`, doblando los campos del mapa.
- **Acoplamiento**: la solución está repartida entre el mapa de datos y el template. Quien lee el template no sabe por qué existen esos campos.
- **Escalabilidad**: si añades un nuevo token de color, tienes que acordarte de añadir también su variante `pillDark*`.

El `safelist` centraliza la responsabilidad: el config sabe qué clases son dinámicas, los mapas de datos solo contienen los valores semánticos, y los templates usan interpolación normal.

## Cuándo usar cada enfoque

| Situación | Solución |
|---|---|
| Pocas clases dinámicas conocidas en tiempo de build | `safelist` con strings literales |
| Muchas clases con patrón regular | `safelist` con `{ pattern: /regex/ }` |
| Clases que también necesitas en el código | Strings literales en el objeto de datos (sin necesidad de `safelist`) |
| Clases completamente arbitrarias en runtime (input de usuario) | Estilos inline o CSS vars — Tailwind no puede ayudar aquí |

## Contexto en este proyecto

Aparece en `PostCinematic.astro` y `WorkCinematic.astro` donde los componentes cinemáticos reciben un objeto `accent` con tokens de color por sección. En light mode las pills usan slate neutro; en dark mode toman el color del accent de la sección. Las clases dark-mode son dinámicas → `safelist`.
