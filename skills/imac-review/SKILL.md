---
name: imac-review
description: Audits developer documentation against the modernized Inside Macintosh style. Use when reviewing a draft, documentation PR, API reference, tutorial, conceptual guide, documentation set, migration guide, or release documentation for structure, pedagogy, precision, safety, and web usability.
---

# Review the documentation as a system

Audit both learning and lookup. Report findings by severity, cite the exact heading or passage, explain reader impact, and propose a concrete repair.

## Classify findings

- **Blocking:** can cause insecure behavior, data loss, broken production code, or an unusable primary workflow.
- **Major:** obscures the mental model, contract, prerequisites, completion semantics, or common path.
- **Minor:** harms consistency, scanning, navigation, or polish without changing likely outcomes.

Do not praise generally. Note strengths only when they establish a reusable pattern or offset a finding.

## 1. Reader contract

- [ ] Audience and assumed knowledge are explicit.
- [ ] Scope and non-goals are stated.
- [ ] Runtime, package/API version, platform, and support status are visible.
- [ ] Prerequisites include permissions, setup, and prior concepts.
- [ ] Outcomes say what readers can do afterward.
- [ ] “Read this if,” “skip this unless,” and next-path guidance route distinct audiences.

## 2. Architecture

- [ ] Content separates **About**, **Using**, **Reference**, and **Summary** concerns.
- [ ] Concepts precede procedures that depend on them.
- [ ] The common path precedes advanced variants and internals.
- [ ] Chapter and section openings provide short roadmaps.
- [ ] Summaries inventory decisions and public surfaces without duplicating canonical declarations.
- [ ] Essential context is not exiled through cross-references.

## 3. Conceptual explanation

- [ ] The opening states problem, purpose, system position, and boundaries.
- [ ] Terms are defined before use and used consistently.
- [ ] Neighboring or overloaded terms are distinguished.
- [ ] Components, ownership, lifecycle, state, and data flow are explained.
- [ ] Invariants and non-goals are explicit.
- [ ] Analogies state where they break.
- [ ] Figures explain a relationship and have useful captions and alt text.
- [ ] Advanced detail is labeled by audience and can be skipped.

## 4. Task guidance

- [ ] The heading names a user goal.
- [ ] Preconditions and final observable outcome are explicit.
- [ ] Steps follow lifecycle order.
- [ ] The first path uses the minimum useful API subset.
- [ ] Code includes setup, imports, realistic values, errors, cleanup, and verification.
- [ ] Examples are tested under named versions or clearly labeled pseudocode.
- [ ] Prose explains decisions and invisible effects rather than syntax.
- [ ] Async boundaries distinguish accepted, queued, started, completed, and persisted.
- [ ] Expected failures include recovery and retry safety.
- [ ] Variants follow—not interrupt—the default path.

## 5. API contracts

- [ ] Signatures match canonical source.
- [ ] Every parameter/field states domain, defaults, limits, units, optionality, and mutation/retention behavior.
- [ ] Return values and state changes are precise.
- [ ] Preconditions, side effects, ownership, lifetime, concurrency, and cancellation are covered where relevant.
- [ ] Errors identify triggers, partial effects, retry safety, and recovery.
- [ ] Version availability, deprecation, migration, and feature detection are explicit.
- [ ] Callbacks/events document ordering, invocation count, delivery, and thrown-error behavior.
- [ ] **See also** links connect lifecycle neighbors, alternatives, examples, and recovery.

## 6. Voice and risk communication

- [ ] The prose is direct, formal, and reader-oriented without promotion.
- [ ] **Must**, **should**, **can**, and **may** carry distinct meanings.
- [ ] Requirements include rationale or concrete consequences when non-obvious.
- [ ] Actors and state transitions are unambiguous.
- [ ] Caveats appear at the decision point.
- [ ] Notes are optional; Important callouts affect correctness; Warnings name serious consequences and safer action.
- [ ] The draft avoids “simple,” “easy,” blame, moralizing, and needless authority.

## 7. Web navigation and accessibility

- [ ] Headings and anchors are stable, descriptive, and searchable.
- [ ] Cross-links say why the destination matters.
- [ ] Concept → task → reference → troubleshooting paths form a connected graph.
- [ ] Compatibility metadata is structured and locally visible.
- [ ] Tables have headers; diagrams do not rely on color alone; code and callouts have semantic markup.
- [ ] Long pages expose an on-page outline and keep paragraphs scannable.
- [ ] Glossary entries define terms operationally and include See/Compare links.

## 8. Historical practices to reject

Flag and remove:

- page-number references or print-only navigation;
- duplicated declarations maintained across languages;
- Pascal, assembly, registers, traps, memory layouts, or hardware detail with no current contract value;
- untested “illustrative” code that looks copyable;
- intentionally incomplete error handling in the primary example;
- scattered version caveats instead of a support matrix plus local annotations;
- internal structures presented as supported extension points;
- visual-only warnings;
- large prose repetitions used instead of links or generated inventories.

## Write the review

```markdown
## Blocking
- **[Heading or line] Problem.** Reader impact. Proposed repair.

## Major
- …

## Minor
- …

## Architecture recommendation
<Proposed page/chapter order if restructuring is needed.>

## Verification
- Run examples under …
- Validate links/schema/signatures with …
- Confirm behavior against …
```

When no finding exists in a category, say so. Separate factual contract errors from editorial preferences.
