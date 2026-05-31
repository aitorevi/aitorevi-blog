---
title: 'SAP Analyzer: hexagonal in action (from mock to real SAP without touching the domain)'
description: >-
  Building a sales dashboard with hexagonal architecture, Result/Error, SQLite,
  and an adapter that plugs into a real SAP. The port's promise, kept.
publishDate: 2026-05-29
coverImage: ../sap-analyzer/cover.webp
coverImageAlt: >-
  Bar chart of the SAP Analyzer dashboard showing total sales by product
tags:
  - Architecture
  - Hexagonal
  - Testing
  - Result
  - SAP
draft: false
featured: true
author:
  name: aitorevi
  avatar: /avatar.webp
---

## The problem: a data source that is going to change (and I do not want to care)

I need to render a dashboard with SAP data. Today there is no SAP: there is a `.txt` mimicking its export. Tomorrow there will be an OData sandbox. The day after, a real tenant. How do I structure the code so that this dance **does not force me to rewrite the backend every time**?

The usual temptation: shove an `HttpClient` into the controller, parse there, "we'll refactor when OData lands". Then it lands. And you discover half the project knows too much about where the data comes from.

> When the source is going to change, the only thing that should change is **the adapter**. The rest of the system should not even notice.

## The idea: one port, several adapters

The honest way to keep that promise is hexagonal architecture: layers that always point **toward the domain**, with interfaces (ports) at every boundary.

```
   Source (Mock | SAP)
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

Two outbound ports (`ISalesRepository` for the source, `ISalesStore` for the store) and one inbound port (HTTP, via the controller). Let's go step by step.

### Step 1: a pure domain

No framework, no HTTP, no SQL. Just entities and the cross-cutting type we will use to talk about errors:

```csharp
public record Sale(
    DateOnly Date,
    string CustomerId,
    string ProductName,
    int Quantity,
    decimal Amount);
```

For expected errors I use an in-house `Result<T>`/`Error` (no libraries). If this sounds new, I walked through it in [Result Pattern in TypeScript](/en/blog/result-pattern-typescript): same idea, same shape, in C#. Errors are **not thrown**, they are **returned as values**.

### Step 2: the port

An interface, nothing else. **It is the only signature that knows the data source exists**:

```csharp
public interface ISalesRepository
{
    Task<Result<IReadOnlyList<Sale>>> SearchAsync(CancellationToken ct = default);
}
```

Anything that wants to "read sales" depends on this. Not on an `HttpClient`, not on a file, not on SAP. **On this.**

### Step 3: the first adapter (the mock)

The mock lives in `Infrastructure/Outbound/MockTxt/`. It is the only class that knows the file lives at `/sales.txt`, that it is ISO-8859-1 (Latin-1, because SAP) and that the columns are `DATE|CUSTOMER_ID|PRODUCT_NAME|QUANTITY|AMOUNT`:

```csharp
public sealed class MockTxtSalesRepository(HttpClient http) : ISalesRepository
{
    public async Task<Result<IReadOnlyList<Sale>>> SearchAsync(CancellationToken ct = default)
    {
        try
        {
            var bytes = await http.GetByteArrayAsync("/sales.txt", ct);
            var text = Encoding.GetEncoding("ISO-8859-1").GetString(bytes);
            // ... parse into Sale ...
            return Result<IReadOnlyList<Sale>>.Success(sales);
        }
        catch (HttpRequestException ex)
        {
            return Result<IReadOnlyList<Sale>>.Failure(
                Error.Unavailable($"Could not reach the SAP data source: {ex.Message}"));
        }
        // OperationCanceledException propagates: cancellation is not a business failure.
    }
}
```

Two details worth noting:

- Infrastructure exceptions are **caught at the adapter's edge** and translated into `Result.Failure(Error.Unavailable(...))`. From the adapter upwards, nobody sees an exception.
- Cancellations **re-throw**. Cancelling is the caller's decision, not a business error.

### Step 4: the "show me" moment — real SAP with a second adapter

So far, textbook hexagonal. The litmus test: can I really swap the source without touching the rest?

I write `SapODataSalesRepository`, which talks to the [SAP Business Accelerator Hub sandbox](https://api.sap.com) (free account → API key → OData from `API_SALES_ORDER_SRV`). Same port signature, same `Result` discipline:

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
            // ... map Material/RequestedQuantity/NetAmount/SoldToParty/CreationDate into Sale ...
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

And in the composition root (`Program.cs`), one configuration variable picks which one is wired. **This is the only thing that changes between "I use the mock" and "I use real SAP":**

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

The controller, the use case, the domain: **none of them notice**. The `APIKey` header is injected at the composition root, so the adapter does not even know the secret.

## Persistence with a second port

The next step of the experiment: add a DB. But **properly**, not inside the source adapter.

Hexagonal does not have a single outbound port. Two fit nicely: the **source** (where data comes from) and the **store** (where we keep it). Each one with its own contract:

```csharp
public interface ISalesStore
{
    Task<Result<int>> SaveAsync(IReadOnlyList<Sale> sales, CancellationToken ct = default);
    Task<Result<IReadOnlyList<Sale>>> ReadAllAsync(CancellationToken ct = default);
}
```

The adapter implements it with SQLite and hand-written SQL (`Microsoft.Data.Sqlite`, no ORM): decimals as invariant text so we don't lose precision, dates as ISO. Same discipline: `SqliteException` is translated at the edge into `Error.Unavailable`.

### Bind: the moment chaining gets real

With two ports, a use case appears that connects them: **read from the source, save into the store**. Types: `Task<Result<IReadOnlyList<Sale>>>` → `Task<Result<int>>`. Either can fail; I want a failure in the first to short-circuit the second, with no `if` and no `try`.

That is **bind**:

```csharp
public sealed class IngestSales(ISalesRepository source, ISalesStore store)
{
    public Task<Result<int>> ExecuteAsync(CancellationToken ct = default) =>
        source.SearchAsync(ct).BindAsync(sales => store.SaveAsync(sales, ct));
}
```

One line. If the source returns `Failure(Unavailable)`, `SaveAsync` never runs and that same error comes out the other side. The controller opens it with `Match` and translates it to HTTP in **one single point** (`ErrorHttpResults` → 404/400/502/500).

The analytics, meanwhile, no longer read from the source: they read from the store.

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

So the dashboard has data on first render there is a **seed on startup** and a `POST /api/sales/refresh` to pull from the source again whenever you want.

## Testing: doubles without mocking libraries

Testing is where the discipline pays off. **Zero mocking libraries.** Hand-written stubs with static factories:

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

The `IngestSales` tests read like prose:

```csharp
[Fact]
public async Task OnSourceFailure_ShortCircuitsAndDoesNotSave()
{
    var error = Error.Unavailable("source down");
    var store = StubSalesStore.Containing();
    var ingest = new IngestSales(StubSalesRepository.Failing(error), store);

    var result = await ingest.ExecuteAsync();

    Assert.Same(error, FailureError(result));
    Assert.Null(store.LastSaved); // the save never ran
}
```

Integration with `WebApplicationFactory<Program>`: register your doubles in the container and fire real requests against the entire pipeline. **No internet, no SAP, no real SQLite**, and no compromise on exercising the full flow.

## The promise, kept

Back to the start: "when the source changes, the only thing that should change is the adapter". Did we keep it?

- `Domain/` does not know what HTTP, OData, SAP, SQLite, or anything else is. I check with `grep`.
- `Application/` (`SalesAnalytics`, `IngestSales`) only knows its ports.
- Going from mock to real SAP = **one environment variable** (`SalesSource=Sap`) plus a secret.
- Going from SQLite to Postgres = **one new adapter** implementing `ISalesStore` + swapping its registration in `Program.cs`.

That is all. No magic, no metaprogramming: just two interfaces respected with discipline.

## TL;DR

- If the source is going to change, **hide it behind a port**. If persistence is going to change, **hide it behind another one**.
- Expected errors → `Result`. Exceptions only for the truly exceptional, **caught at the adapter's edge**.
- Chain with `Map` (pure transforms) and `Bind` (steps that can fail). The first real `Bind` shows up as soon as you have two ports.
- The controller is the **only** place that opens the `Result` (with `Match`). The domain never knows about HTTP.
- Doubles without mocking libraries + `WebApplicationFactory`. The tests are simple because the architecture already did the work.

Code: [`aitorevi/sap-analyzer`](https://github.com/aitorevi/sap-analyzer). Live demo: **[sap-analyzer.vercel.app](https://sap-analyzer.vercel.app)** (first load can take ~30 s: the backend and mock sleep on Render's free tier).

**Spoiler:** pushing the aggregation down to the port (so each source can push the `GROUP BY` where it makes sense — SQL for SQLite, `$apply` for OData) is the next step of the experiment. Maybe another post.
