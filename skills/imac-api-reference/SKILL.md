---
name: imac-api-reference
description: Writes or repairs authoritative API, SDK, CLI, configuration, type, callback, event, and protocol reference entries in a modern Inside Macintosh format. Use when signatures lack behavioral contracts, parameter direction, async semantics, ownership, errors, compatibility, examples, or precise cross-links.
---

# Specify the complete public contract

Make every entry predictable and mechanically inspectable. Generate declarations from source when possible; hand-write semantics the type system cannot express.

## Put shared rules before entries

Document once per API family:

- authentication and authorization;
- sync/async and cancellation conventions;
- nullability and optional-value conventions;
- ownership, lifetime, disposal, and mutation;
- retries and idempotency;
- pagination, rate limits, and timeouts;
- error hierarchy;
- thread, process, browser, or runtime safety;
- versioning, availability, deprecation, and feature detection.

Do not make readers infer global conventions from several entries.

## Use this function entry template

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
| `options.signal` | in | `AbortSignal` | no | Cancels the request. It does not cancel a job already accepted by the service. |

### Returns
A promise that fulfills with a `Job` in `pending` or `running` state after the
service accepts the request. It does not wait for job completion.

### Behavior
- Validates …
- Persists …
- May …
- Does not …

### Preconditions
- …

### Side effects
- …

### Errors
| Error | When | Recovery |
|---|---|---|
| `ValidationError` | … | Correct …; do not retry unchanged input. |
| `RateLimitError` | … | Retry after `retryAfterMs`; the call is idempotent when … |

### Special considerations
- **Concurrency:** …
- **Ownership/lifetime:** …
- **Security/privacy:** …
- **Performance/limits:** …
- **Availability:** …
- **Deprecated:** …; use …

### Example
```ts
…
```

### See also
- [`job.result()`](…) — wait for completed output.
- [Cancel a job](…) — stop accepted work.
````

Omit empty headings, but never omit relevant contract dimensions.

## Specify parameter semantics, not labels

For each parameter or field, state:

- direction: input, output, or in/out when applicable;
- accepted domain, units, encoding, defaults, and limits;
- whether the callee reads, copies, retains, mutates, or consumes it;
- relation to other fields;
- behavior when absent, empty, zero, duplicated, or out of range.

For TypeScript, show optionality and unions in the signature, then explain semantic constraints that types cannot encode.

## Distinguish every completion state

For asynchronous APIs, say exactly when each boundary occurs:

- request accepted;
- work queued;
- work started;
- promise resolved;
- callback invoked;
- data persisted;
- operation completed;
- cancellation requested versus confirmed.

Document callback invocation count, ordering, reentrancy, timeout, concurrency, and what happens when the callback throws.

## Treat errors as behavior

Use typed exceptions, rejected promises, exit statuses, HTTP responses, events, or diagnostics appropriate to the modern interface. For each expected error, give:

- trigger;
- observable type/code/status;
- whether partial state exists;
- whether retry is safe;
- recovery or alternative.

Do not preserve historical global result-code patterns. Do not list errors without recovery semantics. If any error can propagate from an underlying layer, link its canonical error family rather than copying an unstable list.

## Adapt the template to other surfaces

### CLI command
Include synopsis, arguments, options, environment/config precedence, stdin/stdout/stderr, exit statuses, side effects, idempotency, examples, and see also.

### Type or interface
Include purpose, declaration, field table, invariants, ownership/mutability, serialization shape, construction, lifecycle, compatibility, and examples.

### Event or webhook
Include producer, trigger, delivery guarantees, ordering, retries, deduplication key, payload schema, security verification, versioning, and example.

### Configuration key
Include type, default, scope, precedence, reload behavior, security implications, supported versions, and example.

## Preserve lookup speed

- Group entries by user task on landing pages; keep symbol pages searchable by exact name.
- Link reference entries to the best task example and concept definition.
- Add concise **See also** links for lifecycle neighbors, alternatives, and recovery.
- Provide tables for mode-dependent or edge-case behavior.
- Generate compact symbol inventories; do not duplicate signatures across languages by hand.

## Exclude private machinery

Do not document memory layout, internal fields, transport selectors, generated implementation files, or debug-only behavior as public API unless readers must interoperate with it. If included for diagnostics, label it unstable and state the supported abstraction.
