---
title: 'Strict mocks vs fakes: when green is a lie'
description: >-
  A test can be green and still hide a bug. The difference between a strict mock and a fake is not theoretical — it changes what you are verifying.
publishDate: 2026-04-21
coverImage: /images/blog/strict-mocks-vs-fakes/strict-mocks-vs-fakes-1.webp
coverImageAlt: 'Green check-mark shield breaking apart with red glowing cracks over a dark circuit board.'
tags:
  - Testing
  - TDD
  - Mocks
  - Test Doubles
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
---
A green test should mean "this works". But there is a kind of test that stays green even when the code is broken, and another that goes red even when the code is fine. They are the same test — only the double underneath has changed.

The first case is a strict mock misused. The second, also. The difference with a fake is not syntax: it is what you are verifying when you look at the green bar.

## The test that lies

Picture a simple use case: register a user and send them a welcome email.

```java
class RegisterUser {
    private final UserRepository users;
    private final EmailGateway emails;

    public RegisterUser(UserRepository users, EmailGateway emails) {
        this.users = users;
        this.emails = emails;
    }

    public void execute(String address) {
        var user = new User(address);
        users.save(user);
        emails.send(address, "Welcome!", "Thanks for signing up.");
    }
}
```

With a strict mock, the typical test looks like this:

```java
@Test
void registers_user_and_sends_welcome_email() {
    var users = mock(UserRepository.class);
    var emails = mock(EmailGateway.class);
    var register = new RegisterUser(users, emails);

    register.execute("alice@example.com");

    verify(users).save(any(User.class));
    verify(emails).send(eq("alice@example.com"), eq("Welcome!"), anyString());
}
```

It is green. And at first glance it seems fine: it verifies that the user is saved and the email is sent. But look at what you are actually asserting: that `save` **was called** with some `User`, and that `send` **was called** with a subject exactly equal to `"Welcome!"`.

You are not verifying that the user ends up stored. You are not verifying that the email carries useful information. You are verifying **the shape of the calls**, not the effect they produce.

## The trap: coupling to the "how"

The day someone decides `EmailGateway.send` should take a single `Email` object instead of three strings — so they can add attachments without breaking twenty callers — your test goes red. Not because the behaviour broke. It goes red because the call signature changed.

You are left choosing between two equally bad paths:

1. **Rewrite the test** so it matches the new signature. Repeat for every internal refactor, and what was a safety net becomes dead weight.
2. **Abandon the refactor** to avoid touching tests. Congratulations: the strict mock just became a brake on design.

The same test can fail worse in the opposite direction. If one day someone replaces `emails.send(...)` with an internal queue and keeps the facade happy, the mock stays green. You verified a call that no longer reflects the system's actual behaviour.

Green when it should be red. Red when it should be green. Two sides of the same coin: you are testing interactions, not behaviour.

## The fake: verifying what matters

A fake is a simple, in-memory implementation of the same interface that actually works. It does not record calls: it stores data, returns it, compares it. It is a real dependency in miniature.

```java
class InMemoryEmailGateway implements EmailGateway {
    private final List<Email> sent = new ArrayList<>();

    @Override
    public void send(String to, String subject, String body) {
        sent.add(new Email(to, subject, body));
    }

    public boolean welcomeWasSentTo(String address) {
        return sent.stream()
            .anyMatch(e -> e.to().equals(address) && e.subject().contains("Welcome"));
    }
}

class InMemoryUserRepository implements UserRepository {
    private final Map<String, User> users = new HashMap<>();

    @Override public void save(User user) { users.put(user.email(), user); }
    public Optional<User> findByEmail(String email) { return Optional.ofNullable(users.get(email)); }
}
```

The test shifts radically in what it asserts:

```java
@Test
void registers_user_and_sends_welcome_email() {
    var users = new InMemoryUserRepository();
    var emails = new InMemoryEmailGateway();
    var register = new RegisterUser(users, emails);

    register.execute("alice@example.com");

    assertThat(users.findByEmail("alice@example.com")).isPresent();
    assertThat(emails.welcomeWasSentTo("alice@example.com")).isTrue();
}
```

No more `verify`. Just `assertThat`. You are asserting the **state** of the system after the use case: the user exists, the welcome email went out. If tomorrow `send` starts taking an `Email` instead of three strings, your test stays green as long as the behaviour holds. If someone silently breaks the email dispatch, the test goes red because `welcomeWasSentTo` returns `false`.

You are verifying the what, not the how.

## So are strict mocks useless?

No. There is a legitimate place for them: when the interaction **is** the observable behaviour. If you are testing an adapter whose only job is to call an external API with a specific payload, what you want to verify is exactly that — that the call happened, with those arguments. There, the strict mock is the right tool.

The rule I use in practice:

- **Outbound port with its own semantics** (repository, email, cache) → fake. What matters is the resulting state.
- **Outbound port that is pure pass-through** (HTTP adapter, SDK client) → mock. What matters is the call.
- **Domain logic** → no doubles. Real objects.

The smoke signal that you are picking the wrong tool is easy to spot: if your test has `verify` on something that owns state — a repository, a cache, a queue — you probably want a fake.

## The cost of a fake

It has an obvious one: you write it. An `InMemoryUserRepository` does not materialise out of thin air like a `mock(...)`. And if you change the interface, you have to change the fake.

But that is precisely what makes it valuable. The fake **also** has to follow the port's design. If the interface forces you to do weird things in the fake, the interface is probably wrong. Fakes are design feedback; mocks are not.

And if you have eight tests sharing the same fake, you wrote the fake once. With eight strict mocks, you configured it eight times.

## If you want to see it in more languages

We took this idea to a workshop with [Aitor Santana](https://www.linkedin.com/in/aitorscinfo/) at Nerdearla: **Mock 101**. We covered dummies, stubs, spies, strict mocks, and fakes, with parallel examples in Java, Kotlin, TypeScript, Python, C#, and Go. All the code lives at [mock-101](https://github.com/Sstark97/mock-101), and the official recap is on the [Lean Mind blog](https://leanmind.es/es/blog/mock-101-el-arte-del-testing-una-experiencia-unica-en-nerdearla).

If you take one thing from all this: before writing `verify(...)` in your next test, ask yourself whether what you care about is the call or the effect. If it is the effect, write a fake. Green will go back to meaning things actually work.
