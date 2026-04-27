---
title: "Comunicación entre componentes en React"
description: "Guía práctica sobre cómo se comunican los componentes en React: props, eventos, estados internos y sincronización recíproca, con ejemplos paso a paso."
publishDate: 2024-10-30
coverImage: /images/blog/react-component-communication/react-component-communication-cover.webp
coverImageAlt: "Ilustración que representa la comunicación entre componentes en una aplicación React"
tags:
  - React
  - TypeScript
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/comunicacion-entre-componentes-en-react"
canonicalSource: "Leanmind"
---

El propósito de este artículo es explicar cómo funciona la comunicación entre componentes. Comprender este mecanismo, es crucial para dominar el comportamiento de los componentes y alcanzar los objetivos deseados en el desarrollo de aplicaciones.

Me propongo abordar este tema de manera sencilla y accesible, asegurando que la explicación sea fácil de seguir. Para facilitar la comprensión, incluiré ejemplos prácticos y esquemas ilustrativos.

## Comunicación entre componentes sin utilizar estados

Cuando trabajamos con componentes, es fundamental entender cómo pueden comunicarse entre sí. Para empezar, explicaré cómo se comunican sin utilizar [estados](#glosario-estado); más adelante, los añadiré a la ecuación.

Principalmente, existen dos formas de establecer esta comunicación: de un componente padre a su hijo y viceversa. Para ilustrar mas fácilmente este concepto, consideremos un ejemplo:

> En el ejemplo, disponemos de un componente padre llamado `<Home>` y un componente hijo llamado `<CustomSelector>`, que muestra una lista de ítems que pueden estar en estado `selected` o `unselected`.

### El componente hijo, CustomSelector, se sincroniza con el componente padre, Home.

En este caso, el componente `<CustomSelector>` recibe, a través de una [prop](#glosario-prop) enviada desde `<Home>`, la lista de ítems seleccionados. `<CustomSelector>` se encargará de representar esta lista, mostrando únicamente los ítems seleccionados.

```typescript
<CustomSelector
    items={items},
    selectedItems={selectedItems}
/>
```

**Ejemplo: Todos los items `unselected`.**

```typescript
// pages/index.tsx
    
import { CustomSelector, Item } from '../components/CustomSelector'
        
const Home = () => {
    const items: Item[] = [
        { text: "Item 1" },
        { text: "Item 2" },
        { text: "Item 3" }
    ]
    const selectedItems: number[] = []
        
    return (
        <CustomSelector
            items={items},
            selectedItems={selectedItems}
        />
    )
}
    
export default Home
```

**Funcionamiento:**

![Diagrama de funcionamiento padre→hijo](https://hackmd.io/_uploads/Sy_BaT3oR.png)

**Resultado:**

![Resultado en pantalla con items sin seleccionar](https://hackmd.io/_uploads/SkNZwGGqC.png)

### El componente padre, Home, se sincroniza con el componente hijo, CustomSelector.

En el segundo caso, es `<CustomSelector>` quien transmite la lista de ítems seleccionados a `<Home>`.

Al hacer clic en alguno de los ítems de `<CustomSelector>`, se dispara el [evento](#glosario-evento) _onClick_.

```typescript
onClick={() => handleClick(index)}
```

El evento _onClick_ ejecuta la función _handleClick_, la cual se encarga de crear una nueva lista de ítems seleccionados.

```typescript
const handleClick = (index: number) => {
    const newSelectedItems = selectedItems.includes(index)
        ? selectedItems.filter((item) => item !== index)
        : [...selectedItems, index]
    
    // more code
}
```

Luego, esta lista actualizada se envía al componente `<Home>` mediante el evento _onChange_.

```typescript
onChange(newSelectedItems)
```

**Funcionamiento:**

![Diagrama de funcionamiento hijo→padre](https://hackmd.io/_uploads/By60Mphj0.png)

**Código completo:**

```typescript
// components/CustomSelector.tsx
        
interface Item = {
    text: string
}
        
interface Props = {
    items: Item[]
    selectedItems: number[]
    onChange: (selectedItems: number[]) => void
}
    
export const CustomSelector: React.FC<Props> = ({
    items,
    selectedItems,
    onChange
}) => {
    const handleClick = (index: number) => {
        const newSelectedItems = selectedItems.includes(index)
            ? selectedItems.filter((item) => item !== index)
            : [...selectedItems, index];
    
        onChange(newSelectedItems)
    }
    
    return (
        <div>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`${selectedItems.includes(index)
                        ? "border-2 border-yellow-600"
                        : "border-2 border-gray-300"
                    }`}
                    onClick={() => handleClick(index)}
                >
                    {item.text}
                </div>
            ))}
        </div>
    )
}
```

## Comunicación entre componentes utilizando estados

Ha llegado el momento de utilizar los estados, y quiero asegurarme de que no queden dudas sobre lo que son y cómo funcionan. A continuación, dejo una [breve explicación](#glosario-estado) aclaratoria.

Ya hemos visto cómo se comportan los componentes al comunicarse entre sí. Una vez entendido esto, viene lo interesante: añadir los estados para persistir los ítems seleccionados, cerrar el círculo y completar el comportamiento deseado en el ejemplo.

Continuando con el ejemplo anterior, presentaré dos escenarios en los que se pueden aplicar los estados.

### Estado sincronizado internamente

Aquí `<CustomSelector>` maneja su propio estado, actualizándolo según sea necesario.

```typescript
const [selectedItems, setSelectedItems] = useState<number[]>([])
```

Al igual que en los ejemplos anteriores, `<CustomSelector>` dispone de un evento _onClick_ que se dispara cuando se hace clic en un ítem y esto ejecuta la función _handleClick_. La diferencia en este caso es que `<CustomSelector>` no cuenta con un _onChange_, ya que no necesita comunicarse con ningún componente padre, de lo que sí se encarga es de actualizar la lista de ítems seleccionados en el estado `selectedItems` que el mismo contiene.

```typescript
const handleClick = (index: number) => {
    const newSelectedItems = selectedItems.includes(index)
        ? selectedItems.filter((item) => item !== index)
        : [...selectedItems, index]
            
    setSelectedItems(newSelectedItems)
}
```

Y es aquí donde ocurre la magia. Al actualizar el estado con `setSelectedItems(newSelectedItems)`, el componente se vuelve a [renderizar](#glosario-renderizar), mostrando los ítems seleccionados actualizados.

**Funcionamiento:**

![Diagrama de estado interno](https://hackmd.io/_uploads/H13CXT3iC.png)

**Resultado:**

![Resultado con estado interno](https://hackmd.io/_uploads/H1I6GzN9C.png)

**Código completo:**

```typescript
// pages/index.tsx
        
import { CustomSelector, Item } from '../components/CustomSelector'
      
const Home = () => {
    const items: Item[] = [
        { text: "Item 1" },
        { text: "Item 2" },
        { text: "Item 3" }
    ]
        
    return (
        <CustomSelector
            items={items}
        />
    )
}
    
export default Home
```

```typescript
// components/CustomSelector.tsx
        
import React, { useState } from 'react'
        
interface Item {
    text: string
}
        
interface Props {
    items: Item[]
}
        
export const CustomSelector: React.FC<Props> = ({
    items,
}) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([])
        
    const handleClick = (index: number) => {
        const newSelectedItems = selectedItems.includes(index)
            ? selectedItems.filter((item) => item !== index)
            : [...selectedItems, index];
            
        setSelectedItems(newSelectedItems)
    }
    
    return (
        <div>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`${selectedItems.includes(index)
                        ? "border-2 border-yellow-600"
                        : "border-2 border-gray-300"
                    }`}
                    onClick={() => handleClick(index)}
                >
                    {item.text}
                </div>
            ))}
        </div>
    )
}
```

### Estado sincronizado recíprocamente

Este ejemplo es altamente versátil, ya que desde `<Home>` podemos incluso relacionar el comportamiento de distintos componentes entre sí utilizando los estados, aprovechando el re-renderizado y apoyándonos en el _onChange_ de cada uno de estos componentes, aunque no abordaré este aspecto en el artículo.

Continuaré con el ejemplo anterior, aunque en este caso el componente `<Home>` es quien tiene el estado. Vamos a poder ver la comunicación reciproca entre los dos componentes, `<Home>` y `<CustomSelector>`. Esto permitirá que ambos componentes se comuniquen entre sí y se sincronicen mutuamente, manteniendo el estado que contiene `<Home>` actualizado en todo momento. El flujo de los datos entre ambos componentes es el siguiente:

**Flujo de Datos con onChange**

Cuando se utiliza el evento _onChange_ para comunicar componentes, es esencial comprender cómo se propaga el flujo de datos, y qué ocurre en cada paso del ciclo de vida de la actualización.

**Disparar el evento _onClick_:**

Cuando un usuario interactúa con un ítem en `<CustomSelector>`, se dispara el evento _onClick_. Esto ejecuta una función _handleClick_.

```typescript
// components/CustomSelector.tsx
    
onClick={() => handleClick(index)}
```

**Ejecución de _handleClick_:**

Dentro de la función _handleClick_, determinamos si un ítem debe añadirse o eliminarse de la lista de seleccionados. Una vez que la nueva lista está preparada, ésta se pasa al componente `<Home>` a través del evento _onChange_. Todo esto ya lo hemos visto anteriormente, pero falta explicar como utilizar ese _onChange_, para que `<Home>` reciba la lista de items seleccionados y actualice el estado de `<Home>`, vamos a ello.

```typescript
// components/CustomSelector.tsx
    
const handleClick = (index: number) => {
    const newSelectedItems = selectedItems.includes(index)
        ? selectedItems.filter((item) => item !== index)
        : [...selectedItems, index];
    
    onChange(newSelectedItems)
}
```

**Recepción en Home:**

En `<Home>`, la función _handleChange_ se ejecuta con la lista de ítems seleccionados como parámetro que llega desde `<CustomSelector>` por el _onChange_. Aquí es donde se decide cómo actualizar el estado, en este caso, actualizando `selectedItems` en `<Home>`.

```typescript
// pages/index.tsx
    
const handleChange = (currentSelectedItems: number[]) => {
    setSelectedItems(currentSelectedItems)
}
```

**Actualización del Estado:**

Al actualizar el estado `selectedItems` en `<Home>`, se provoca un re-renderizado de `<Home>`, lo que a su vez actualiza `<CustomSelector>`, ya que el estado actualizado se pasa de nuevo como una prop, haciendo que `<CustomSelector>` también se re-renderice con la lista de items actualizados.

Hemos cerrado el círculo de comunicación entre los dos componentes. Ahora, tanto si seleccionamos un ítem en `<CustomSelector>` como si actualizamos el estado en `<Home>`, ambos componentes se sincronizarán correctamente, mostrando siempre los ítems seleccionados actualizados.

**Funcionamiento:**

![Diagrama de comunicación recíproca con onChange](https://hackmd.io/_uploads/ryzFn6noA.png)

**Código completo:**

```typescript
// pages/index.tsx
    
import React, { useState } from 'react'
import { CustomSelector, Item } from '../components/CustomSelector'
    
const Home = () => {
    const items: Item[] = [
        { text: "Item 1" },
        { text: "Item 2" },
        { text: "Item 3" }
    ]
        
    const [selectedItems, setSelectedItems] = useState<number[]>([])
        
    const handleChange = (currentSelectedItems: number[]) => {
        setSelectedItems(currentSelectedItems)
    }
        
    return (
        <CustomSelector
            items={items}
            selectedItems={selectedItems}
            onChange={handleChange}
        />
    )
}
    
export default Home
```

```typescript
// components/CustomSelector.tsx
        
import React from 'react'
        
interface Item {
    text: string
}
        
interface Props {
    items: Item[]
    selectedItems: number[]
    onChange: (selectedItems: number[]) => void
}
        
export const CustomSelector: React.FC<Props> = ({
    items,
    selectedItems,
    onChange,
}) => {
    const handleClick = (index: number) => {
        const newSelectedItems = selectedItems.includes(index)
            ? selectedItems.filter((item) => item !== index)
            : [...selectedItems, index];
    
        onChange(newSelectedItems)
    }
    
    return (
        <div>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`${selectedItems.includes(index)
                        ? "border-2 border-yellow-600"
                        : "border-2 border-gray-300"
                    }`}
                    onClick={() => handleClick(index)}
                >
                    {item.text}
                </div>
            ))}
        </div>
    )
}
```

**Errores comunes**

Al trabajar con el evento _onChange_ y la sincronización de estados entre componentes, pueden surgir algunos errores o comportamientos inesperados como re-renderizados innecesarios, desincronización del estado, o bucle infinito de actualizaciones de estado. Por ejemplo, para evitar los re-renderizados innecesarios cuando se actualiza el estado, se puede incluir un condicional.

```typescript
// pages/index.tsx
        
const handleChange = (currentSelectedItems: number[]) => {
    if (currentSelectedItems !== selectedItems) {
        setSelectedItems(currentSelectedItems)
    }
}
```

> Para aquellas interesadas en profundizar más sobre la sincronización y asincronía de los estados en React, recomiendo leer el artículo de [Jorge Aguiar Martín](https://leanmind.es/es/equipo/jotamusik/) y [Adrián Ferrera González](https://leanmind.es/es/equipo/afergon/) titulado "[Modificación concurrente de estado en React](https://leanmind.es/es/blog/modificacion-concurrente-de-estado-en-react/)". Este artículo ofrece una visión más detallada y avanzada, y es un excelente complemento para entender los desafíos y soluciones en la gestión de estados en situaciones más complejas.

## Conclusión

He intentado plasmar de la manera más sencilla posible, cómo se comunican los componentes y la versatilidad que aportan los estados. Combinar ambos conceptos nos permitirá crear aplicaciones muy potentes, donde el único límite será tu imaginación al utilizarlos.

## Agradecimientos

Quiero dar un agradecimiento muy especial a Michael, el compañero que tuvo la paciencia infinita para explicarme y enseñarme todo lo que sé sobre la comunicación entre componentes. Sin sus lecciones y su buena onda, este artículo no habría sido posible.

También quiero agradecer de corazón a Lita, que me dió un feedback sincero y de primera para mejorar este artículo. Gracias a sus observaciones, pude ver otro punto de vista y darle una vuelta más a lo que había escrito.

Gracias, Michael y Lita, por su apoyo y por hacer este camino mucho más divertido.

## Glosario

<a name="glosario-prop"></a>
### Prop

Las "props" (abreviatura de propiedades), son un mecanismo para pasar datos desde un componente padre a un componente hijo en una aplicación React. Permiten que los componentes sean reutilizables y dinámicos, ya que los datos que reciben pueden cambiar según el contexto en el que se utilicen. Además de pasar simples valores como cadenas o números, las props también pueden ser funciones, objetos complejos, o incluso otros componentes. Esto permite un alto grado de flexibilidad y personalización en la construcción de interfaces.

**Componente padre**

El componente Home pasa la prop name con el valor "John" al componente Greeting.

```typescript
// pages/index.tsx
        
import Greeting from '../components/Greeting'
    
const Home = () => {
    return (
        <Greeting name="John" />
    )
}
    
export default Home
```

**Componente hijo**

El componente Greeting recibe la prop name y la utiliza para mostrar un saludo personalizado.

```typescript
// components/Greeting.tsx
        
const Greeting = ({ name }) => {
    return <p>Hello, {name}!</p>
}
    
export default Greeting
```

**Resultado**

```bash
`Hello, Jonh!`
```

[more info…](https://es.legacy.reactjs.org/docs/components-and-props.html)

<a name="glosario-estado"></a>
### Estado

Los estados son un mecanismo para manejar datos que pueden cambiar a lo largo del ciclo de vida de un componente. A diferencia de las props, que son valores estáticos pasados desde un componente padre, los estados son variables internas de un componente que se pueden actualizar y provocar un nuevo renderizado del componente cuando cambian.

Por ejemplo, los estados son útiles para manejar la interacción del usuario, como entradas en formularios, cambios en la interfaz de usuario, o para almacenar datos que se obtienen de una API.

Los estados se gestionan normalmente utilizando el hook useState, que proporciona un valor inicial y una función para actualizar ese valor.

**Ejemplo:**

```typescript
import React, { useState } from 'react'
    
const Counter = () => {
    const [count, setCount] = useState(0)
    
    const handleClick = () => {
        setCount(count + 1)
    }
    
    return (
        <div>
            <p>Current count: {count}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    )
}
    
export default Counter
```

En el ejemplo, el estado count se incrementa cada vez que el usuario hace clic en el botón, y el componente se re-renderiza para mostrar el nuevo valor.

[more info…](https://es.legacy.reactjs.org/docs/faq-state.html)

<a name="glosario-evento"></a>
### Evento

Los eventos son acciones o sucesos, como clics del usuario, que pueden ser detectados por el navegador para desencadenar una respuesta en una aplicación. Los eventos suelen manejarse mediante funciones específicas (event handlers) que responden a interacciones del usuario.

**Ejemplo:**

```typescript
<button onClick={handleClick}>Click me</button>
```

En el ejemplo, _onClick_ es el evento, se dispara cada vez que el usuario hace clic en el botón y se ejecuta la función _handleClick_.

[more info…](https://es.legacy.reactjs.org/docs/handling-events.html)

<a name="glosario-renderizar"></a>
### Renderizar

Renderizar es el proceso de generar y mostrar el contenido de una página web, que puede hacerse en el servidor (SSR), durante la compilación (SSG), o en el cliente (CSR), dependiendo de cómo y cuándo se necesita el contenido.

[more info…](https://es.legacy.reactjs.org/docs/rendering-elements.html)
