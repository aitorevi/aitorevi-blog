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

Accessibility is the topic everyone postpones. It's assumed to be expensive, hard to audit, and there's always that background assumption that not many users really need it. I disagree.

Over the past few months I've been working on bringing aitorevi.dev to WCAG 2.2 Level AA compliance. No law requires it. It's a personal blog, not covered by EU Directive 2016/2102 or any equivalent regulation. I did it because I wanted to genuinely understand what it means to build a website that anyone can use, and I wanted to make that knowledge my own. There are people for whom an accessible website isn't a nice-to-have — it's the difference between being able to use it or not. That matters to me. And what I didn't fully anticipate is that almost everything that improves the experience for them ends up improving it for everyone else too.

Before writing a single line I spent several evenings reading. The guidelines, the criteria, the techniques, the examples, the complaints on forums, the good articles and the not-so-good ones. I needed it. Accessibility is one of those areas where things have far more nuance than they appear, and where blindly applying the first thing you read ends up being worse than doing nothing.

## What WCAG is, briefly

The Web Content Accessibility Guidelines are the specifications published by the W3C through its WAI initiative. Version 2.2 came out in October 2023 and groups its criteria around four principles: that content can be perceived, that it can be operated without a mouse, that it can be understood, and that the markup is robust. Nothing new there.

What's less often mentioned is that each criterion has a level assigned to it. A is the minimum, AA is the reference standard that almost everyone uses, and AAA is the most demanding. AAA asks for things like a contrast ratio of 7:1 instead of 4.5:1, or that text can be understood by someone with a secondary-education reading level, or that ambiguous words have their pronunciation marked. Serious stuff.

## I started aiming for AAA

I'll admit it. When I started, my head went straight for AAA. If you're going to do it, do it properly, right? Well, not quite. Or yes, but with caveats.

I went through the criteria one by one and at first things went reasonably well. Contrast, focus indicators, animations — the things that made sense. The problem started when I reached areas where it was no longer a matter of tightening a few screws, but of changing the nature of what I do here.

The one that stopped me was 3.1.5, the reading level criterion. It requires that content can be understood at a secondary-education level, or that you offer a simpler alternative version. I have some lighter, more accessible articles, but as time goes on I learn more, gain more experience and cover more complex topics — more technical, with more depth. It's not that I use complicated language for the sake of it; it's that the subject is what it is. And maintaining a simplified version of each article in parallel, aside from being pedagogically questionable, is simply not feasible for me.

When I decided to step down to AA, there were more criteria where I could see I was nowhere near the AAA target. Sign language for videos, pronunciation marking, avoiding abbreviations. I preferred to commit to AA, meet it properly, and not deceive anyone — including myself.

That said, along the way I implemented things that go beyond AA. Some I've kept, because the code was already there and because they genuinely improve the experience for real people. I mention them as they come up.

## Contrast and what it cost me to make it look right

Of all the criteria, contrast is the one you notice most at first glance. WCAG requires 4.5:1 for normal text and 3:1 for large text. It sounds straightforward until you open the calculator and start entering colours.

I have two palettes, one light and one dark, and every colour that appears on screen went through verification. Some numbers for context — you can see them in the [Design System](https://www.aitorevi.dev/styleguide).

| Element         | Light  | Dark   |
|-----------------|--------|--------|
| Body text       | 18.1:1 | 15.8:1 |
| Accent (violet) | 5.3:1  | 7.2:1  |
| Muted text      | 4.7:1  | 5.9:1  |

Dark mode gave me less trouble. When you start from a near-black background like `#0f1419`, almost any light colour on top will pass. Light mode was another story. The violet accents took several iterations because they either came out too pale on white, or too intense — and then the eye jumped there instead of to the text. Visual ergonomics is a constant negotiation between aesthetics and legibility.

What I did from the start was componentise thoroughly. Every colour, every token, lives in a single place. If I want to change the accent in light mode, I change it in one variable and the rest of the blog picks it up. This, which sounds like basic practice, was what let me iterate on the palette without going mad. Swapping one violet for another and checking contrast across forty places at once isn't something you can do by hand. And if you try, you'll make mistakes.

The nav controls (language, theme, motion) have their own story. I wanted them to carry less visual weight than the main links, but without dropping below the AA minimum. The solution was `text-slate-500` for light (4.6:1, just above the minimum) and `text-slate-400` for dark (7.4:1, comfortably above).

## Comfortable reading

This isn't strictly WCAG, or at least it's not a numbered criterion, but it's part of the same thing: that text can actually be read.

I spent a lot of time on the maximum content width in articles. Too narrow is tiring, too wide and the eye gets lost jumping between lines. I settled around 70 characters per line, which is the range where most typographers agree. Line height, paragraph spacing, base font size — I worked on all of it until reading here didn't tire me out. If it tires me, it'll tire everyone else.

These are the things that don't show up in an automated audit. They don't appear in `axe`, no checklist catches them. But they're what separates a website that complies from one that actually reads well.

## The day I discovered my buttons weren't buttons

Once you start navigating your own website using only `Tab`, you notice several things at once. The first is that tabbing through the whole menu on every page is exhausting. That's what the skip-to-content link is for — invisible unless it receives focus. It lives at the top of the layout and takes you straight to `<main>`.

```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">
  Skip to main content
</a>
```

I also discovered that many browsers already render a decent focus indicator if you don't remove it. Criterion 2.4.11 in WCAG 2.2 is new and addresses exactly this — that focus is visible. The most sensible solution is almost always to not use `outline: none` and then add whatever extra visibility is needed with `focus-visible`. I had fallen into the original sin of frontend. I fixed it.

## Semantics and ARIA

There's not much to say here that hasn't been said a thousand times. `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>` where they belong. The `<nav>` elements with their `aria-label` to distinguish the main navigation from the legal links in the footer. Icons with `aria-hidden` when there's adjacent text, and `aria-label` when they're the sole content of an interactive element.

The interesting detail was the honeypot field in the contact form — that invisible field used to catch bots. It turns out it needs to be accessible too. It sounds absurd, but the logic is sound: a screen reader user shouldn't encounter an orphaned field without knowing what to do with it. I wrapped it in a `<label>` with `title`, which is what WCAG techniques H44 and H65 recommend. It's one of those things you only discover if you read the techniques carefully.

## Language

`lang="es"` or `lang="en"` on the `<html>` element, depending on the page. It's one of those attributes most templates ship pre-filled and nobody checks. For a screen reader it's the difference between reading "hello world" in English or in mangled pronunciation. In a bilingual blog this also means that Spanish and English pages never share a URL. Each language has its own path. English pages live under `/en/`.

## The motion toggle, which shouldn't really be here

This section is an honest leftover from when I was aiming for AAA. Criterion 2.3.3 is Level AAA, not AA, and requires that users be able to disable animations triggered by interaction. The operating system already offers `prefers-reduced-motion`, yes, but there are people who don't know that setting exists or how to find it in their control panel.

When I dropped the bar to AA, this toggle stopped being mandatory. I kept it anyway. The code was already there, the usefulness for someone sensitive to motion is real, and pulling it out just because I no longer needed it for the label struck me as pointless. It works by writing a `data-motion-reduce` attribute to the `<html>` element and, from CSS, cancelling durations and transitions.

```css
[data-motion-reduce] *,
[data-motion-reduce] *::before,
[data-motion-reduce] *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

The preference is saved in `localStorage` so it persists across pages.

## Images

Every `<img>` with its `alt`. Decorative ones with `alt=""` so screen readers skip them. Content images with real descriptions — not things like "image of the article" which are worse than nothing.

The AA badge in the footer I described like this: "Level AA of the Web Content Accessibility Guidelines 2.2, W3C-WAI". Long, yes, but it doesn't repeat across dozens of places. It appears exactly once.

## The tools I ended up using

I tried several and settled on four.

`axe DevTools`, the browser extension, for the obvious errors. It doesn't catch everything by a long shot, but the basic failures don't slip past it. With that I cleared a lot of issues in a couple of evenings.

A custom script with Playwright I call `axe-check`. It runs axe against the main routes in CI and fails the build if it finds violations. This is what ensures you don't introduce a regression without noticing.

Manual keyboard review. This can't be automated. You have to do it. And every time I do, I find something new.

A contrast calculator — in my case one that compares both WCAG and APCA. Any one will do, but using it consistently before adding a new colour to the palette saves rewrites later.

The result measured in May 2026 with PageSpeed Insights: 97 in Performance, 100 in Accessibility, 100 in Best Practices and 100 in SEO on mobile. On desktop, all four categories at 100. I didn't start this for the numbers, but seeing 100 in Accessibility confirms the work makes sense.

## The accessibility statement

There's a European model, described in EN 301 549 and EU Directive 2016/2102, for how to declare the accessibility of a site. The idea is that anyone can know what level you comply with, using which technologies, and who to contact if they find a barrier.

As I said, nobody requires this of me. But I wrote my own [accessibility statement](/en/accessibility) because it seems honest to declare what I claim to comply with. And because, frankly, having that page published is the best way to make sure I don't let things slide six months from now.

## What I take from this

I started this thinking it was a list of things to tick off. I ended up thinking it's a way of working. Every new component, every colour, every interaction is a decision that can add value or create a barrier. There's no way to "finish" accessibility. There's only a way to make it part of how you develop.

And beyond the guidelines, there's care. This sounds cheesy but I mean it. I haven't cut corners on this site. I've refined contrasts, rewritten components, adjusted reading widths, reviewed every image, every navigation flow, every interaction. Not because anyone required it, but because I wanted to. And I think that difference — the one between complying and being careful — is what you notice when someone uses the site and doesn't find anything strange. Which is exactly how it should feel.

What surprised me most, and I say this sincerely, is that most accessibility improvements turn out to be improvements for everyone. Better contrast is more readable for anyone. Keyboard navigation is faster once you get used to it. Well-placed `aria-label`s make the HTML read like a good book.

And AAA remains. For me, AAA is something almost platonic. I don't think I'll get there, and I'm honestly not sure I want to at the cost of how I write or how a form looks. But it's there, as a reference — as that idea that there's always one step higher to look towards when you choose the next colour or write the next component. And that, strange as it sounds, helps keep the real AA solid.
