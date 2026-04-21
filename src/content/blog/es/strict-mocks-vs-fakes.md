---
title: 'Strict mocks vs fakes: cuando el verde es mentira'
description: >-
  Un test puede estar en verde y aun así ocultar un bug. La diferencia entre strict mock y fake no es teórica: cambia qué estás verificando.
publishDate: 2026-04-21
coverImage: /images/blog/mock-fake/mock-fake-cover.webp
coverImageAlt: 'Escudo con tick verde rompiéndose con grietas rojas brillantes sobre un circuito oscuro.'
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
Un test en verde debería significar "esto funciona". Pero hay un tipo de test que se queda verde aunque el código esté roto, y hay otro que se pone en rojo aunque el código esté bien. Son el mismo test, solo que con un doble distinto debajo.

El primer caso es un strict mock mal usado. El segundo, también. La diferencia con un fake no es de sintaxis: es de qué estás verificando exactamente cuando miras el verde.

## El test que miente

Imagina un caso de uso sencillo: registrar un usuario y enviarle un email de bienvenida.

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

Con un strict mock, el test típico queda así:

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

Está en verde. Y a primera vista parece bueno: verifica que se guarda al usuario y que se envía el email. Pero fíjate en lo que realmente estás asertando: que se **llamó a `save`** con un `User` cualquiera, y que se **llamó a `send`** con un asunto exactamente igual a `"Welcome!"`.

No estás verificando que el usuario quede guardado. No estás verificando que el email contenga información útil. Estás verificando **la firma de las llamadas**, no el efecto que producen.

## La trampa: acoplarte al "cómo"

El día que alguien decide que `EmailGateway.send` debería recibir un objeto `Email` en vez de tres strings —porque así se pueden añadir adjuntos sin romper a veinte callers—, tu test se pone en rojo. No porque el comportamiento esté mal. Se pone en rojo porque la forma de la llamada cambió.

Acabas eligiendo entre dos caminos igual de malos:

1. **Reescribir el test** para que case con la nueva firma. Repítelo por cada refactor interno y lo que tenías era una red de seguridad; ahora es un lastre.
2. **Dejar el refactor a medias** para no tocar tests. Enhorabuena: el strict mock acaba de convertirse en un freno al diseño.

El mismo test puede fallar peor en el sentido contrario. Si un día alguien sustituye `emails.send(...)` por una cola interna y no toca la fachada, el mock se queda en verde. Has verificado una llamada que ya no representa el comportamiento real del sistema.

Verde cuando debería estar rojo. Rojo cuando debería estar verde. Las dos caras de la misma moneda: estás testando interacciones, no comportamiento.

## El fake: verificar lo que importa

Un fake es una implementación simple de la misma interfaz, que funciona de verdad en memoria. No graba llamadas: guarda datos, los devuelve, los compara. Es una dependencia real en miniatura.

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

El test cambia radicalmente de lo que afirma:

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

Ya no hay `verify`. Hay `assertThat`. Afirmas el **estado** del sistema después del caso de uso: que existe el usuario, que se envió el email de bienvenida. Si mañana `send` pasa a recibir un `Email` en vez de tres strings, tu test sigue en verde si el comportamiento se mantiene. Si alguien se cargara el envío de emails silenciosamente, el test se pone en rojo porque `welcomeWasSentTo` devuelve `false`.

Estás verificando el qué, no el cómo.

## Entonces, ¿los strict mocks sobran?

No. Hay un sitio legítimo para ellos: cuando la interacción **es** el comportamiento observable. Si estás testando un adapter cuyo único trabajo es llamar a una API externa con un payload específico, lo que quieres verificar es exactamente eso: que se hizo la llamada, con esos argumentos. Ahí el strict mock es la herramienta correcta.

La regla que uso en la práctica:

- **Puerto de salida con semántica propia** (repositorio, email, cache) → fake. Lo que importa es el estado que queda.
- **Puerto de salida que es puro pass-through** (adapter HTTP, cliente SDK) → mock. Lo que importa es la llamada.
- **Lógica de dominio** → sin dobles. Objetos reales.

El síntoma de que te estás equivocando es fácil de detectar: si tu test tiene `verify` sobre algo que tiene estado propio —un repositorio, un cache, una cola—, probablemente quieres un fake.

## El coste del fake

Tiene uno obvio: lo escribes tú. Un `InMemoryUserRepository` no aparece por arte de magia como un `mock(...)`. Y si cambias la interfaz, tienes que cambiar el fake.

Pero eso es exactamente lo que lo hace valioso. El fake **también** tiene que seguir el diseño del puerto. Si la interfaz te exige hacer cosas raras en el fake, probablemente la interfaz esté mal. Los fakes son feedback de diseño; los mocks, no.

Y si tienes ocho tests que usan el mismo fake, el fake lo escribiste una vez. Si son ocho strict mocks, lo has configurado ocho veces.

## Si quieres verlo en más lenguajes

Esta idea la llevamos a un taller con [Aitor Santana](https://www.linkedin.com/in/aitorscinfo/) en Nerdearla: **Mock 101**. Allí tocamos dummies, stubs, spies, mocks estrictos y fakes, con ejemplos paralelos en Java, Kotlin, TypeScript, Python, C# y Go. El código está todo en [mock-101](https://github.com/Sstark97/mock-101), y la crónica oficial en el [blog de Lean Mind](https://leanmind.es/es/blog/mock-101-el-arte-del-testing-una-experiencia-unica-en-nerdearla).

Si te llevas una sola cosa de aquí: antes de escribir `verify(...)` en tu próximo test, pregúntate si lo que te importa es la llamada o el efecto. Si es el efecto, escribe un fake. El verde volverá a significar que las cosas funcionan.
