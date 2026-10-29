# Teach the common workflow

Write each task guide around one reader goal. Identify the minimum subset of the interface that reaches the goal before you introduce optional controls.

## Open with the task contract

```markdown
# Upload a file

Use this procedure to upload one file from a Node.js process and wait until the
service stores it.

## Before you begin
- Node.js 20 or later
- `@acme/storage` 3.x
- `ACME_TOKEN` set in the environment
- Permission: `files:write`

## Steps
1. Create a client.
2. Start an upload.
3. Wait for completion.
4. Verify the stored file.

For multipart or browser uploads, see …
```

Name the supported versions and the final outcome. When the guide does not fit a reader's situation, name the guide they should use instead.

## Present the smallest complete path

Teach the lifecycle in order rather than isolated methods:

1. Check availability or prerequisites.
2. Initialize or authenticate.
3. Create the required state.
4. Perform the operation.
5. Inspect the result.
6. Recover from expected failures.
7. Release resources or shut down.
8. Verify the external effect.

Keep cleanup, cancellation, timeouts, and persistence in the example even when they lengthen it.

## Grow one coherent example

Use one stable sample model and extend it in small increments that each run.

```ts
import { StorageClient } from "@acme/storage";

const client = new StorageClient({ token: process.env.ACME_TOKEN! });
```

Explain the non-obvious effect immediately after the listing:

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

Say which completion state each call reaches: here `upload()` resolves when the service accepts the upload, and `completed()` resolves when the file is stored. [api-reference.md](api-reference.md) lists the states to distinguish.

## Make examples trustworthy

Each primary example is:

- copyable, with its imports, variable definitions, and required setup;
- runnable under a named runtime and package version;
- tested in CI, or labeled as pseudocode;
- complete enough to show error handling and cleanup;
- free of placeholder helpers, unless their definitions are linked;
- followed by expected output or an observable verification step.

Use TypeScript by default when the subject allows it. Prefer platform APIs and stable abstractions to internal fields, generated files, or hard-coded addresses and IDs.

## Explain listings after showing them

Explain decisions and effects the code does not show: why the order matters, what state changes, what the caller owns, when the operation completes, which values are safe to reuse, and what can fail. Do not narrate the syntax line by line.

## Include the failure paths

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

Handle at least the likely recoverable failure, not only a generic catch. Say whether a retry is safe, what remains allocated after a failure, and how cancellation changes state.

## Add variants after the default path

Complete the default workflow first. Then add variants and troubleshooting:

```markdown
## Variations

### Stream large files
Use this path when …

### Start work without waiting
Use this path when …. Persist the job ID, because …

## Troubleshooting
| Symptom | Cause | Recovery |
|---|---|---|
```

Keep options out of the first example, and link uncommon details to the reference.

## End with verification

Make the last step of the procedure a verification: an exact command, a response field, a UI state, or a persisted artifact that shows the task succeeded. Link each API the guide uses to its reference entry where the guide first uses it. Point to the natural next task in one sentence when one exists.

A task guide is complete when a reader can perform the job, recognize success, and recover from the expected failures without reading the entire reference.
