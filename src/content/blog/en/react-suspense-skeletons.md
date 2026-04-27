---
title: "From Blank Screens to Skeletons: Our Adventure with React Suspense in Next.js"
description: "How we transformed blank screens into progressive loading experiences using React Suspense with Server Components in Next.js, without touching the backend."
publishDate: 2026-03-25
coverImage: /images/blog/react-suspense-skeletons/coverImage.webp
coverImageAlt: "Cover image for the article about React Suspense and skeletons in Next.js"
tags:
  - React
  - Next.js
  - UX
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/en/blog/from-blank-screens-to-skeletons-our-adventure-with-react-suspense-in-nextjs"
canonicalSource: "Leanmind"
---

We've all been there: you refresh the page and... nothing. Well, not "nothing" exactly, but that awkward moment when the screen goes blank while the server does its magic. As users, we hate those seconds of uncertainty. As developers, we knew we could do better.

## The Problem: When the Server Takes Its Time

We were working on an application with dynamic content rendered on the server. The flow was classic: the server receives the request, fetches the data, generates the HTML, and sends it to the client. Simple, right? The problem was in those "fetch the data" moments. Depending on the complexity of the query or the system load, those milliseconds turned into seconds of a blank screen. A user experience that left much to be desired.

The interesting thing is that we didn't need all the information to start showing something useful to the user. The page structure, the header, the placeholders... all of that could be ready while we waited for the heavy content. That's where React Suspense came into play, but not in the obvious way many think.

## The Twist: Suspense Is Not Just for the Client

When most developers hear "React Suspense," they immediately think of lazy loading client-side components. And yes, that's great, but Suspense has a lesser-known superpower: it can work perfectly with Server Components in Next.js to create progressive loading experiences from the server itself.

The idea is brilliantly simple: we wrap the components that need to perform costly operations (database calls, external APIs, file processing) with a `<Suspense>` boundary. While those components do their work, Next.js can start sending the HTML of the rest of the page to the client, including a skeleton or placeholder where the content will eventually appear.

## The Implementation: Less Code, More Impact

Let's see step by step how we transformed a problematic page into a smooth experience. I'll use a real example of a product page with search, something we've all built at some point.

### Step 1: The Original Problem

This is how we initially had the page. It's correct, functional code, but with a serious user experience problem:

```tsx
// app/products/page.tsx
export default async function ProductsPage({ searchParams }) {
  // This line blocks the ENTIRE render until it finishes
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

The problem: while `fetchProductsFromDatabase` does its job (which can take 1-3 seconds with complex filters), the user sees a completely blank screen. No header, no search bar, nothing. Just white.

### Step 2: Identify What Can Be Shown Immediately

Let's think: what parts of this page DO NOT depend on the product data?

The header with the title, the search bar, and the grid structure can be shown immediately, even if the grid is empty. The actual products, obviously, need to wait for the data to arrive.

This analysis is key. We need to separate the static from the dynamic.

### Step 3: Extract the Dynamic Content

First, we move the data loading logic to its own component. This step is crucial for Suspense to work:

```tsx
// app/products/page.tsx
export default function ProductsPage({ searchParams }) {
  return (
    <>
      <Header />
      <SearchBar />
      
      {/* Here is the data loading now */}
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

We haven't improved anything yet. In fact, we have the same problem: everything is still blocking. But now we have the correct structure to apply Suspense.

### Step 4: Add Suspense and the Skeleton

Now, we wrap the dynamic component with `<Suspense>` and create a fallback:

```tsx
// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage({ searchParams }) {
  return (
    <>
      <Header />
      <SearchBar />
      
      {/* This is the magic change */}
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

What happens now?

Immediately, in just 50-150ms, the user sees the header, the search bar, and the skeleton of 9 products. In parallel, the server is executing `fetchProductsFromDatabase` in the background. When the data finishes loading, Next.js sends the real HTML of the products and smoothly replaces the skeleton.

The result is evident: instead of 2 seconds of a blank screen, the user sees useful content in milliseconds.

### Step 5: Refine the Skeleton

A well-made skeleton replicates the exact structure of the real content:

```tsx
function ProductsSkeleton() {
  return (
    <div className="products-grid">
      {/* We show the same number of items we expect */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="product-card">
          {/* The image occupies the same space as the real one */}
          <div 
            className="skeleton-image" 
            style={{ aspectRatio: '1/1', background: '#e0e0e0' }}
          />
          {/* The title has the same height */}
          <div 
            className="skeleton-title" 
            style={{ height: '24px', background: '#e0e0e0', margin: '12px 0' }}
          />
          {/* The price is in the same position */}
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

Visual consistency is crucial. When the real content appears, there are no abrupt jumps in the layout.

### Step 6: The Complete Final Result

This is how our final implementation turned out, with all files organized:

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
  // This call no longer blocks the page render
  const products = await fetchProductsFromDatabase(searchParams);
  
  return <ProductGrid products={products} />;
}
```

With this implementation, we ensured that the user sees content in less than 200ms, while the skeleton clearly communicates that something is loading. The data loads in parallel without blocking the initial render, the code is better organized and more maintainable, all without touching a single line of backend or database code, and best of all: the SEO remains intact because it's still SSR.

## The Learning Curve (Which Isn't Really One)

The most surprising thing about this entire implementation was how little we had to learn. If you already know React and Next.js, you already know how to use Suspense. The complexity is not in the API (which is trivially simple), but in thinking architecturally: what can be shown immediately? what needs to wait for data? how do we divide our components to take advantage of it?

These are questions we should always ask ourselves, Suspense just gives us the tools to materialize them.

## The Final Result

We implemented Suspense in our dynamic content section and the results were immediate. The user feedback was unanimously positive: the application "feels" faster, more modern, more polished. Engagement metrics improved. All without touching a single line of backend code, without optimizing queries, without adding complex caching.

Sometimes, the best optimization is not to make things faster, but to make the wait not feel like a wait. React Suspense gave us exactly that: the ability to transform blank screens into smooth and progressive experiences, maintaining the benefits of Server-Side Rendering and without complicating our code.

If you work with Next.js and Server Components, and you haven't yet explored Suspense beyond lazy loading routes, you're missing out on one of the most powerful tools to improve user experience with minimal effort. It's not magic, it's simply React doing what it does best: thinking in components and their lifecycle, now elegantly extended to the server.
