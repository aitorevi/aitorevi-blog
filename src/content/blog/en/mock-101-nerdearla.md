---
title: "Mock 101: The Art of Testing, a Unique Experience at Nerdearla"
description: "Recap of our Mock 101 workshop at Nerdearla 2025: we taught dummies, stubs, spies, mocks, and fakes with practical katas in 6 programming languages."
publishDate: 2025-11-18
coverImage: /images/blog/mock-101-nerdearla/mock-101-nerdearla-cover.webp
coverImageAlt: "Lean Mind team delivering the Mock 101: The Art of Testing workshop at Nerdearla 2025"
tags:
  - Testing
  - Katas
  - Community
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/en/blog/mock-101-the-art-of-testing-a-unique-experience-at-nerdearla"
canonicalSource: "Leanmind"
---

On November 15, we participated in the programming event [**Nerdearla**](https://nerdearla.es/) with our workshop [Mock 101: The Art of Testing](https://nerdearla.es/agenda/mock-101-el-arte-del-testing/). We had the opportunity to share knowledge with an incredible community.

> "It has been a great experience and the audience's reception has been amazing. Without a doubt, we will repeat!"

The workshop exceeded our expectations. We welcomed many people interested in learning about testing, and it created an impressive and enriching learning and collaboration environment.

## What was the workshop about?

Our goal was clear: to teach the different types of test doubles that exist so that developers understand what testing libraries are really doing when they use their test doubles. Many people use Mockito, Jest, or similar without knowing that underneath there are dummies, stubs, spies, strict mocks, and fakes, each with a specific purpose.

We started with an explanatory talk, where we presented each type of test double, what it is, when to use it, and what problem it solves. This theoretical foundation was essential for them to later apply the concepts in practical exercises.

## Practical Approach: Understand Before Using

We designed two progressive katas where attendees could practice.

**Random Number Game:** A game where the player must guess a random number in three attempts. Here we worked with dummies (objects that are not really used) and stubs (objects that return predefined responses). The challenge: how to test a game with random numbers without the tests being unpredictable?

**Print Date:** A more advanced kata where we explored spies (to verify interactions), strict mocks (to ensure specific behaviors), and fakes (lightweight implementations for testing). The challenge: testing a method that prints the current date without changing its signature.

## From Theory to Practice

The most valuable part of the workshop was showing what libraries do for us.

First, we showed the implementation of each type of double, writing the code that Mockito or other libraries usually do.

Then we repeated the exercises using Mockito, and attendees could clearly see what abstraction the library provides and what is happening underneath.

This way, when they use mock, spy, or stub in their projects again, they will know exactly what type of double they are creating and why.

Additionally, we prepared the repository in 6 different languages (Java, Python, TypeScript, C#, Go, and Kotlin) so that each attendee could practice in their favorite tech stack.

[Workshop Repository](https://github.com/Sstark97/mock-101)

## Questions We Were Asked

The session was very active, and a couple of questions arose that are often repeated daily.

**When should we use test doubles?**

We explained that test doubles are great for unit tests when you want to isolate your code from external dependencies. For example, if your code calls an API or a database, using a test double allows you to test your logic without relying on external services that can be slow, expensive, or unpredictable. However, we made it clear that for integration or e2e tests, test doubles don't make much sense because you want to test that everything works together.

**Is it better to create our own test doubles or use libraries?**

Here we were straightforward: use libraries like Mockito or Jest. They are optimized and tested. The only reason to create manual test doubles is when you need something very simple (a stub that returns a fixed value) or when you have restrictions that prevent you from using external libraries. In fact, in the workshop, we implemented manual test doubles only to understand what the library does underneath, but in day-to-day use, the library is always the better option.

## An Inspiring Encounter: Brais Moure (MoureDev)

Besides the success of our workshop, the event gave us the opportunity to connect with community leaders. We had the pleasure of sharing a few minutes with Brais Moure (MoureDev), a key and highly respected figure on social media in the field of development and programming. An inspiring moment that reinforces the quality of networking at Nerdearla.

![Aitor Reviriego and Aitor Santana with Brais Moure (MoureDev)](/images/blog/mock-101-nerdearla/mock-101-nerdearla-2.webp)

## The Fun of Nerdearla: Beyond the Code

The event was a very fun experience overall. As a showcase of Nerdearla's unique atmosphere, they even had a car that simulated a rollover for all attendees. A playful activity that added excitement and a memorable touch to the day.

![Fun memories at Nerdearla](/images/blog/mock-101-nerdearla/mock-101-nerdearla-3.webp)

## Celebrating Synergy: Lean Mind and Next Digital

Beyond the workshop, the event was also special because it allowed us to meet many colleagues from Next Digital in person, with whom we now share a path. It was great to be able to chat, exchange ideas, and feel like part of the same team.

![Networking moment with Next Digital](/images/blog/mock-101-nerdearla/mock-101-nerdearla-4.webp)

## Acknowledgments

We want to thank Lean Mind for the support and the opportunity to participate in this event representing the company and experiencing this with the community. Also, thanks to the Nerdearla organization for the excellent management and for providing us the space to offer our workshop. And, of course, to the Next Digital team for joining us and sharing this special day.

Thank you to everyone who made this experience possible.
