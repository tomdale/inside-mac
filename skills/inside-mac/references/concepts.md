# Explain the system before the calls

An About section explains a model that lets readers predict how a system behaves before they copy any code. Option lists and entry-by-entry detail belong in the reference.

## Start with the reader's problem

Answer these questions in the first screenful:

- What problem does X solve, and when should a reader use it?
- Where does X sit in the larger system?
- What does X deliberately not do?
- What is the smallest mental model that predicts its behavior?

```markdown
# About event streams

An event stream delivers an ordered sequence of changes from a producer to one
or more consumers. Use a stream when consumers must react to a change without
polling the producer. A stream delivers events. It does not store your
application's current state, and it does not confirm that a consumer has
applied an event.
```

State boundaries concretely. "Stores bytes without interpreting their schema" tells the reader more than "manages data."

## Build the explanation in dependency order

Use this sequence unless the subject requires another:

1. Purpose and fit: the problem, non-goals, and alternatives.
2. Vocabulary: a few exact terms, including neighbors that readers confuse.
3. Parts and relationships: the architecture or object model.
4. Lifecycle or data flow: states, transitions, and the actors that cause them.
5. Invariants: facts that hold across every operation.
6. The common path: the minimum subset that most readers need.
7. Variants and trade-offs: modes, implementations, or levels of control.
8. Limits and compatibility: scale, environments, versions, and unsupported cases.

Introduce one abstraction at a time. Explain what a thing means before its representation, wire format, or internals.

## Define terms operationally

Give each term a category, a distinction, and a consequence:

```markdown
A **job** is a persisted request to perform work. Unlike a task, a job survives
worker restarts. The service can run a job more than once, so handlers must be
idempotent.
```

For an overloaded term, number its senses, or choose one canonical term and link its synonyms to it. In the glossary, add **See also** links to related terms and **Compare** links to neighbors whose boundary teaches more than either definition alone.

## Use an analogy with its limit

Map an unfamiliar mechanism to a familiar one, then say where the comparison stops:

```markdown
A collection behaves like an ordered map: each item has a key, and the
collection preserves insertion order. Unlike a map, it allows several items with
the same key.
```

After the analogy, state the actual model.

## Follow one worked scenario

Connect the actors and states with one realistic, compact scenario. Follow it from the first action to a stable outcome, and include one failure or retry. Keep the story short, so that it does not delay the first actionable path.

```markdown
1. The browser submits an upload and receives job `j_123`.
2. The service stores the job as `pending`.
3. A worker claims the job, and the job becomes `running`.
4. The worker stores the result and acknowledges the job.
5. If the worker exits before acknowledging, the service returns the job to
   `pending`, and another worker can repeat the operation.
```

## Make invisible behavior visible with figures

Use a figure to show a relationship, a state, a sequence in time, or a transformation. Choose the form by what it shows:

- a component diagram for ownership and boundaries;
- a sequence diagram for asynchronous calls and callbacks;
- a state diagram for a lifecycle and its legal transitions;
- a data-flow diagram for transformations;
- a before-and-after figure for mutation;
- a table for comparing modes or alternatives.

Give every figure a caption that states its lesson. "Figure 2-1: A job stays pending until a worker acknowledges it" teaches; "Figure 2-1: Job lifecycle" only names the topic. Follow the figure with the consequence for the reader, and give it alt text that conveys the same relationship. Do not encode a distinction, such as correct versus incorrect, through color alone.

### Keep figures legible on the page

A figure scaled down to the page width shrinks its labels with it. Legibility outranks page count: a figure that needs a full page gets one.

- Rendered labels must be at least about 5.5 pt. The PDF build reports figures whose labels fall below this size ([pdf-book.md](pdf-book.md)).
- Limit a sequence diagram to about five participants. Split it by phase, or merge participants that always act together.
- Lay out a chain of more than four or five steps from top to bottom rather than left to right.
- Split a figure that is still too dense into an overview figure and one or more detail figures.
