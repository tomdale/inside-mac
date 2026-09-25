---
name: imac-doc-architecture
description: Designs or restructures documentation sets, books, guides, chapters, and subsystem pages in the Inside Macintosh style. Use when planning information architecture, separating concepts/tasks/reference, creating reader roadmaps, defining chapter templates, or repairing navigation and cross-references.
---

# Architect the documentation

Make the material usable in two modes: sequential learning and direct lookup. Organize around reader intent, not the source tree.

## Establish the documentation contract

Before drafting, record:

- **Audience:** roles and assumed competence.
- **Scope:** what this document covers and deliberately omits.
- **Prerequisites:** concepts, tools, permissions, and prior pages.
- **Environment:** package/API version, runtime, platform, and support status.
- **Outcomes:** tasks readers will be able to complete.
- **Next paths:** where each reader type should go afterward.

Do not begin with installation details or an API inventory before explaining what the system is for.

## Use four layers

Apply this default progression to each feature area:

1. **About X** — purpose, mental model, vocabulary, boundaries, and invariants.
2. **Using X** — ordinary workflows, minimum useful API, tested examples, and recovery.
3. **X Reference** — authoritative contracts for every public surface.
4. **Summary of X** — compact inventory and links, preferably generated.

Add an implementation or advanced layer between Using and Reference only when readers build adapters, plugins, providers, or internals. Label it by audience.

Keep layers distinct:

- About explains *what and why*, not every option.
- Using teaches *how to accomplish a goal*, not every symbol.
- Reference states *the complete contract*, not a tutorial narrative.
- Summary supports scanning; it must not duplicate hand-maintained truth.

## Build a book or documentation set

```markdown
# <Product or subsystem>

## Start here
- Who this is for
- What it enables
- Supported versions and environments
- Prerequisites

## What to read
| If you want to… | Read… | You can skip… |
|---|---|---|
| Understand the model | About <X> | Advanced internals |
| Complete the common path | Using <X> | Full reference |
| Integrate deeply | Extension guide | Beginner walkthrough |
| Look up a symbol | API Reference | Narrative sections |

## System overview
- Architecture diagram
- Components and boundaries
- One minimal end-to-end example

## Feature areas
- About <X>
- Using <X>
- <X> Reference
- Summary of <X>

## Shared lookup
- Compatibility and deprecations
- Error and recovery index
- Glossary
- API index
```

Order feature areas by dependency or user workflow. Start high-level and descend only as needed. If chapters are independent, say so; if one is foundational, say “Read this first” and explain why.

## Open every chapter with a roadmap

```markdown
# <Feature>

<One paragraph: what the feature does and where it sits in the system.>

## Read this chapter if
- …

## Before you begin
- Knowledge: …
- Setup: …
- Versions: …

## In this chapter
You will:
- understand …
- implement …
- diagnose …

## You can skip
- Skip <section> unless …

## Related paths
- For …, see [<page>] because …
```

Route by jobs, not only by product taxonomy. State why a cross-reference matters.

## Design navigation for the web

- Use stable descriptive anchors, searchable headings, breadcrumbs, and “On this page.”
- Link concepts to their first definition, tasks to exact reference entries, and reference entries back to working examples.
- Add **See also** links for prerequisites, alternatives, lifecycle neighbors, and recovery—not generic “related content.”
- Use a glossary for controlled vocabulary. Add “See,” “See also,” and “Compare” links; distinguish overloaded senses.
- Give figures, tables, and examples descriptive captions that state the lesson.
- Keep version and platform metadata structured and centralized, then surface local badges where behavior differs.
- Generate API inventories from canonical declarations where possible.

Do not reproduce page numbers, print indexes, duplicated language summaries, or cross-book scavenger hunts.

## End with an operational summary

```markdown
## Summary

### Mental model
- …

### Common path
1. …
2. …
3. …

### Public surface
- [Types](…)
- [Functions](…)
- [Events/hooks](…)
- [Errors](…)

### Invariants
- Must: …
- Never: …

### Continue
- If …, read …
```

Prefer a generated symbol list over copied declarations. Summarize decisions and invariants, not the preceding prose.

## Check the architecture

Confirm that:

- a newcomer can find a viable start;
- an experienced reader can jump directly to a contract;
- the common path appears before advanced variants;
- every layer has one job;
- no essential context is exiled to another document;
- cross-links form concept → task → reference → recovery loops;
- compatibility and support status are visible before implementation begins.
