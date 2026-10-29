# Review the documentation as a system

Audit both learning and lookup. Measure the draft against the rules in [SKILL.md](../SKILL.md) and the other reference files; this checklist names what to look for, and the cited file holds the rule. Report each finding with its severity, the exact heading or passage, the impact on the reader, and a concrete repair.

## Classify findings

- **Blocking:** can cause insecure behavior, data loss, broken production code, or an unusable primary workflow.
- **Major:** obscures the mental model, the contract, prerequisites, completion semantics, or the common path; or makes prose hard to follow.
- **Minor:** harms consistency, scanning, navigation, or polish without changing likely outcomes.

Mention a strength only when it establishes a pattern worth reusing or offsets a finding.

## 1. Reader contract ([architecture.md](architecture.md), [content.md](content.md))

- [ ] Audience, assumed knowledge, scope, and exclusions are stated.
- [ ] The audience is the builder, or a different audience is named in the roadmap.
- [ ] Runtime, package or API version, platform, and support status are visible.
- [ ] Prerequisites include permissions, setup, and prior concepts.
- [ ] Roadmaps say who should read each chapter, what readers will be able to do, and what they can skip.

## 2. Structure ([architecture.md](architecture.md))

- [ ] Concepts precede the procedures that depend on them, and the common path precedes variants and internals.
- [ ] Concept, task, and reference material are separated at the unit this book uses: inside each chapter when each chapter covers one subsystem, across chapters when one system spans the book.
- [ ] No section restates the model or a contract that another section owns.
- [ ] Chapters end after their last substantive section, or with an interface summary of linked names. A prose recap is a finding.
- [ ] Next-reading guidance lives in roadmaps or one-line pointers.
- [ ] A length budget was met by cutting topics and enumerations, not by compressing prose.

## 3. Content and sources ([content.md](content.md))

- [ ] Implementation detail appears only where it explains a contract, a correctness boundary, or a failure the builder handles.
- [ ] Narrative carries durable content. Paths, names, and constants appear as links or reference rows only where a reader acts on them.
- [ ] Transient detail is absent, apart from short "Current state" notes that name the version or date they describe and change what a reader does now.
- [ ] No hand-copied declarations, field lists, status codes, or error enumerations that the source or generated docs define. The entries that matter are explained, and the rest are linked.
- [ ] Source links point to the default branch, or to a commit permalink only where the text depends on specific lines.
- [ ] Claims are stated as facts. No prose quotes or attributes READMEs, design documents, or code comments, and none narrates the research.
- [ ] Claims a reader would act on that could not be verified are marked.

## 4. Concepts ([concepts.md](concepts.md))

- [ ] The opening states the problem, purpose, position in the system, and boundaries.
- [ ] Terms are defined before use, used consistently, and distinguished from their neighbors.
- [ ] Components, ownership, lifecycle, state, and data flow are explained, and invariants and non-goals are explicit.
- [ ] Analogies state where they stop applying.
- [ ] Each figure shows a relationship, has a caption that states its lesson, and has alt text.
- [ ] Figures are legible in the rendered output: labels at about 5.5 pt or larger, sequence diagrams with about five participants or fewer, long chains laid out top to bottom.
- [ ] Advanced detail is labeled by audience and can be skipped.

## 5. Tasks ([task-guides.md](task-guides.md))

- [ ] Each heading names a reader goal, with preconditions and an observable outcome.
- [ ] Steps follow the lifecycle, and the first path uses the minimum useful interface.
- [ ] Code includes setup, imports, realistic values, error handling, cleanup, and verification.
- [ ] Examples are tested under named versions or labeled as pseudocode.
- [ ] Prose after a listing explains decisions and invisible effects, not syntax.
- [ ] Expected failures include recovery and retry safety, and variants follow the default path.

## 6. Reference ([api-reference.md](api-reference.md))

- [ ] Signatures match the canonical source.
- [ ] Each parameter states its domain, default, limits, units, optionality, and mutation or retention.
- [ ] Return values, state changes, preconditions, side effects, ownership, concurrency, and cancellation are covered where relevant.
- [ ] Asynchronous entries distinguish accepted, queued, started, completed, and persisted.
- [ ] Errors give triggers, partial effects, retry safety, and recovery.
- [ ] Availability, deprecation, migration, and feature detection are explicit.
- [ ] See also links connect lifecycle neighbors, alternatives, examples, and recovery.

## 7. Voice and readability ([voice-and-tone.md](voice-and-tone.md))

- [ ] "Must," "should," "can," and "may" carry distinct meanings.
- [ ] Requirements state their reason or consequence, and caveats appear at the decision point.
- [ ] Callouts match their meaning; each warning names the consequence and a safer action.
- [ ] Sentences read correctly the first time: no chained conditions, dropped connectives, or headings folded into bold run-in labels.
- [ ] Generated-sounding patterns from voice-and-tone.md do not accumulate. Report clusters and repeated habits; a single legitimate use is not a finding.
- [ ] No promotion, blame, moralizing, or "simple" and "easy."

## 8. Navigation and accessibility ([architecture.md](architecture.md))

- [ ] Headings and anchors are stable, descriptive, and searchable, and long pages have an on-page outline.
- [ ] Cross-links say why the destination matters and connect concept, task, reference, and recovery.
- [ ] Compatibility metadata is structured and noted locally where behavior differs.
- [ ] Tables have headers, diagrams do not rely on color alone, and code and callouts use semantic markup.
- [ ] Glossary entries define terms operationally, with See also and Compare links.
- [ ] None of the aged practices listed in [SKILL.md](../SKILL.md) appears.

## Write the review

```markdown
## Blocking
- [Heading or line] Problem. Reader impact. Proposed repair.

## Major
- …

## Minor
- …

## Structure recommendation
<Proposed chapter or section order, if restructuring is needed.>

## Verification
- Run the examples under …
- Validate links, schemas, and signatures with …
- Confirm behavior against …
```

When a category has no findings, say so. Separate factual contract errors from editorial preferences.
