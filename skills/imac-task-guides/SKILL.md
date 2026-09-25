---
name: imac-task-guides
description: Creates “Using X” how-to guides, tutorials, quickstarts, and workflow documentation with progressive code. Use when documenting installation, configuration, SDK or API workflows, CLI procedures, lifecycle operations, async jobs, callbacks, cleanup, verification, or error recovery.
---

# Teach the common workflow

Write task documentation around a reader goal. Identify the minimum useful API subset before exposing optional controls.

## Open with a task contract

```markdown
# Upload a file

Use this procedure to upload one file from a Node.js process and wait until the
service stores it.

## Before you begin
- Node.js 20 or later
- `@acme/storage` 3.x
- `ACME_TOKEN` set in the environment
- Permission: `files:write`

## You will
1. Create a client.
2. Start an upload.
3. Wait for completion.
4. Verify the stored file.

For multipart uploads or browser uploads, see …
```

State supported versions and final outcome. Name paths readers should use instead when the guide does not apply.

## Present the smallest complete path

Teach lifecycle order, not isolated methods:

1. check availability or prerequisites;
2. initialize or authenticate;
3. create required state;
4. perform the operation;
5. inspect the result;
6. recover from expected failures;
7. release resources or shut down;
8. verify the external effect.

Do not omit cleanup, cancellation, timeouts, or persistence merely to shorten the example.

## Grow one coherent example

Use a stable sample model and extend it in small, runnable increments.

```ts
import { StorageClient } from "@acme/storage";

const client = new StorageClient({ token: process.env.ACME_TOKEN! });
```

Immediately explain the non-obvious effect:

> The client reads the token at construction. Create a new client after rotating credentials.

Then add one concern at a time:

```ts
const upload = await client.files.upload({
  name: "report.csv",
  body: Bun.file("./report.csv"),
});

const file = await upload.completed();
console.log(file.id, file.size);
```

State the async boundary: `upload()` means accepted; `completed()` means stored. Do not conflate queued success with completed success.

## Make examples trustworthy

Each primary example must be:

- copyable with imports, variable definitions, and required setup;
- executable under a named runtime and package version;
- tested in CI or clearly labeled pseudocode;
- complete enough to show errors and cleanup;
- free of placeholder helpers unless their definitions are linked;
- accompanied by expected output or an observable verification step.

Use TypeScript as the default modern example language when appropriate. Prefer platform APIs and stable abstractions over internal fields, generated files, or hard-coded addresses/IDs.

## Explain listings after showing them

Explain only decisions and invisible effects:

- why order matters;
- what state changes;
- what the caller owns;
- when completion occurs;
- which values are safe to reuse;
- what can fail and how to recover.

Do not narrate syntax line by line.

## Include production failure paths

```ts
try {
  const result = await client.jobs.run(input, { signal: AbortSignal.timeout(30_000) });
  console.log(result.id);
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error(`Retry after ${error.retryAfterMs} ms`);
  } else if (error instanceof ValidationError) {
    console.error(error.issues);
  } else {
    throw error;
  }
} finally {
  await client.close();
}
```

Document whether retries are safe, what remains allocated, and how cancellation changes state. Show at least the likely recoverable failure, not only a generic catch.

## Handle variants without derailing the path

Complete the default workflow first. Then add:

```markdown
## Variations

### Stream large files
Use this path when …

### Start work without waiting
Use this path when …; persist the job ID because …

## Troubleshooting
| Symptom | Cause | Recovery |
|---|---|---|
```

Do not interleave every option into the first example. Link uncommon details to reference pages.

## Close the loop

End with:

- **Verify:** exact command, response field, UI state, or persisted artifact.
- **What happened:** concise state/lifecycle recap.
- **Next:** natural follow-on tasks.
- **Reference:** exact APIs used.

A task guide is complete when a reader can perform the job, recognize success, recover from expected failure, and understand the critical state transitions without reading the entire API reference.
