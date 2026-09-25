---
name: imac-concept-explainer
description: Creates conceptual “About X” documentation for APIs, SDKs, frameworks, CLIs, protocols, and system features. Use when readers need a mental model, vocabulary, architecture, lifecycle, boundaries, diagrams, or progressive disclosure before they can use an interface correctly.
---

# Explain the system before the calls

Write an “About X” section that lets readers predict behavior. Do not turn it into a feature list or a disguised reference page.

## Start with the reader’s problem

In the first screenful, answer:

- What problem does X solve?
- When should a reader use it?
- Where does it sit in the larger system?
- What does it deliberately not do?
- What is the smallest useful mental model?

```markdown
# About event streams

An event stream delivers an ordered sequence of changes from a producer to one
or more consumers. Use a stream when consumers must react after a change occurs
without polling the producer. A stream delivers events; it does not store your
application’s current state or guarantee that a consumer has applied an event.
```

State subsystem boundaries candidly. “Stores bytes but does not interpret their schema” is more useful than a broad claim that it “manages data.”

## Build the explanation in dependency order

Use this sequence unless the subject demands another:

1. **Purpose and fit** — problem, non-goals, alternatives.
2. **Vocabulary** — few exact terms, including easily confused neighbors.
3. **Parts and relationships** — architecture or object model.
4. **Lifecycle or data flow** — state transitions and actors.
5. **Invariants** — facts that remain true across operations.
6. **Common path** — the minimum subset ordinary readers need.
7. **Variants and tradeoffs** — modes, implementations, or levels.
8. **Limits and compatibility** — scale, environment, versions, unsupported cases.
9. **Next steps** — task guide and exact reference links.

Introduce one abstraction at a time. Move representation details, wire formats, and internals after semantic meaning.

## Define terms operationally

Use category + distinction + consequence.

```markdown
A **job** is a persisted request to perform work. Unlike a task, a job survives
worker restarts. The service may execute a job more than once, so handlers must
be idempotent.
```

For overloaded terms, number the senses or select one canonical term and link synonyms. Add **Compare** links where the boundary teaches more than either definition alone.

## Make invisible systems visible

Choose figures for relationships, state, time, or transformation—not decoration.

Useful forms:

- component diagram for ownership and boundaries;
- sequence diagram for async calls and callbacks;
- state diagram for lifecycle and legal transitions;
- data-flow diagram for transformations;
- before/after figure for mutation;
- comparison table for modes or alternatives.

Every figure needs:

```markdown
**Figure: A request remains pending until the worker acknowledges it.**

<figure>

The API call returns after the service accepts the request, not after the worker
finishes. Use `await job.result()` when the caller needs completed output.
```

Give alt text that conveys the same relationship. Do not encode “correct” and “wrong” through color alone.

## Use analogy with an exit clause

Map an unfamiliar mechanism to a familiar one, then state where the analogy breaks.

```markdown
A collection behaves like an ordered map: each item has a key and preserves
insertion order. Unlike a general map, it allows more than one item with the
same key.
```

Do not let a metaphor replace the actual model.

## Show one worked scenario

Use a realistic but compact scenario to connect actors and states. Follow it from start to stable outcome, including one failure or retry. Keep narrative short; do not delay the first actionable path with fictional business detail.

```markdown
1. The browser submits an upload and receives job `j_123`.
2. The service stores the job as `pending`.
3. A worker claims it; the job becomes `running`.
4. The worker stores the result and acknowledges the job.
5. If the worker exits before acknowledgment, the service returns the job to
   `pending` and another worker may repeat the operation.
```

## Disclose detail progressively

Mark sections explicitly:

- **Most applications:** minimum concepts and default path.
- **If you customize X:** extension points and tradeoffs.
- **If you implement X:** protocol or provider obligations.
- **Internals:** diagnostic detail with no public guarantee.

Say who can skip each advanced section. Do not expose private layouts as supported extension points.

## Connect concepts to action

End with:

```markdown
## What to do next

- To complete the default workflow, see [Using X](…).
- To choose between X and Y, see [X compared with Y](…).
- To inspect exact options and errors, see [X API reference](…).
```

Cross-links must state their purpose. A concept page succeeds when readers can explain the model, choose the correct path, and anticipate important behavior before copying code.
