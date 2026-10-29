---
name: inside-mac
description: Plans, writes, reviews, and renders developer documentation in a modernized Inside Macintosh style, with concepts, tasks, and reference kept separate, reader roadmaps, behavioral contracts, and an optional print-quality PDF book. Use when asked to write, restructure, explain, document, or review an API, SDK, CLI, framework, protocol, or system as a guide, chapter, tutorial, reference, or book; when asked for Inside Macintosh or inside-mac style; or when rendering Markdown documentation as a PDF book.
---

# Write documentation in the Inside Macintosh style

Apple's *Inside Macintosh* (1985–1994) taught each part of the Macintosh system software in the same order: it oriented the reader, explained the model, taught the common tasks, and then specified the contract for lookup. Apply that order to modern systems, written for linked, searchable web documentation with tested TypeScript or JavaScript examples. Render a PDF book when the user wants a printable deliverable.

## Load the reference for the task

| Task | Load |
|---|---|
| Plan a book, documentation set, or chapter: structure, roadmaps, cross-links, length budgets | [architecture.md](references/architecture.md) |
| Decide audience, depth, and what to include; work from code, READMEs, and design documents | [content.md](references/content.md) |
| Write or repair prose: voice, modal verbs, callouts, readability, text that reads as generated | [voice-and-tone.md](references/voice-and-tone.md) |
| Explain a concept: mental model, vocabulary, lifecycle, figures | [concepts.md](references/concepts.md) |
| Write a task guide, tutorial, or quickstart with examples | [task-guides.md](references/task-guides.md) |
| Write reference entries for functions, types, commands, events, configuration, and errors | [api-reference.md](references/api-reference.md) |
| Review a draft or a documentation PR | [review.md](references/review.md) |
| Render Markdown as a PDF book with the pipeline in [assets/](assets/) | [pdf-book.md](references/pdf-book.md) |
| Find the original passages behind a technique | [sources.md](references/sources.md) |

Load every file the deliverable needs. Any drafting task needs content.md and voice-and-tone.md. A full book starts with architecture.md and content.md, uses concepts.md, task-guides.md, and api-reference.md while drafting, finishes with review.md, and uses pdf-book.md to render.

## Core rules

- Write for the builder who uses or extends the system. Internal implementation appears only where it explains a contract, a correctness boundary, or a failure the builder must handle.
- Teach concepts before the tasks that depend on them, and tasks before the reference. Separate the three per subsystem: inside a chapter when each chapter documents one subsystem, across the book when one system spans many chapters.
- Open the book and every chapter with a roadmap that tells each reader what to read and what to skip.
- Make behavior complete: guarantees and non-guarantees, completion states, ownership, errors and recovery, retry safety. Link to the declarations, inventories, and enumerations that source code or generated documentation define; hand-copied lists go stale.
- Write what stays true as long as the design does. Implementation detail appears through links or a reference table when a reader must act on it, and transient detail stays out.
- State verified facts in the document's own voice. Project READMEs, design documents, and code comments are sources of facts; the prose neither quotes them nor narrates the research.
- Meet a length target by removing topics, repetition, and enumerations. Keep sentences whole, connectives explicit, and the reason behind each rule.
- Put each warning at the point of danger, with the consequence and the safer alternative.
- End a chapter after its last substantive section. An optional interface summary (names with links, or a generated inventory) may close a chapter or book; a prose recap never does.
- State each fact once, where a reader would look for it, and link to it from elsewhere.

## Drop aged practices

Do not reproduce these features of the originals:

- print page references, static indexes, and material duplicated across volumes;
- Pascal-first, assembly-language, register, or trap documentation;
- hardware addresses, private memory layouts, and internals outside the public contract;
- global result codes where typed errors, rejected promises, or exit statuses apply;
- interfaces maintained by hand in several languages;
- primary examples with omitted error handling, hedges about whether samples were tested, and disclaimers that samples are not for use;
- compatibility caveats scattered through the prose instead of structured version metadata;
- paternalistic, gendered, moralizing, or vendor-universal language;
- long linear prose where numbered steps, tables, links, or progressive disclosure serve the reader better.
