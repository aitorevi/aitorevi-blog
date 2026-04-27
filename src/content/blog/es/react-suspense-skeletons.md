---
title: "De las pantallas en blanco a los Skeletons: nuestra aventura con React Suspense en Next.js"
description: "Cómo transformamos pantallas en blanco en experiencias de carga progresiva usando React Suspense con Server Components en Next.js, sin tocar el backend."
publishDate: 2026-03-25
coverImage: /images/blog/react-suspense-skeletons/react-suspense-skeletons-cover.webp
coverImageAlt: "Portada del artículo sobre React Suspense y skeletons en Next.js"
tags:
  - React
  - Next.js
  - UX
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/de-las-pantallas-en-blanco-a-los-skeletons-nuestra-aventura-con-react-suspense-en-next-js"
canonicalSource: "Leanmind"
---

Todos hemos estado ahí: refrescas la página y… nada. Bueno, no "nada" exactamente, sino ese incómodo momento donde la pantalla se queda en blanco mientras el servidor hace su magia. Como usuarios, odiamos esos segundos de incertidumbre. Como desarrolladores, sabíamos que podíamos hacerlo mejor.

## El problema: cuando el servidor se toma su tiempo

Trabajábamos en una aplicación con contenido dinámico que se renderizaba en el servidor. El flujo era el clásico: el servidor recibe la petición, busca los datos, genera el HTML y lo envía al cliente. Simple, ¿verdad? El problema estaba en esos "busca los datos". Dependiendo de la complejidad de la consulta o la carga del sistema, esos milisegundos se convertían en segundos de pantalla en blanco. Una experiencia de usuario que dejaba mucho que desear.

Lo interesante es que no necesitábamos toda la información para empezar a mostrar algo útil al usuario. La estructura de la página, el header, los placeholders… todo eso podía estar listo mientras esperábamos el contenido pesado. Ahí fue donde React Suspense entró en juego, pero no de la forma obvia que muchos piensan.

## El giro: Suspense no es solo para el cliente

Cuando la mayoría de desarrolladores escucha "React Suspense", piensa inmediatamente en lazy loading de componentes del lado del cliente. Y sí, eso es genial, pero Suspense tiene un superpoder menos conocido: puede trabajar perfectamente con Server Components en Next.js para crear experiencias de carga progresivas desde el servidor mismo.

La idea es brillantemente simple: envolvemos los componentes que necesitan hacer operaciones costosas (llamadas a base de datos, APIs externas, procesamiento de archivos) con un `<Suspense>` boundary. Mientras esos componentes hacen su trabajo, Next.js puede empezar a enviar el HTML del resto de la página al cliente, incluyendo un skeleton o placeholder donde eventualmente aparecerá el contenido.

## La implementación: menos código, más impacto

Vamos a ver paso a paso cómo transformamos una página problemática en una experiencia fluida. Usaré como ejemplo real una página de productos con búsqueda, algo que todos y todas hemos construido alguna vez.

### Paso 1: El problema original

Así es como teníamos la página inicialmente. Es código correcto, funcional, pero con un problema grave de experiencia de usuario:

```tsx
// app/products/page.tsx
export default async function ProductsPage({ searchParams }) {
  // Esta línea bloquea TODO el render hasta que termine
  const products = await fetchProductsFromDatabase(searchParams);

  return (
    <>
      <Header />
      <SearchBar />
      <ProductGrid products={products} />
      <Pagination totalPages={products.totalPages} />
    </>
  );
}
```

El problema: mientras `fetchProductsFromDatabase` hace su trabajo (que puede tardar 1-3 segundos con filtros complejos), el usuario ve una pantalla completamente en blanco. Ni el header, ni la barra de búsqueda, nada. Solo blanco.

### Paso 2: Identificar qué puede mostrarse inmediatamente

Pensemos: ¿qué partes de esta página NO dependen de los datos de productos?

El header con el título, la barra de búsqueda y la estructura de la grid pueden mostrarse inmediatamente, aunque la grid esté vacía. Los productos reales, obviamente, necesitan esperar a que los datos lleguen.

Este análisis es la clave. Necesitamos separar lo estático de lo dinámico.

### Paso 3: Extraer el contenido dinámico

Primero, movemos la lógica que carga datos a su propio componente. Este paso es fundamental para que Suspense funcione:

```tsx
// app/products/page.tsx
export default function ProductsPage({ searchParams }) {
  return (
    <>
      <Header />
      <SearchBar />
      
      {/* Aquí está la carga de datos ahora */}
      <ProductsContent searchParams={searchParams} />
      
      <Pagination />
    </>
  );
}

// components/products-content.tsx
export async function ProductsContent({ searchParams }) {
  const products = await fetchProductsFromDatabase(searchParams);
  return <ProductGrid products={products} />;
}
```

Aún no hemos mejorado nada. De hecho, tenemos el mismo problema: todo sigue bloqueándose. Pero ahora tenemos la estructura correcta para aplicar Suspense.

### Paso 4: Añadir Suspense y el Skeleton

Ahora sí, envolvemos el componente dinámico con `<Suspense>` y creamos un fallback:

```tsx
// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage({ searchParams }) {
  return (
    <>
      <Header />
      <SearchBar />
      
      {/* Este es el cambio mágico */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
      
      <Pagination />
    </>
  );
}

// components/products-skeleton.tsx
function ProductsSkeleton() {
  return (
    <div className="products-grid">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-title" />
          <div className="skeleton-price" />
        </div>
      ))}
    </div>
  );
}
```

¿Qué sucede ahora?

Inmediatamente, en apenas 50-150ms, el usuario ve el header, la barra de búsqueda y el skeleton de 9 productos. En paralelo, el servidor está ejecutando `fetchProductsFromDatabase` en segundo plano. Cuando los datos terminan de cargarse, Next.js envía el HTML real de los productos y reemplaza el skeleton de forma fluida.

El resultado es evidente: en lugar de 2 segundos de pantalla en blanco, el usuario ve contenido útil en milisegundos.

### Paso 5: Refinar el Skeleton

Un skeleton bien hecho replica la estructura exacta del contenido real:

```tsx
function ProductsSkeleton() {
  return (
    <div className="products-grid">
      {/* Mostramos la misma cantidad de items que esperamos */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="product-card">
          {/* La imagen ocupa el mismo espacio que la real */}
          <div 
            className="skeleton-image" 
            style={{ aspectRatio: '1/1', background: '#e0e0e0' }}
          />
          {/* El título tiene el mismo alto */}
          <div 
            className="skeleton-title" 
            style={{ height: '24px', background: '#e0e0e0', margin: '12px 0' }}
          />
          {/* El precio está en la misma posición */}
          <div 
            className="skeleton-price" 
            style={{ height: '20px', width: '80px', background: '#e0e0e0' }}
          />
        </div>
      ))}
    </div>
  );
}
```

La coherencia visual es crucial. Cuando el contenido real aparece, no hay saltos bruscos en el layout.

### Paso 6: El resultado final completo

Así quedó nuestra implementación final, con todos los archivos organizados:

```tsx
// app/products/page.tsx
import { Suspense } from 'react';
import { ProductsContent } from '@/components/products-content';
import { ProductsSkeleton } from '@/components/products-skeleton';
import { SearchBar } from '@/components/search-bar';

export default function ProductsPage({ searchParams }) {
  return (
    <div className="container">
      <Header />
      <SearchBar />
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// components/products-content.tsx
import { fetchProductsFromDatabase } from '@/lib/database';
import { ProductGrid } from '@/components/product-grid';

export async function ProductsContent({ searchParams }) {
  // Esta llamada ya no bloquea el render de la página
  const products = await fetchProductsFromDatabase(searchParams);
  
  return <ProductGrid products={products} />;
}
```

Con esta implementación conseguimos que el usuario vea contenido en menos de 200ms, mientras el skeleton comunica claramente que algo se está cargando. Los datos se cargan en paralelo sin bloquear el render inicial, el código quedó mejor organizado y más mantenible, todo sin necesidad de tocar una sola línea del backend o la base de datos, y lo mejor: el SEO permanece intacto porque sigue siendo SSR.

## La curva de aprendizaje (que no es tal)

Lo más sorprendente de toda esta implementación fue lo poco que tuvimos que aprender. Si ya conoces React y Next.js, ya sabes usar Suspense. La complejidad no está en la API (que es trivialmente simple), sino en pensar arquitectónicamente: ¿qué puede mostrarse inmediatamente? ¿qué necesita esperar a datos? ¿cómo dividimos nuestros componentes para aprovecharlo?

Son preguntas que deberíamos hacernos siempre, Suspense solo nos da las herramientas para materializarlas.

## El resultado final

Implementamos Suspense en nuestra sección de contenido dinámico y los resultados fueron inmediatos. El feedback de usuarios fue unánimemente positivo: la aplicación se "siente" más rápida, más moderna, más pulida. Las métricas de engagement mejoraron. Todo sin tocar una sola línea de código de backend, sin optimizar queries, sin añadir caching complejo.

A veces, la mejor optimización no es hacer las cosas más rápido, sino hacer que la espera no se sienta como una espera. React Suspense nos dio exactamente eso: la capacidad de transformar pantallas en blanco en experiencias fluidas y progresivas, manteniendo los beneficios del Server-Side Rendering y sin complicar nuestro código.

Si trabajas con Next.js y Server Components, y todavía no has explorado Suspense más allá del lazy loading de rutas, te estás perdiendo una de las herramientas más poderosas para mejorar la experiencia de usuario con mínimo esfuerzo. No es magia, es simplemente React haciendo lo que mejor sabe: pensar en componentes y su ciclo de vida, ahora extendido elegantemente al servidor.
