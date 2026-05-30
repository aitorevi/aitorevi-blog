---
title: 'SAP Analyzer: hexagonal en acción (del mock a SAP real sin tocar el dominio)'
description: >-
  Construir un dashboard de ventas con arquitectura hexagonal, Result/Error, SQLite
  y un adaptador que conecta a SAP real. La promesa del puerto, cumplida.
publishDate: 2026-05-29
tags:
  - Arquitectura
  - Hexagonal
  - Testing
  - Result
  - SAP
draft: true
featured: false
author:
  name: aitorevi
  avatar: /avatar.webp
---

## El problema: una fuente de datos que va a cambiar (y no quiero enterarme)

Tengo que pintar un dashboard con datos de SAP. Hoy no tengo SAP: tengo un `.txt` que imita su export. Mañana habrá un sandbox de OData. Pasado, una conexión real a un tenant. ¿Cómo organizo el código para que ese baile **no me obligue a reescribir el backend cada vez**?

La tentación es la de siempre: meter `HttpClient` en el controlador, parsear ahí mismo, y "ya lo refactorizamos cuando llegue OData". Hasta que llega. Y descubres que la mitad del proyecto sabe demasiado sobre el origen de los datos.

> Cuando el origen va a cambiar, lo único que tiene que cambiar es **el adaptador**. El resto del sistema no se debería enterar.

## La idea: un puerto, varios adaptadores

La forma honesta de cumplir esa promesa es la arquitectura hexagonal: capas que apuntan **siempre hacia el dominio**, con interfaces (puertos) entre las fronteras.

```
   Fuente (Mock | SAP)
        │
        ▼  ISalesRepository.SearchAsync
   IngestSales (use case)
        │
        ▼  ISalesStore.SaveAsync
       SQLite
        │
        ▼  ISalesStore.ReadAllAsync
   SalesAnalytics ────▶  Dashboard
```

Dos puertos outbound (`ISalesRepository` para la fuente, `ISalesStore` para el almacén) y un puerto inbound (HTTP, vía controlador). Vamos por partes.

### Paso 1: el dominio, puro

Sin framework, sin HTTP, sin SQL. Solo entidades y el tipo transversal que vamos a usar para hablar de errores:

```csharp
public record Sale(
    DateOnly Date,
    string CustomerId,
    string ProductName,
    int Quantity,
    decimal Amount);
```

Para los errores esperables uso `Result<T>`/`Error` propios (sin librerías). Si esto te suena nuevo, te lo conté en detalle en [Result Pattern en TypeScript](/blog/result-pattern-typescript): la idea es la misma, en C#. Los errores **no se lanzan**, **se devuelven** como valor.

### Paso 2: el puerto

Una interfaz, y nada más. **Es la única firma que conoce el origen de los datos**:

```csharp
public interface ISalesRepository
{
    Task<Result<IReadOnlyList<Sale>>> SearchAsync(CancellationToken ct = default);
}
```

Cualquier cosa que quiera "leer ventas" depende de esto. No de un `HttpClient`, no de un fichero, no de SAP. **De esto.**

### Paso 3: el primer adaptador (el mock)

El mock vive en `Infrastructure/Outbound/MockTxt/`. Es la única clase que sabe que el fichero está en `/sales.txt`, que va en ISO-8859-1 (Latin-1, porque SAP) y que las columnas son `DATE|CUSTOMER_ID|PRODUCT_NAME|QUANTITY|AMOUNT`:

```csharp
public sealed class MockTxtSalesRepository(HttpClient http) : ISalesRepository
{
    public async Task<Result<IReadOnlyList<Sale>>> SearchAsync(CancellationToken ct = default)
    {
        try
        {
            var bytes = await http.GetByteArrayAsync("/sales.txt", ct);
            var text = Encoding.GetEncoding("ISO-8859-1").GetString(bytes);
            // ... parseo a Sale ...
            return Result<IReadOnlyList<Sale>>.Success(sales);
        }
        catch (HttpRequestException ex)
        {
            return Result<IReadOnlyList<Sale>>.Failure(
                Error.Unavailable($"Could not reach the SAP data source: {ex.Message}"));
        }
        // OperationCanceledException se propaga: cancelar no es fallar.
    }
}
```

Dos detalles importantes:

- Las **excepciones de infraestructura se capturan en el borde** del adaptador y se traducen a `Result.Failure(Error.Unavailable(...))`. Del adaptador hacia arriba, nadie ve una excepción.
- Las **cancelaciones se re-lanzan**. Cancelar es una decisión del cliente, no un error de negocio.

### Paso 4: el momento "show me" — SAP real con un segundo adaptador

Hasta aquí, hexagonal de manual. La prueba de fuego: ¿realmente puedo cambiar el origen sin tocar el resto?

Escribo `SapODataSalesRepository`, que pega contra el [sandbox del SAP Business Accelerator Hub](https://api.sap.com) (cuenta gratis → API key → OData de `API_SALES_ORDER_SRV`). Misma firma del puerto, misma disciplina con `Result`:

```csharp
public sealed class SapODataSalesRepository(HttpClient http) : ISalesRepository
{
    public async Task<Result<IReadOnlyList<Sale>>> SearchAsync(CancellationToken ct = default)
    {
        try
        {
            var json = await http.GetStringAsync(
                "A_SalesOrderItem?$expand=to_SalesOrder&$top=200&$format=json", ct);
            var payload = JsonSerializer.Deserialize<ODataResponse>(json, JsonOptions);
            // ... mapeo de Material/RequestedQuantity/NetAmount/SoldToParty/CreationDate a Sale ...
            return Result<IReadOnlyList<Sale>>.Success(sales);
        }
        catch (HttpRequestException ex)
        {
            return Result<IReadOnlyList<Sale>>.Failure(Error.Unavailable(...));
        }
        catch (JsonException ex)
        {
            return Result<IReadOnlyList<Sale>>.Failure(Error.Unexpected(...));
        }
    }
}
```

Y en el composition root (`Program.cs`), una variable de configuración elige cuál se cablea. **Esto es lo único que cambia entre "uso el mock" y "uso SAP real":**

```csharp
if (string.Equals(salesSource, "Sap", StringComparison.OrdinalIgnoreCase))
{
    var apiKey = config["Sap:ApiKey"]
        ?? throw new InvalidOperationException("SalesSource=Sap requires Sap:ApiKey");
    builder.Services.AddHttpClient<ISalesRepository, SapODataSalesRepository>(client =>
    {
        client.BaseAddress = new Uri(config["Sap:BaseUrl"] ?? "https://sandbox.api.sap.com/...");
        client.DefaultRequestHeaders.Add("APIKey", apiKey);
    });
}
else
{
    builder.Services.AddHttpClient<ISalesRepository, MockTxtSalesRepository>(client =>
        client.BaseAddress = new Uri(config["SapMock:BaseUrl"] ?? "http://sap-mock:8080"));
}
```

El controlador, el caso de uso, el dominio: **ni se enteran**. La cabecera `APIKey` se inyecta en el composition root, así que el adaptador **tampoco** conoce el secreto.

## Persistencia con un segundo puerto

El siguiente paso del experimento: meter una DB. Pero **bien**, no en el adaptador de la fuente.

La hexagonal no tiene un solo puerto outbound. Aquí caben dos: la **fuente** (de dónde vienen los datos) y el **almacén** (dónde los guardamos nosotros). Cada uno con su contrato:

```csharp
public interface ISalesStore
{
    Task<Result<int>> SaveAsync(IReadOnlyList<Sale> sales, CancellationToken ct = default);
    Task<Result<IReadOnlyList<Sale>>> ReadAllAsync(CancellationToken ct = default);
}
```

El adaptador lo implementa con SQLite y SQL a mano (`Microsoft.Data.Sqlite`, sin ORM): decimales como texto invariante para no perder precisión, fechas en ISO. Misma disciplina: `SqliteException` se traduce en el borde a `Error.Unavailable`.

### Bind: el momento en que de verdad encadenas

Con dos puertos aparece el caso de uso que los conecta: **leer de la fuente y guardar en el almacén**. Tipos: `Task<Result<IReadOnlyList<Sale>>>` → `Task<Result<int>>`. Cualquiera de los dos puede fallar; quiero que el fallo del primero corte el segundo, sin un solo `if` ni `try`.

Eso es **bind**:

```csharp
public sealed class IngestSales(ISalesRepository source, ISalesStore store)
{
    public Task<Result<int>> ExecuteAsync(CancellationToken ct = default) =>
        source.SearchAsync(ct).BindAsync(sales => store.SaveAsync(sales, ct));
}
```

Una línea. Si la fuente devuelve `Failure(Unavailable)`, el `SaveAsync` no se ejecuta y ese mismo error sale por el otro lado. El controlador lo abre con un `Match` y lo traduce a HTTP en **un único sitio** (`ErrorHttpResults` → 404/400/502/500).

La analítica, mientras, ya no lee de la fuente: lee del almacén.

```csharp
public sealed class SalesAnalytics(ISalesStore store)
{
    public async Task<Result<IReadOnlyList<ProductTotal>>> TotalsByProductAsync(...)
    {
        var sales = await store.ReadAllAsync(ct);
        return sales.Map(AggregateByProduct);
    }
}
```

Y para que el dashboard tenga datos al primer render hay un **seed al arrancar** y un `POST /api/sales/refresh` para volver a tirar de la fuente cuando quieras.

## Testing: dobles sin librerías de mocking

El testing es donde más se nota la disciplina. **Cero librerías de mocking.** Stubs hechos a mano con factorías estáticas:

```csharp
public sealed class StubSalesRepository(Result<IReadOnlyList<Sale>> result) : ISalesRepository
{
    public static StubSalesRepository Returning(params Sale[] sales) =>
        new(Result<IReadOnlyList<Sale>>.Success(sales));
    public static StubSalesRepository Failing(Error error) =>
        new(Result<IReadOnlyList<Sale>>.Failure(error));

    public Task<Result<IReadOnlyList<Sale>>> SearchAsync(CancellationToken ct = default) =>
        Task.FromResult(result);
}
```

Los tests de `IngestSales` se leen como prosa:

```csharp
[Fact]
public async Task OnSourceFailure_ShortCircuitsAndDoesNotSave()
{
    var error = Error.Unavailable("source down");
    var store = StubSalesStore.Containing();
    var ingest = new IngestSales(StubSalesRepository.Failing(error), store);

    var result = await ingest.ExecuteAsync();

    Assert.Same(error, FailureError(result));
    Assert.Null(store.LastSaved); // el save nunca corrió
}
```

Integración con `WebApplicationFactory<Program>`: registras tus dobles en el contenedor y disparas peticiones reales contra el pipeline entero. **Sin internet, sin SAP, sin SQLite real**, y sin renunciar a probar el flujo completo.

## La promesa cumplida

Volvamos al principio: "cuando el origen cambie, lo único que tiene que cambiar es el adaptador". ¿Lo cumplimos?

- `Domain/` no sabe lo que es HTTP, OData, SAP, SQLite, ni nada. Lo verifico con un `grep`.
- `Application/` (`SalesAnalytics`, `IngestSales`) solo conoce sus puertos.
- Cambiar de mock a SAP real = **una variable de entorno** (`SalesSource=Sap`) más un secreto.
- Cambiar SQLite por Postgres = **un adaptador nuevo** que implemente `ISalesStore` + cambiar su registro en `Program.cs`.

Eso es todo. No hay magia ni metaprogramación: solo dos interfaces respetadas con disciplina.

## TL;DR

- Si el origen va a cambiar, **escóndelo tras un puerto**. Si la persistencia va a cambiar, **escóndela tras otro**.
- Errores esperables → `Result`. Excepciones solo para lo verdaderamente excepcional, **capturadas en el borde del adaptador**.
- Encadena con `Map` (transformaciones puras) y `Bind` (pasos que pueden fallar). El primer `Bind` real aparece en cuanto tienes dos puertos.
- El controlador es el **único** sitio que abre el `Result` (con `Match`). El dominio nunca conoce HTTP.
- Dobles sin librerías de mocking + `WebApplicationFactory`. Los tests son simples porque la arquitectura ya hizo el trabajo.

Código: [`aitorevi/sap-analyzer`](https://github.com/aitorevi/sap-analyzer). Demo en vivo: **[sap-analyzer.vercel.app](https://sap-analyzer.vercel.app)** (la primera carga puede tardar ~30 s: el backend y el mock duermen en el tier gratuito de Render).

**Spoiler:** mover la agregación al puerto (que cada origen empuje el `GROUP BY` donde tenga sentido — SQL para SQLite, `$apply` para OData) es el siguiente paso del experimento. Quizá sea otro post.
