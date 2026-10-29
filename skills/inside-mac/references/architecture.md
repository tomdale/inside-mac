# Plan the documentation

Organize the material so that it works in two modes: read in order to learn, and searched to look something up. Organize around what readers want to do, not around the source tree.

## Record the documentation contract

Before drafting, write down:

- the audience and the competence you assume ([content.md](content.md) sets the default);
- the scope, and what the document deliberately leaves out;
- prerequisites: concepts, tools, permissions, and earlier chapters;
- the environment: package or API version, runtime, platform, and support status;
- outcomes: the tasks a reader can complete afterward;
- reading paths: where each kind of reader starts and goes next.

Explain what the system is for before installation steps or an API inventory.

## Separate concepts, tasks, and reference

The material comes in three kinds, and each has one job:

1. **About X** explains what X is and why it behaves as it does: purpose, mental model, vocabulary, boundaries, and invariants. See [concepts.md](concepts.md).
2. **Using X** teaches how to reach a goal: the common workflows, tested examples, and recovery from expected failures. See [task-guides.md](task-guides.md).
3. **X reference** states the contract of each public surface for lookup. See [api-reference.md](api-reference.md).

When an About section lists every option, or a Using section walks through every symbol, that material is reference and moves there. Narrative inside a reference entry moves to a concept or task section.

### Choose the unit of separation

The separation applies to a subsystem: a part of the system that a reader learns as one thing. Each chapter of the originals documented one manager, so each chapter carried its own About, Using, and Reference sections. Choose the unit by the shape of the book:

- When a book documents several subsystems that readers learn independently, give each subsystem a chapter, and separate the three kinds inside that chapter.
- When a book documents one system across many chapters, separate the kinds across the book. Concept chapters come first, then task chapters, then a reference chapter or appendix. A task chapter links to the concepts and the contract it relies on, and a concept chapter has no reference section of its own.
- A large subsystem inside a single-system book can take its own chapter with About, Using, and Reference sections when readers learn it on its own.

Repeating all three kinds inside every chapter of a single-system book makes each chapter restate the model and the contract.

### Label advanced material by audience

Add a chapter or section for readers who build adapters, plugins, or providers only when such readers exist, and place it after the common path. Mark depth with headings that name the reader, and say who can skip each part:

- **Most applications:** the minimum concepts and the default path.
- **If you customize X:** extension points and their trade-offs.
- **If you implement X:** protocol or provider obligations.
- **Internals:** diagnostic detail that carries no public guarantee.

Do not present a private structure as a supported extension point.

## Close with an interface summary or with nothing

In the originals, the closing "Summary of the X Manager" section was a lookup listing of the manager's constants, data types, and routines. It did not recap the chapter.

End a chapter after its last substantive section. When readers benefit from one place that lists a whole surface, add a **Summary of X** section, at the end of a subsystem chapter or as a book appendix. It lists names grouped by kind (types, functions, events, errors, configuration keys), links each name to its reference entry, and gives each at most a one-line description. Generate it from source when the toolchain can.

Do not recap the mental model, the common path, or the invariants in prose, because the reader has just read them. Put guidance about what to read next in the roadmap, or in one sentence at the end of the last section.

## Plan the book

A single-system book follows this outline:

```markdown
# Preface
Who the book is for, what it enables, supported versions and environments,
prerequisites, conventions, and a reading table:

| If you want to… | Read… | You can skip… |
|---|---|---|
| Understand the model | Chapters 1–2 | The reference chapter |
| Complete the common path | Chapters 3–4 | Extension chapters |
| Extend the system | Chapter 5 | The introductory walkthrough |
| Look up a contract | Chapter 6 | The narrative chapters |

# Introduction to <System>
The problem, the architecture diagram, components and boundaries, and one
minimal end-to-end example.

# Concept chapters
# Task chapters
# Reference chapter

# Appendixes
Glossary, error and recovery index, compatibility and limits, known gaps.
```

A book that covers several independent subsystems replaces the concept, task, and reference chapters with one chapter per subsystem, each with About, Using, and Reference sections.

Order chapters by dependency or by the reader's workflow, and descend from overview to detail only as far as readers need. Say so when chapters are independent. When one chapter is foundational, mark it "Read this first" and give the reason.

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

## In this chapter you will
- understand …
- implement …
- diagnose …

## You can skip
- <section>, unless …
```

Route readers by what they want to do, and say why each cross-reference matters.

## Budget length by scope

When a book has a page or word budget, choose the material before drafting. List the candidate topics, rank them by reader need, and cut from the bottom of the list. Cut repetition, and cut enumerations that the source defines ([content.md](content.md)). Do not meet a budget by compressing the prose; [voice-and-tone.md](voice-and-tone.md) states how prose stays readable. Figure legibility also outranks page count ([concepts.md](concepts.md)).

Give each chapter a budget in words as well as pages, using the layout's density ([pdf-book.md](pdf-book.md) gives it for the bundled pipeline), so that a writer can measure a draft with `wc -w`. Drafts routinely run well past an estimated length, so check every draft against its budget before review. A chapter over its budget loses its lowest-ranked topic. A revision that adds material to a chapter at its budget removes material of lower value, so the book stays within the length the plan chose.

## Cross-link by purpose

- Use stable, descriptive anchors and headings that match what readers search for.
- Give long web pages an on-page outline and breadcrumbs.
- Link each term to its definition, each task to the exact reference entries it uses, and each reference entry back to a working example.
- Add **See also** links for prerequisites, alternatives, lifecycle neighbors, and recovery, and say why each destination matters. Avoid generic "related content."
- Keep version and platform metadata in one structured place, and add a local note where behavior differs.
- Keep a glossary for the controlled vocabulary ([concepts.md](concepts.md) covers definitions).

## Check the structure

Confirm that:

- a newcomer can find a viable starting point;
- an experienced reader can jump directly to a contract;
- the common path appears before advanced variants;
- each section is one kind of material, and the separation follows the unit chosen for this book;
- no context essential to a section has been moved to another document;
- links form loops from concept to task to reference to recovery;
- compatibility and support status are visible before implementation begins.
