# Specify the behavioral contract

A reference entry lets a reader predict what a call does without reading its implementation. Cover the public surface a builder calls, configures, or handles. Show each declaration, generated from source when the toolchain allows, and write by hand the semantics that the type system cannot express. [content.md](content.md) explains which lists to link to rather than copy.

## Put shared rules before the entries

Document these once for each API family, before its entries, so that readers do not have to infer them from several entries:

- authentication and authorization;
- synchronous and asynchronous conventions, and cancellation;
- nullability and optional values;
- ownership, lifetime, disposal, and mutation;
- retries and idempotency;
- pagination, rate limits, and timeouts;
- the error hierarchy;
- thread, process, browser, or runtime safety;
- versioning, availability, deprecation, and feature detection.

## Use the function entry template

````markdown
## `createJob()`

Creates a persisted job and returns after the service accepts it.

```ts
function createJob(
  input: JobInput,
  options?: CreateJobOptions,
): Promise<Job>;
```

### Parameters

| Name | Direction | Type | Required | Description |
|---|---|---|---|---|
| `input` | in | `JobInput` | yes | Immutable job payload. Maximum serialized size: 1 MiB. |
| `options.signal` | in | `AbortSignal` | no | Cancels the request. It does not cancel a job the service has already accepted. |

### Returns
A promise that fulfills with a `Job` in the `pending` or `running` state once
the service accepts the request. It does not wait for the job to finish.

### Behavior
- Validates …
- Persists …
- Can …
- Does not …

### Preconditions
- …

### Side effects
- …

### Errors
| Error | When | Recovery |
|---|---|---|
| `ValidationError` | … | Correct the input; retrying unchanged input fails again. |
| `RateLimitError` | … | Retry after `retryAfterMs`; the call is idempotent when … |

### Special considerations
- Concurrency: …
- Ownership and lifetime: …
- Security and privacy: …
- Performance and limits: …
- Availability: …
- Deprecated: …; use … instead.

### Example
```ts
…
```

### See also
- [`job.result()`](…): wait for the completed output.
- [Cancel a job](…): stop work the service has accepted.
````

Omit headings that have nothing to say, and keep every contract dimension that applies to the entry.

## Specify what each parameter means

For each parameter or field of the entry, state:

- its direction: input, output, or both;
- its accepted domain, units, encoding, default, and limits;
- whether the callee reads, copies, retains, mutates, or consumes it;
- how it relates to other fields;
- what happens when it is absent, empty, zero, duplicated, or out of range.

In TypeScript, let the signature show optionality and unions, and explain the constraints that the types cannot encode.

## Distinguish every completion state

For an asynchronous operation, say exactly when each of these boundaries occurs:

- the request is accepted;
- the work is queued;
- the work starts;
- the promise resolves or the callback runs;
- the data is persisted;
- the operation completes;
- cancellation is requested, and cancellation is confirmed.

For a callback, also state how many times it runs, in what order, whether it can be reentered, its timeout and concurrency, and what happens when it throws.

## Treat errors as behavior

Report errors the way the interface does: typed exceptions, rejected promises, exit statuses, HTTP responses, events, or diagnostics. For each error a caller handles differently, give:

- what triggers it;
- its observable type, code, or status;
- whether partial state remains;
- whether a retry is safe;
- the recovery or alternative.

Errors that propagate from an underlying layer belong to that layer. Link to its error definitions instead of copying a list that changes with each release.

## Adapt the template to other surfaces

- **CLI command:** synopsis, arguments, options, precedence of environment and configuration, stdin, stdout, and stderr, exit statuses, side effects, idempotency, examples, and see also.
- **Type or interface:** purpose, declaration, the fields a reader sets or reads, invariants, ownership and mutability, serialization shape, construction, lifecycle, compatibility, and examples.
- **Event or webhook:** producer, trigger, delivery guarantees, ordering, retries, deduplication key, payload schema, signature verification, versioning, and an example.
- **Configuration key:** type, default, scope, precedence, reload behavior, security implications, supported versions, and an example.

## Keep lookup fast

- Group entries by user task on landing pages, and keep each symbol findable by its exact name.
- Link each entry to its best task example and to the concept it depends on ([architecture.md](architecture.md) covers cross-links).
- Use a table for behavior that depends on a mode or an edge case.

Document private machinery, such as internal fields, transport details, generated implementation files, or debug-only behavior, only when readers must interoperate with it. Label it unstable and name the supported abstraction.
