---
title: "Web accessibility: how we applied WCAG 2.2 AA to aitorevi.dev"
description: "A practical walkthrough of the technical decisions that brought aitorevi.dev to WCAG 2.2 Level AA compliance: contrast, focus, semantics, motion and more."
publishDate: 2026-05-05
tags:
  - Accessibility
  - WCAG
  - Astro
  - CSS
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
---

Web accessibility has a reputation for being the topic everyone postpones. It's assumed to be expensive, hard to audit, and that "not that many users really need it." I thought the same not long ago. This article is the result of being wrong about that.

Over the past few months I've worked on bringing **aitorevi.dev to WCAG 2.2 Level AA compliance**. Not because any regulation requires it — it's a personal blog, not covered by EU Directive 2016/2102 — but because I wanted to genuinely understand what it means to build a website that anyone can use.

## What WCAG is and why it matters

The **Web Content Accessibility Guidelines** (WCAG) are the accessibility guidelines published by the W3C/WAI. Version 2.2, released in October 2023, organises all its criteria around four principles:

- **Perceivable**: content must be presentable regardless of the sense being used.
- **Operable**: all functionality must be activatable without a mouse.
- **Understandable**: language, navigation and error handling must be clear and predictable.
- **Robust**: markup must be interpretable by current and future assistive technologies.

Level AA is the reference standard for most European regulations. Level AAA adds stricter criteria, such as a minimum contrast ratio of 7:1 for normal text.

## What we implemented

### Colour contrast

This is the most visible criterion and, in many cases, the most neglected. WCAG 2.2 requires a minimum ratio of **4.5:1** for normal text and **3:1** for large text (≥ 18pt or ≥ 14pt bold).

On aitorevi.dev we work with two palettes — light and dark — and every colour that appears on screen went through the contrast calculator. Some results:

| Element | Light | Dark |
|---|---|---|
| Body text | 18.1:1 | 15.8:1 |
| Accent (violet) | 5.3:1 | 7.2:1 |
| Muted text | 4.7:1 | 5.9:1 |

Dark mode, somewhat surprisingly, was easier to push towards AAA: the `#0f1419` background (near-black) gives almost any light colour a generous ratio. Light mode, on the other hand, required several iterations on accent colours.

The nav controls (language switcher, theme toggle, motion toggle) were a special case: we want them to have lower visual prominence than the main nav links, but without dropping below the AA minimum. The solution was `text-slate-500` in light mode (4.6:1 ✓) and `text-slate-400` in dark mode (7.4:1 ✓✓).

### Keyboard navigation and visible focus

Every interactive element must be reachable and activatable via `Tab` and `Enter`/`Space`. This seemed trivial until I realised some custom buttons were missing the correct semantic role.

Criterion **2.4.11** (Focus Appearance, new in WCAG 2.2) requires the focus indicator to be visible and have sufficient contrast. Instead of `outline: none` (the original sin of frontend), we keep the browser's native outline and add extra visibility with `focus-visible`.

### Skip to content link

Invisible to mouse users, essential for keyboard users. It lives in the Layout and appears on first `Tab` interaction:

```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">
  Skip to main content
</a>
```

Without this link, someone navigating only by keyboard would have to tab through every nav link on every page load.

### HTML semantics and ARIA

Every section uses the correct semantic element: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`. The `<nav>` elements carry `aria-label` to distinguish between the main navigation and the legal links in the footer.

Decorative separators (`·`, lines, dividers) have `aria-hidden="true"` so screen readers skip them. Icons carry `aria-hidden="true"` when there's adjacent text, and `aria-label` when they're the sole content of an interactive element.

The contact form was particularly careful: every `<input>` has its explicit `<label>`, and the honeypot field — an anti-spam trick that must not be seen by real users — is wrapped in a `<label>` with `title` to comply with WCAG techniques H44 and H65.

### Language declaration

Each page declares its language with `lang="es"` or `lang="en"` on the `<html>` element. It's a simple criterion but a fundamental one: a screen reader needs to know what language to use when pronouncing content.

In a bilingual blog, this also means that English and Spanish pages never share a URL — each has its own path under `/en/` or at the root.

### Motion toggle (WCAG 2.3.3)

This was the most interesting criterion to implement. WCAG 2.3.3 (Level AAA) allows users to disable animations triggered by interaction. The operating system already offers `prefers-reduced-motion`, but not every user knows how to configure it or is able to.

The `MotionToggle` in the nav adds an extra layer of control: when activated, it writes `data-motion-reduce` to the `<html>` element. In CSS, that attribute disables all transitions and animations:

```css
[data-motion-reduce] *,
[data-motion-reduce] *::before,
[data-motion-reduce] *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

The preference is persisted in `localStorage` so it survives navigation.

### Images and text alternatives

Every `<img>` has an `alt` attribute. Decorative images carry `alt=""` so screen readers skip them. Content images (article covers, diagrams) carry real descriptions in the alt, not generic ones like "image of the article".

The WCAG 2.2 AA badge in the footer is a good example: `alt="Level AA of the Web Content Accessibility Guidelines 2.2, W3C-WAI"`. A precise description, without being redundant given the context.

## Tools we used

- **axe DevTools** (browser extension): automated analysis of the rendered page. It doesn't catch everything, but it eliminates the obvious errors.
- **Custom `axe-check` script** with Playwright: runs axe against main routes in CI and fails the build if there are violations.
- **Manual keyboard review**: the only real way to check the navigation flow.
- **APCA/WCAG contrast calculator**: to verify every colour pair before adding it to the palette.

## The accessibility statement

Following the European model (EN 301 549 and EU Directive 2016/2102), the site now has an [accessibility statement](/en/accessibility) page formally documenting the conformance level, technologies used, and the procedure for reporting barriers.

It's not a legal requirement for a personal blog, but it is a signal of genuine commitment — and a reminder to myself to maintain what I declared.

## Conclusions

Accessibility is not a checklist you tick once and forget. It's a way of working. Every new component, every colour change, every interactive element is an opportunity to get it right or to create a barrier for someone.

What surprised me most about the process was that **most accessibility improvements also improved the experience for every user**: better contrast is more readable for everyone, keyboard navigation is faster for power users, correct `aria-label`s make the code more self-documenting.

Level AA is reached. The path to AAA remains open.
