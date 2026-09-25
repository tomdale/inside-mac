---
name: imac-voice-and-tone
description: Writes or rewrites developer documentation in a modernized Inside Macintosh voice. Use when prose is vague, chatty, promotional, overly dense, weak about requirements, inconsistent in terminology, or missing rationale and concrete consequences.
---

# Write with precise, practical authority

Address the reader as **you** for actions. Use the product, runtime, function, or command as the subject when describing behavior. Be formal enough to be dependable and direct enough to act on.

## Use the core sentence pattern

Prefer:

1. **Define** the thing.
2. **State** what it enables or does.
3. **Explain** the consequence for the reader.
4. **Qualify** exceptions at the point they matter.

```markdown
A session represents one authenticated connection to the service. Create one
before sending requests. Reuse it across requests to preserve connection
pooling; create a new session when credentials or regions differ.
```

Do not alternate synonyms for variety. Define adjacent terms precisely, especially terms readers commonly conflate.

## Choose modal verbs deliberately

- **must** — required for correctness, security, or protocol conformance;
- **must not** — prohibited; state the failure consequence;
- **should** — recommended default with legitimate exceptions;
- **should not** — risky or usually wrong, but not invalid;
- **can** — capability;
- **may** — permitted or genuinely uncertain behavior.

Do not use “should” for hard requirements. Do not use “may” when “can” means capability.

## State rule, rationale, and consequence

Weak:
> Be careful when reusing this client.

Strong:
> Do not share this client across tenants. It caches the bearer token supplied at construction, so reuse can send one tenant’s credentials with another tenant’s request.

Weak:
> It is important to await this call.

Strong:
> Await `flush()` before the process exits. The promise resolves after queued events reach the server; exiting earlier can discard them.

## Put caveats where decisions happen

Attach prerequisites, exceptions, version differences, ownership, and failure behavior to the sentence or step they qualify. Do not hide them in a late “Gotchas” section.

Use semantic callouts sparingly:

```markdown
> [!NOTE]
> Optional context that improves understanding.

> [!IMPORTANT]
> A condition required for the procedure to work correctly.

> [!WARNING]
> An action can expose data, corrupt state, cause an outage, or create another
> serious consequence. State the consequence and the safer alternative.
```

If a fact fits naturally in prose, keep it in prose. Never use a warning merely for emphasis.

## Prefer operational language

Replace abstractions with observable behavior.

Before:
> The framework facilitates robust handling of asynchronous operations.

After:
> The framework retries idempotent requests twice. It rejects the promise after the final failure and preserves the server’s status code in `RequestError.status`.

Before:
> Users may wish to leverage the configuration mechanism.

After:
> Set `timeoutMs` in `client.config.ts` to change the request timeout for every client.

Before:
> Simply run the command to easily deploy your app.

After:
> Run `acme deploy`. The command builds the current project, uploads the output, and prints the deployment URL.

## Keep instructions compact but causal

- Start task steps with an imperative: **Install**, **Create**, **Call**, **Verify**.
- Explain *why* only when it changes a decision, protects an invariant, or clarifies an invisible effect.
- Prefer short paragraphs with one claim each.
- Use bullets for alternatives and inventories; use numbered lists for ordered work.
- Put conditions first when they control the action: “If the response is `429`, wait…”
- Name the actor. Avoid “it,” “this,” and passive voice when ownership is ambiguous.

Do not become telegraphic. Readers need the system model and rationale, not a pile of commands.

## Be candid about boundaries

Say:

- what the API does not do;
- what the example omits;
- which versions and environments the claim covers;
- whether behavior is guaranteed, typical, or implementation-specific;
- whether an operation is accepted, queued, completed, persisted, or merely scheduled.

Avoid “obviously,” “simply,” “easy,” “magic,” and moralizing language. Do not blame readers for unsafe defaults.

## Modernize the historical voice

Retain precision and confidence. Drop:

- paternalistic or authoritarian phrasing without rationale;
- gendered defaults and a singular imagined user;
- vendor convention presented as universal law;
- repeated “you should” when a table or direct instruction is clearer;
- print-era “see page” language;
- claims that untested samples are ready to use;
- hardware and implementation detail unless it changes the public contract.

## Edit in three passes

1. **Contract pass:** mark every requirement, recommendation, option, precondition, and consequence.
2. **Clarity pass:** make actors, terms, state transitions, and failure modes explicit.
3. **Compression pass:** remove throat-clearing, duplication, promotion, and historical residue without deleting rationale.
