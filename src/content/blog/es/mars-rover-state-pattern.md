---
title: "La Saga Mars Rover: Aplicando el patrón estado"
description: "Saga Mars Rover parte 1: patrón State en Java para gestionar el direccionamiento del rover con sealed interfaces y tests parametrizados."
publishDate: 2024-07-17
coverImage: /images/blog/mars-rover-state-pattern/cover.webp
coverImageAlt: "Mars Rover sobre la superficie marciana, ilustración de portada del artículo sobre el patrón estado"
tags:
  - Java
  - Katas
  - Patrones
  - TDD
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/la-saga-mars-rover-aplicando-el-patron-estado"
canonicalSource: "Leanmind"
---

Este artículo ha sido coescrito con mi compañero Aitor Santana Cabrera, y será el primer artículo de una saga, en la que iremos compartiendo como hemos ido desarrollando la kata [mars rover](https://kata-log.rocks/mars-rover-kata), explicando paso por paso patrones o estrategias que usamos en cada sección del ejercicio, con el objetivo de documentarlo y compartir estas técnicas.

## Primeros pasos

El lenguaje que hemos utilizado para la kata es Java, en concreto su versión 17 con Gradle (Groovy). La idea es una vez acabado el ejercicio, implementar un servicio con Spring(Webflux) y poder interactuar a través de un frontend.

Lo primero que hicimos fue un test inicial que nos permitiera ir construyendo el código que sabemos que queremos escribir, apoyándonos en el IDE (IntelliJ) para ello:

```java
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class RoverShould {
    @Test
    void start_with_initial_position_facing_initial_direction () {

        Rover rover = new Rover(new Position(0,0), new North());

        assertThat(rover.getPosition()).isEqualTo(new Position(0,0));
        assertThat(rover.getDirection()).isEqualTo(new North());
    }
}
```

Esto no compilará porque no tenemos nada creado aún, lo iremos creando poco a poco con la ayuda del IntelliJ:

```java
public record North() {
}


public record Position(int x, int y) {
}


public class Rover {

    public Rover(Position position, North north) {
    }

    public Position getPosition() {
        return null;
    }

    public North getDirection() {
        return null;
    }
}
```

Una vez tenemos estos artefactos el test compilará pero en rojo, justo lo que queremos.

Para pasarlo a verde basta con retornar en `Rover` lo que nos pide el test:

```java
public class Rover {
        /*...*/
        public Position getPosition() {
        return new Position(0,0);
    }

    public North getDirection() {
        return new North();
    }
}
```

Hicimos un pequeño refactor en los tests, añadiendo algunas variables para darle algo de semántica:

```java
public class RoverShould {
    @Test
    void start_with_initial_position_facing_initial_direction () {
        Position initialPosition = new Position(0, 0);
        North initialDirection = new North();
        Rover rover = new Rover(initialPosition, initialDirection);

        assertThat(rover.getPosition()).isEqualTo(initialPosition);
        assertThat(rover.getDirection()).isEqualTo(initialDirection);
    }
}
```

Una vez hecho esto, pasamos a testar el giro de nuestro `Rover`.

## Aplicando el patrón State

El primer test que planteamos fue el giro a la izquierda, partiendo de la posición y dirección iniciales. Como la dirección inicial es norte, si giramos a la izquierda, la dirección resultante es la oeste.

```java
public class RoverShould {		
    /*...*/
    @Test
    void turn_left () {
        Position initialPosition = new Position(0, 0);
        North initialDirection = new North();
        Rover rover = new Rover(initialPosition, initialDirection);

                rover.turnLeft();

        assertThat(rover.getDirection()).isEqualTo(new West());
    }
}
```

Para plantear este caso decidimos utilizar el patrón estado `"State pattern"`. Para ello, lo que tenemos que hacer es utilizar en el `Rover` una interface que desacople las diferentes direcciones, y nos permita abstraernos del comportamiento de ese estado.

```java
    public sealed interface Direction permits North, West {}
```

Estamos usando `sealed interfaces` para asegurarnos aún más que solo las clases que queramos implementen el contrato de `Direction`.

De esta forma, en el `rover` cuando hagamos un giro a la izquierda podemos asignar el estado `Direction` a una nueva instancia de la clase West.

```java
    public class Rover {
    
        private Direction direction;
    
        public Rover(Position position, Direction direction) {
            this.direction = direction;
        }
    
        public Position getPosition() {
            return new Position(0,0);
        }
    
        public Direction getDirection() {
            return this.direction;
        }
    
        public void turnLeft() {
            this.direction = new West();
        }
    }
```

Pero aún no hemos terminado de implementar el patrón estado, ya que si giramos a la izquierda partiendo de la dirección oeste, no vamos a encarar a la dirección esperada, que sería sur, ya que está hardcodeado que el resultado sea `West`.

Nuestro siguiente paso será hacer un nuevo test en el que giremos dos veces a la izquierda para acabar encarando al sur y empezar a aplicar el patrón estado per se.

```java
public class RoverShould {
    Position initialPosition;
    Direction initialDirection;
    Rover rover;
        
    /*...*/

    @Test
    void turn_left_twice() {
        rover.turnLeft();
        rover.turnLeft();
        assertThat(rover.getDirection()).isEqualTo(new South());
    }
}
```

Una vez planteado el test, lo que hicimos fue añadir un método `turnLeft` a la interfaz `Direction`, para que sean las clases que implementen la interfaz las que tengan la responsabilidad de generar el nuevo estado.

```java
public sealed interface Direction permits North, South, West {
    Direction turnLeft();
}


// Si giramos a la izquierda en el Norte el nuevo estado será Oeste
public record North() implements Direction{
    @Override
    public Direction turnLeft() {
        return new West();
    }
}


// Si giramos a la izquierda en el Oeste el nuevo estado será Sur
public record West() implements Direction{
    @Override
    public Direction turnLeft() {
        return new South();
    }
}
```

De está forma, el `Rover` lo único que tiene que saber es que la dirección tiene un método que le hace cambiar el estado. El método `turnLeft`, pero la gestión del mismo la desconoce, por lo que tendremos una mayor cohesión en nuestro código.

```java
public class Rover {
    /* ... */
    public void turnLeft() {
        direction = direction.turnLeft();
    }
}
```

Para probar los demás casos, decidimos hacer un test parametrizado con las anotaciones de las cuales nos provee JUnit utilizando como fuente un `Enum`.

```java
public enum Directions {
    NORTH(new North(), new West()),
    SOUTH(new South(), new East()),
    EAST(new East(), new North()),
    WEST(new West(), new South());

    public final Direction initialDirection;
    public final Direction expectedDirection;

    Directions(Direction initialDirection, Direction expectedDirection) {
        this.initialDirection = initialDirection;
        this.expectedDirection = expectedDirection;
    }
}
```

Este `Enum` contendrá una dirección inicial y una dirección esperada, que luego consumiremos en nuestro test parametrizado.

```java
public class RoverShould {
    /*...*/
    @ParameterizedTest(name="facing in {0}")
    @EnumSource(value = DirectionsToLeft.class)
    void turn_left(DirectionsToLeft direction) {
        Rover rover = new Rover(initialPosition, direction.initialDirection);
        rover.turnLeft();
        assertThat(rover.getDirection()).isEqualTo(direction.expectedDirection);
    }
}
```

En el código de las demás direcciones tendremos la gestión del estado del giro hacia la izquierda. Para hacer el giro a la derecha utilizamos la misma lógica, le añadimos un método `turnRight`, y otro test parametrizado que comprueba esta nueva funcionalidad.

```java
public sealed interface Direction permits East, North, South, West {
    Direction turnLeft();
}


public class RoverShould {
    /*...*/
    @ParameterizedTest(name="facing in {0}")
    @EnumSource(value = DirectionsToRight.class)
    void turn_right(DirectionsToRight direction) {
        Rover rover = new Rover(initialPosition, direction.initialDirection);
        rover.turnRight();
        assertThat(rover.getDirection()).isEqualTo(direction.expectedDirection);
    }
}
```

## Conclusión

En esta kata nos encaja bien el patrón estado, ya que nos permite gestionar bastante bien el direccionamiento del `Rover`, abstrayendo ese comportamiento a las diferentes implementaciones del contrato `Direction`, dejando un código con un alto nivel de cohesión, y pudiendo cambiar el comportamiento en cualquier momento de manera sencilla.

Además, nos permite estar más abiertos para extender los movimientos del Rover, o incluso, para manejar el entorno que le rodea, como la detección de obstáculos, que implementaremos en futuras iteraciones de la kata y explicaremos en sucesivos artículos de esta saga.
