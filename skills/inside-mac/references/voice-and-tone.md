# Write with precise, practical authority

Address the reader as "you" in instructions. Make the product, runtime, function, or command the subject when you describe behavior. Write formally enough to be dependable and directly enough to act on.

## Use the core sentence pattern

Build explanations in this order:

1. Define the thing.
2. State what it does or enables.
3. Explain the consequence for the reader.
4. Qualify exceptions where they apply.

```markdown
A session represents one authenticated connection to the service. Create one
before sending requests. Reuse it across requests to preserve connection
pooling, and create a new session when credentials or regions differ.
```

Use one term for one thing. Do not alternate synonyms for variety, and define neighboring terms that readers commonly confuse.

## Choose modal verbs deliberately

- **must**: required for correctness, security, or protocol conformance;
- **must not**: prohibited; state what fails;
- **should**: the recommended default, with legitimate exceptions;
- **should not**: risky or usually wrong, but valid;
- **can**: a capability;
- **may**: permitted, or behavior the system does not guarantee.

Do not use "should" for a hard requirement, or "may" where "can" means capability. When a page repeats "you should," replace the advice with a direct instruction or a table of choices.

## State the rule, its reason, and the consequence

Weak:
> Be careful when reusing this client.

Strong:
> Do not share this client across tenants. It caches the bearer token supplied at construction, so reuse can send one tenant's credentials with another tenant's request.

Weak:
> It is important to await this call.

Strong:
> Await `flush()` before the process exits. The promise resolves after queued events reach the server, and exiting earlier can discard them.

## Put caveats where decisions happen

Attach each prerequisite, exception, version difference, ownership rule, and failure behavior to the sentence or step it qualifies. Do not collect them in a late "Gotchas" section.

Use callouts sparingly and by meaning:

```markdown
> [!NOTE]
> Optional context that improves understanding.

> [!IMPORTANT]
> A condition required for the procedure to work correctly.

> [!WARNING]
> An action can expose data, corrupt state, or cause an outage. State the
> consequence and the safer alternative.
```

Keep a fact in prose when it fits there, and use a warning only to mark danger.

## Describe observable behavior

Before:
> The framework facilitates robust handling of asynchronous operations.

After:
> The framework retries idempotent requests twice. It rejects the promise after the final failure and preserves the server's status code in `RequestError.status`.

Before:
> Simply run the command to easily deploy your app.

After:
> Run `acme deploy`. The command builds the current project, uploads the output, and prints the deployment URL.

Be candid about boundaries. Say what the interface does not do, what an example omits, which versions and environments a claim covers, and whether a behavior is guaranteed, typical, or specific to one implementation. Avoid "obviously," "simply," "easy," "magic," and language that blames readers for unsafe defaults.

## Keep prose readable at any length

A length target is met by choosing less material ([architecture.md](architecture.md) describes how). Packing the same material into fewer words costs the reader more time than it saves on the page.

- Write each sentence so that it reads correctly the first time. Split a sentence that chains several conditions, or one that a reader would need to read twice.
- Keep the connectives that carry the logic: "because," "so," "unless," "after," "which means."
- Use a numbered list for ordered stages, a table for comparisons, and a real heading for each section. Do not fold headings into bold run-in labels to save space.
- Keep the reason behind each rule. A rule stated without its reason cannot be applied to a case the writer did not foresee.
- Start task steps with an imperative verb: Install, Create, Call, Verify. Put a controlling condition first: "If the response is `429`, wait…"
- Name the actor. Use active voice when "it," "this," or a passive verb would leave ownership unclear.
- Give each paragraph one main claim, and keep paragraphs short.

## Remove patterns that read as generated

Readers discount text that sounds machine-written, and these patterns also blur what is being claimed. Any one of them can be legitimate in its place. Their density is the signal: several in a paragraph, or the same one on every page. Fix an instance by rewriting the sentence to state its claim plainly. Swapping in a synonym leaves the pattern in place.

- Negative contrast ("X, not Y"; "not just X, but Y") where readers hold no such misconception.
- A colon that sets up a reveal: "The answer is simple: caching."
- Lists of three where the content has one or two items.
- Symmetric sentence pairs built for rhythm rather than meaning.
- Aphoristic closing lines that restate a paragraph as a maxim.
- Trailing participles that editorialize: ", making it ideal for…", ", ensuring that…".
- A bold lead-in on every bullet.
- Absolutes used for emphasis ("always," "never," "every," "completely") where the claim is not absolute.
- Importance markers: "key," "crucial," "critical," "notably," "importantly," "note that."
- Drama words: "quietly," "genuinely," "truly," "load-bearing," "under the hood."
- Stock vocabulary: "delve," "leverage," "robust," "seamless," "streamline," and "surface" as a verb.
- Stacked "therefore," "thus," and "hence."
- Narrative transitions: "This is where X comes in," "Enter X," "Let's take a look at…".

## Edit in three passes

1. Contract pass: mark every requirement, recommendation, option, precondition, and consequence, and check each modal verb.
2. Clarity pass: make actors, terms, state transitions, and failure modes explicit, and split sentences that need a second reading.
3. Cutting pass: remove throat-clearing, repetition, promotion, and the patterns above. Keep every reason and every connective that carries logic.
