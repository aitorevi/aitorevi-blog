---
title: "Inversión de Dependencias: deja de acoplar lo que no debería estar junto"
description: "El acoplamiento hace que tocar una cosa rompa cinco. La Inversión de Dependencias es una de las herramientas más potentes para combatirlo."
publishDate: 2026-03-30
coverImage: /images/blog/dependency-inversion-cover/dependency-inversion-cover.webp
coverImageAlt: "Ilustración de piezas conectándose a través de una interfaz abstracta"
tags:
  - SOLID
  - Clean Code
  - Diseño
draft: false
featured: true
author:
  name: aitorevi
  avatar: /avatar.webp
---

Hay un momento en la vida de todo desarrollador junior en el que escribe una clase, la conecta con otra, y piensa: *"esto funciona, estoy contento"*. Y tiene razón. Funciona. El problema llega tres semanas después, cuando hay que cambiar algo y de repente tocar una cosa rompe otras cinco.

Ese es el síntoma. La causa, muchas veces, es el acoplamiento. Y una de las herramientas más potentes para combatirlo se llama **Inversión de Dependencias**.

## El problema: cuando una clase sabe demasiado

Imagina que estás modelando un interruptor de luz. Algo simple: pulsas, se enciende. Pulsas de nuevo, se apaga.

Una primera implementación podría ser así:

<!-- code-group -->
```java
class ConcreteLight {
    public void turnOn() {
        System.out.println("Light on");
    }

    public void turnOff() {
        System.out.println("Light off");
    }
}

class Switch {
    private ConcreteLight light;  // ← Switch sabe que ConcreteLight existe
    private boolean isOn = false;

    public Switch() {
        this.light = new ConcreteLight();  // ← Switch crea la luz
    }

    public void press() {
        if (isOn) {
            light.turnOff();
            isOn = false;
        } else {
            light.turnOn();
            isOn = true;
        }
    }
}
```

```typescript
class ConcreteLight {
  turnOn(): void {
    console.log("Light on");
  }

  turnOff(): void {
    console.log("Light off");
  }
}

class Switch {
  private light: ConcreteLight; // ← Switch sabe que ConcreteLight existe
  private isOn = false;

  constructor() {
    this.light = new ConcreteLight(); // ← Switch crea la luz
  }

  press(): void {
    if (this.isOn) {
      this.light.turnOff();
      this.isOn = false;
    } else {
      this.light.turnOn();
      this.isOn = true;
    }
  }
}
```

```csharp
class ConcreteLight
{
    public void TurnOn() => Console.WriteLine("Light on");
    public void TurnOff() => Console.WriteLine("Light off");
}

class Switch
{
    private readonly ConcreteLight _light; // ← Switch sabe que ConcreteLight existe
    private bool _isOn;

    public Switch()
    {
        _light = new ConcreteLight(); // ← Switch crea la luz
    }

    public void Press()
    {
        if (_isOn) { _light.TurnOff(); _isOn = false; }
        else { _light.TurnOn(); _isOn = true; }
    }
}
```
<!-- /code-group -->

Funciona. Pero hay un problema oculto: **el Switch sabe que existe `ConcreteLight`**. Está hardcodeado dentro. Si mañana quieres que ese mismo Switch controle un ventilador, tienes que modificar `Switch`. Si quieres una SmartTV, modificas `Switch` de nuevo.

Cada nuevo dispositivo = modificar código que ya funcionaba. Eso es frágil.

## La raíz del problema: depender de lo concreto

El Switch está dependiendo de un *detalle de implementación*: una clase específica, con métodos con nombres específicos. Está acoplado a ella.

El principio de Inversión de Dependencias dice exactamente lo contrario:

> *Los módulos de alto nivel no deben depender de los módulos de bajo nivel. Ambos deben depender de abstracciones.*

Traducido al mundo real: el Switch no debería saber que existe `ConcreteLight`. Solo debería saber que lo que controla *puede encenderse y apagarse*. Nada más.

## La solución: depender de un contrato

Primero definimos la abstracción. Un contrato que dice: *"si implementas esto, puedes ser controlado por un Switch"*.

<!-- code-group -->
```java
interface Switchable {
    void turnOn();
    void turnOff();
    boolean isOn();
}
```

```typescript
// En TS el "implements" es opcional (tipado estructural),
// pero usarlo da errores en compilación si no cumples el contrato
interface Switchable {
  turnOn(): void;
  turnOff(): void;
  isOn(): boolean;
}
```

```csharp
// En .NET, las interfaces usan el prefijo "I" por convención
interface ISwitchable
{
    void TurnOn();
    void TurnOff();
    // En C# se usa una property en vez de un método getter
    bool IsOn { get; }
}
```
<!-- /code-group -->

Ahora los dispositivos firman ese contrato:

<!-- code-group -->
```java
class Light implements Switchable {
    private boolean on = false;

    @Override
    public void turnOn() {
        on = true;
        System.out.println("💡 Light on");
    }

    @Override
    public void turnOff() {
        on = false;
        System.out.println("💡 Light off");
    }

    @Override
    public boolean isOn() {
        return on;
    }
}

class Fan implements Switchable {
    private boolean on = false;

    @Override
    public void turnOn() {
        on = true;
        System.out.println("🌀 Fan on");
    }

    @Override
    public void turnOff() {
        on = false;
        System.out.println("🌀 Fan off");
    }

    @Override
    public boolean isOn() {
        return on;
    }
}
```

```typescript
class Light implements Switchable {
  private on = false;

  turnOn(): void {
    this.on = true;
    console.log("💡 Light on");
  }

  turnOff(): void {
    this.on = false;
    console.log("💡 Light off");
  }

  isOn(): boolean {
    return this.on;
  }
}

class Fan implements Switchable {
  private on = false;

  turnOn(): void {
    this.on = true;
    console.log("🌀 Fan on");
  }

  turnOff(): void {
    this.on = false;
    console.log("🌀 Fan off");
  }

  isOn(): boolean {
    return this.on;
  }
}
```

```csharp
class Light : ISwitchable
{
    // Auto-property con setter privado: sustituye al campo + getter manual
    public bool IsOn { get; private set; }

    public void TurnOn()
    {
        IsOn = true;
        Console.WriteLine("💡 Light on");
    }

    public void TurnOff()
    {
        IsOn = false;
        Console.WriteLine("💡 Light off");
    }
}

class Fan : ISwitchable
{
    public bool IsOn { get; private set; }

    public void TurnOn()
    {
        IsOn = true;
        Console.WriteLine("🌀 Fan on");
    }

    public void TurnOff()
    {
        IsOn = false;
        Console.WriteLine("🌀 Fan off");
    }
}
```
<!-- /code-group -->

Y el Switch ahora recibe la abstracción, no la clase concreta:

<!-- code-group -->
```java
class Switch {
    private final Switchable device;  // ← aquí está la inversión

    public Switch(Switchable device) {
        this.device = device;
    }

    public void press() {
        if (device.isOn()) {
            device.turnOff();
        } else {
            device.turnOn();
        }
    }
}
```

```typescript
class Switch {
  private readonly device: Switchable; // ← aquí está la inversión

  constructor(device: Switchable) {
    this.device = device;
  }

  press(): void {
    if (this.device.isOn()) {
      this.device.turnOff();
    } else {
      this.device.turnOn();
    }
  }
}
```

```csharp
class Switch
{
    private readonly ISwitchable _device; // ← aquí está la inversión

    public Switch(ISwitchable device)
    {
        _device = device;
    }

    public void Press()
    {
        if (_device.IsOn) _device.TurnOff();
        else _device.TurnOn();
    }
}
```
<!-- /code-group -->

La inversión ocurre en el constructor. En vez de `ConcreteLight`, el tipo es `Switchable`. El Switch ya no sabe qué hay al otro lado. Solo sabe que cumple el contrato.

## La inyección: quién conecta las piezas

Ahora alguien tiene que decidir qué dispositivo va con qué Switch. Ese alguien es el **punto de composición**: el único lugar del código donde se conecta todo.

<!-- code-group -->
```java
// Composition Root: el único lugar que conoce los detalles
Switch livingRoomSwitch = new Switch(new Light());
livingRoomSwitch.press();  // 💡 Light on

Switch deskSwitch = new Switch(new Fan());
deskSwitch.press();  // 🌀 Fan on
```

```typescript
// Composition Root: el único lugar que conoce los detalles
const livingRoomSwitch = new Switch(new Light());
livingRoomSwitch.press(); // 💡 Light on

const deskSwitch = new Switch(new Fan());
deskSwitch.press(); // 🌀 Fan on
```

```csharp
// Composition Root: el único lugar que conoce los detalles
var livingRoomSwitch = new Switch(new Light());
livingRoomSwitch.Press(); // 💡 Light on

var deskSwitch = new Switch(new Fan());
deskSwitch.Press(); // 🌀 Fan on
```
<!-- /code-group -->

El acto de pasarle el dispositivo al Switch desde fuera se llama **inyección de dependencias**. No es magia ni un framework: es simplemente que alguien de fuera decide qué entra, en vez de que la clase lo cree internamente.

## Añadir un dispositivo nuevo: el test real

¿Quieres añadir un aire acondicionado? Solo creas la clase y firmas el contrato. No tocas `Switch`, no tocas `Light`, no tocas nada existente.

<!-- code-group -->
```java
class AirConditioner implements Switchable {
    private boolean on = false;

    @Override
    public void turnOn() {
        on = true;
        System.out.println("❄️ Air conditioner on");
    }

    @Override
    public void turnOff() {
        on = false;
        System.out.println("❄️ Air conditioner off");
    }

    @Override
    public boolean isOn() {
        return on;
    }
}

// Y puedes usarlo directamente:
Switch livingRoomSwitch = new Switch(new AirConditioner());
livingRoomSwitch.press();  // ❄️ Air conditioner on
```

```typescript
class AirConditioner implements Switchable {
  private on = false;

  turnOn(): void {
    this.on = true;
    console.log("❄️ Air conditioner on");
  }

  turnOff(): void {
    this.on = false;
    console.log("❄️ Air conditioner off");
  }

  isOn(): boolean {
    return this.on;
  }
}

// Y puedes usarlo directamente:
const livingRoomSwitch = new Switch(new AirConditioner());
livingRoomSwitch.press(); // ❄️ Air conditioner on
```

```csharp
class AirConditioner : ISwitchable
{
    public bool IsOn { get; private set; }

    public void TurnOn()
    {
        IsOn = true;
        Console.WriteLine("❄️ Air conditioner on");
    }

    public void TurnOff()
    {
        IsOn = false;
        Console.WriteLine("❄️ Air conditioner off");
    }
}

// Y puedes usarlo directamente:
var livingRoomSwitch = new Switch(new AirConditioner());
livingRoomSwitch.Press(); // ❄️ Air conditioner on
```
<!-- /code-group -->

Ese es el poder real del principio. El sistema es **abierto a la extensión, cerrado a la modificación**.

## Conclusión

La Inversión de Dependencias no es un concepto complicado. Es una decisión de diseño que se resume en una frase:

**Depende de lo que hace, no de quién lo hace.**

Cuando el Switch depende de `ConcreteLight`, está acoplado a un *quién*. Cuando depende de `Switchable`, está acoplado a un *qué*. Y eso cambia todo: el código se vuelve extensible, testeable y mantenible.

La próxima vez que escribas una clase y veas que dentro hace un `new ConcreteClass()`, pregúntate: *¿necesito saber que es esta clase concreta, o me basta con saber qué puede hacer?*. Esa pregunta, repetida a lo largo de un proyecto, es la diferencia entre un código que escala y uno que se convierte en un castillo de naipes.
