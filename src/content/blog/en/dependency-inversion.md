---
title: "Dependency Inversion: stop coupling what shouldn't be together"
description: "Coupling means touching one thing breaks five. Dependency Inversion is one of the most powerful tools to fight it."
publishDate: 2026-03-30
coverImage: /images/blog/dependency-inversion/cover.webp
coverImageAlt: "Illustration of pieces connecting through an abstract interface"
tags:
  - SOLID
  - Clean Code
  - Design
draft: false
featured: true
author:
  name: aitorevi
  avatar: /avatar.webp
---

There's a moment in every junior developer's life when they write a class, connect it to another, and think: *"this works, I'm happy"*. And they're right. It works. The problem comes three weeks later, when something needs to change and suddenly touching one thing breaks five others.

That's the symptom. The cause, more often than not, is coupling. And one of the most powerful tools to fight it is called **Dependency Inversion**.

## The problem: when a class knows too much

Imagine you're modelling a light switch. Something simple: press it, it turns on. Press again, it turns off.

A first implementation might look like this:

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
    private ConcreteLight light;  // ← Switch knows ConcreteLight exists
    private boolean isOn = false;

    public Switch() {
        this.light = new ConcreteLight();  // ← Switch creates the light
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
  private light: ConcreteLight; // ← Switch knows ConcreteLight exists
  private isOn = false;

  constructor() {
    this.light = new ConcreteLight(); // ← Switch creates the light
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
    private readonly ConcreteLight _light; // ← Switch knows ConcreteLight exists
    private bool _isOn;

    public Switch()
    {
        _light = new ConcreteLight(); // ← Switch creates the light
    }

    public void Press()
    {
        if (_isOn) { _light.TurnOff(); _isOn = false; }
        else { _light.TurnOn(); _isOn = true; }
    }
}
```
<!-- /code-group -->

It works. But there's a hidden problem: **the Switch knows that `ConcreteLight` exists**. It's hardcoded inside. If tomorrow you want that same Switch to control a fan, you have to modify `Switch`. If you want a SmartTV, you modify `Switch` again.

Every new device = modifying code that already worked. That's fragile.

## The root of the problem: depending on the concrete

The Switch is depending on an *implementation detail*: a specific class, with specific method names. It's coupled to it.

The Dependency Inversion Principle says exactly the opposite:

> *High-level modules should not depend on low-level modules. Both should depend on abstractions.*

Translated to the real world: the Switch shouldn't know that `ConcreteLight` exists. It should only know that what it controls *can be turned on and off*. Nothing more.

## The solution: depend on a contract

First we define the abstraction. A contract that says: *"if you implement this, you can be controlled by a Switch"*.

<!-- code-group -->
```java
interface Switchable {
    void turnOn();
    void turnOff();
    boolean isOn();
}
```

```typescript
// In TS the "implements" is optional (structural typing),
// but using it gives compile errors if you don't fulfil the contract
interface Switchable {
  turnOn(): void;
  turnOff(): void;
  isOn(): boolean;
}
```

```csharp
// In .NET, interfaces use the "I" prefix by convention
interface ISwitchable
{
    void TurnOn();
    void TurnOff();
    // In C# a property is used instead of a getter method
    bool IsOn { get; }
}
```
<!-- /code-group -->

Now the devices sign that contract:

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
    // Auto-property with private setter: replaces field + manual getter
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

And the Switch now receives the abstraction, not the concrete class:

<!-- code-group -->
```java
class Switch {
    private final Switchable device;  // ← here's the inversion

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
  private readonly device: Switchable; // ← here's the inversion

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
    private readonly ISwitchable _device; // ← here's the inversion

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

The inversion happens in the constructor. Instead of `ConcreteLight`, the type is `Switchable`. The Switch no longer knows what's on the other side. It only knows it fulfils the contract.

## Injection: who connects the pieces

Now someone has to decide which device goes with which Switch. That someone is the **composition root**: the single place in the code where everything is wired together.

<!-- code-group -->
```java
// Composition Root: the only place that knows the details
Switch livingRoomSwitch = new Switch(new Light());
livingRoomSwitch.press();  // 💡 Light on

Switch deskSwitch = new Switch(new Fan());
deskSwitch.press();  // 🌀 Fan on
```

```typescript
// Composition Root: the only place that knows the details
const livingRoomSwitch = new Switch(new Light());
livingRoomSwitch.press(); // 💡 Light on

const deskSwitch = new Switch(new Fan());
deskSwitch.press(); // 🌀 Fan on
```

```csharp
// Composition Root: the only place that knows the details
var livingRoomSwitch = new Switch(new Light());
livingRoomSwitch.Press(); // 💡 Light on

var deskSwitch = new Switch(new Fan());
deskSwitch.Press(); // 🌀 Fan on
```
<!-- /code-group -->

The act of passing the device to the Switch from outside is called **dependency injection**. It's not magic or a framework: it's simply that someone from the outside decides what goes in, instead of the class creating it internally.

## Adding a new device: the real test

Want to add an air conditioner? Just create the class and sign the contract. You don't touch `Switch`, you don't touch `Light`, you don't touch anything that already exists.

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

// And you can use it straight away:
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

// And you can use it straight away:
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

// And you can use it straight away:
var livingRoomSwitch = new Switch(new AirConditioner());
livingRoomSwitch.Press(); // ❄️ Air conditioner on
```
<!-- /code-group -->

That's the real power of the principle. The system is **open for extension, closed for modification**.

## Conclusion

Dependency Inversion is not a complicated concept. It's a design decision that can be summed up in one sentence:

**Depend on what it does, not on who does it.**

When the Switch depends on `ConcreteLight`, it's coupled to a *who*. When it depends on `Switchable`, it's coupled to a *what*. And that changes everything: the code becomes extensible, testable and maintainable.

Next time you write a class and see it doing a `new ConcreteClass()` inside, ask yourself: *do I need to know it's this specific class, or is it enough to know what it can do?*. That question, repeated throughout a project, is the difference between code that scales and code that becomes a house of cards.
