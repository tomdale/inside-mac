---
name: imac-style
description: Routes documentation work to the modernized Inside Macintosh skill set. Use when asked to write, plan, restructure, explain, document, or review APIs, SDKs, CLIs, frameworks, protocols, developer guides, or technical documentation in the Inside Macintosh style.
---

# Apply the modern Inside Macintosh style

Preserve the pedagogical DNA: orient the reader, explain the model, teach the common workflow, specify the complete contract, and provide fast lookup. Modernize the implementation for linked, searchable, accessible web documentation and tested TypeScript/JavaScript examples.

## Route the work

| Need | Skill |
|---|---|
| Plan a documentation set, chapter, page hierarchy, roadmap, or cross-link graph | `imac-doc-architecture` |
| Set or repair prose style, requirements language, caveats, and callouts | `imac-voice-and-tone` |
| Explain concepts, architecture, vocabulary, state, lifecycles, and diagrams | `imac-concept-explainer` |
| Write quickstarts, how-tos, tutorials, workflows, and progressive examples | `imac-task-guides` |
| Specify functions, methods, types, commands, events, config, errors, and compatibility | `imac-api-reference` |
| Audit a draft or documentation PR | `imac-review` |
| Render finished Markdown as a print-quality PDF book | `imac-pdf-book` |

Load every skill that matches the deliverable. For a full feature chapter, use architecture first, then concept, task, API reference, voice, and review.

## Use the default chapter contract

```markdown
# <Feature>

## About this chapter
Audience, scope, prerequisites, supported versions, outcomes, and reading paths.

## About <Feature>
Purpose, vocabulary, architecture, lifecycle, invariants, limits, and diagram.

## Using <Feature>
Common workflow, progressive tested example, failure recovery, cleanup, verification,
and advanced variants.

## <Feature> reference
Canonical signatures plus parameter, result, error, ownership, async, compatibility,
and see-also contracts.

## Summary
Mental model, common path, invariants, generated public-surface inventory, and next paths.
```

## Preserve these invariants

- Separate learning, doing, and lookup instead of making one page serve all modes.
- State audience, scope, prerequisites, versions, and exclusions early.
- Teach the smallest useful subset before the complete surface.
- Put caveats and warnings beside the operation they qualify.
- Define terms and subsystem boundaries precisely.
- Explain state transitions, ownership, completion, errors, and recovery.
- Use diagrams for relationships and flow; use tables for comparisons and edge cases.
- Cross-link by purpose, not merely by title.
- Keep examples coherent, executable, versioned, and tested.
- End with an operational summary or generated inventory.

## Explicitly discard aged practices

Do not reproduce:

- print page references, static indexes, or duplicated cross-volume material;
- Pascal-first or assembly/register/trap documentation;
- hardware addresses, private layouts, or platform internals unless publicly contractual;
- global result-code conventions where typed errors or rejected promises apply;
- duplicated hand-maintained language interfaces;
- examples with deliberately omitted production error handling;
- hedged claims that samples were only partly compiled or tested, or disclaimers that samples are not meant for use;
- scattered compatibility folklore instead of structured version metadata;
- paternalistic, gendered, moralizing, or vendor-universal language;
- dense linear prose where links, steps, tables, or progressive disclosure work better.

## Consult the sources

Use [`references/sources.md`](references/sources.md) to find the original passages behind each pattern. It paraphrases each technique and points to its location in the text extraction. To render a finished guide as a print-quality PDF, use `imac-pdf-book`.
