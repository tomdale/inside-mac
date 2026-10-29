# inside-mac

An agent skill for writing technical documentation in the style of Apple's **Inside Macintosh**, updated for modern APIs, SDKs, CLIs, and web docs, plus a pipeline that renders the result as a print-quality PDF book.

*Inside Macintosh* (1985–1994) is still one of the best-taught developer documentation series. It separates concepts from tasks from reference. It tells each reader what they can skip. It puts warnings at the point of danger, and it specifies every contract completely. The `inside-mac` skill captures those techniques and drops what hasn't aged well: page references, Pascal-first examples, global result codes, and hedged sample code.

## Examples

[`examples/zustand`](examples/zustand) is a complete, from-scratch guide written with an earlier version of this skill for
[Zustand](https://github.com/pmndrs/zustand), the pmndrs React state-management library: six
chapters, a preface, and three appendixes, rendered to a 67-page PDF with the skill's PDF pipeline. It is
unofficial and not affiliated with pmndrs. See the example's own README for how it was produced and
which version of Zustand it documents.

<p>
  <img src="examples/zustand/preview/01-cover.png" alt="Cover of Inside Zustand: State Management with Zustand" width="45%">
  <img src="examples/zustand/preview/04-figure.png" alt="Figure 1-1 from the Zustand guide: how components subscribe to a store through selectors" width="45%">
</p>

[Read the PDF](<examples/zustand/Inside Zustand- State Management for React.pdf>) ·
[Read the source](examples/zustand/src) · [Read the README](examples/zustand/README.md)

[`examples/skills-cli`](examples/skills-cli) is a complete guide, written with an earlier version of this skill, to the [`skills`](https://github.com/vercel-labs/skills)
CLI (the open agent skills ecosystem, `npx skills …`): six chapters, a preface, and three
appendixes, rendered to a 51-page PDF with the skill's PDF pipeline. See the example's own README for how it
was produced and which version and commit of `skills` it documents.

<p>
  <img src="examples/skills-cli/preview/01-cover.png" alt="Cover of Agent Skills and the skills CLI" width="45%">
  <img src="examples/skills-cli/preview/04-figure.png" alt="An agent-targets figure from the skills CLI guide" width="45%">
</p>

[Read the PDF](<examples/skills-cli/Inside Skills- Agent Skills and the skills CLI.pdf>) ·
[Read the source](examples/skills-cli/src) · [Read the README](examples/skills-cli/README.md)

## The skill

[`skills/inside-mac`](skills/inside-mac) is one skill. Its [`SKILL.md`](skills/inside-mac/SKILL.md) holds the core rules that apply to every documentation task and a table that tells the agent which reference file to load for the task at hand:

| Reference | Use it to |
|---|---|
| [`architecture.md`](skills/inside-mac/references/architecture.md) | Plan a book or documentation set: concept, task, and reference separation, reader roadmaps, cross-links, length budgets |
| [`content.md`](skills/inside-mac/references/content.md) | Decide audience and depth, keep the text durable, and turn code, READMEs, and design documents into stated facts |
| [`voice-and-tone.md`](skills/inside-mac/references/voice-and-tone.md) | Write precise, readable prose: modal verbs, rules with their reasons, callouts, and patterns that read as generated |
| [`concepts.md`](skills/inside-mac/references/concepts.md) | Write "About X" material: mental models, vocabulary, lifecycles, legible figures |
| [`task-guides.md`](skills/inside-mac/references/task-guides.md) | Write "Using X" guides: one example that grows step by step, failure paths, verification |
| [`api-reference.md`](skills/inside-mac/references/api-reference.md) | Write reference entries: parameters, completion states, behavior, errors, and related entries |
| [`review.md`](skills/inside-mac/references/review.md) | Check a draft against the style |
| [`pdf-book.md`](skills/inside-mac/references/pdf-book.md) | Render Markdown as a paginated PDF with the pipeline in [`assets/`](skills/inside-mac/assets) |
| [`sources.md`](skills/inside-mac/references/sources.md) | Find the original passages behind each technique |

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```sh
npx skills add tomdale/inside-mac
```

This installs the `inside-mac` skill. Or copy the `skills/inside-mac/` directory, including its `references/` and `assets/`, into your agent's skills directory, for example `~/.claude/skills/`, `~/.agents/skills/`, or a project's `.agents/skills/`.

Then ask your agent something like:

> Using the inside-mac skill, write a full-length technical guide to our billing API and render it as a PDF.

## What a guide looks like

An agent using the skill typically produces:

- a **preface** that states the audience, supported versions, what to read for each goal, what to skip, and the conventions used;
- **chapters** that open with a roadmap ("Read this chapter if…", "In this chapter you will…"), explain the model before the calls, teach the common path with a tested example, and specify the behavioral contract. Concept, task, and reference material stay separate: across the book when it documents one system, inside each chapter when each chapter documents its own subsystem;
- **appendixes** with a glossary, error index, limits, and known gaps.

The PDF pipeline then lays it out at 7.5 × 9.25 in with Palatino body text and Helvetica headings, like the 1990s series.

## Reproducing the research

The skill was distilled from 33 books of the series by a parallel multi-agent analysis. This repository contains **no Apple material**: the PDFs and their text are downloaded locally, gitignored, and used only for study. To reproduce:

```sh
scripts/fetch-sources.sh     # ~830 MB of PDFs from vintageapple.org → corpus/pdf/
scripts/extract-text.sh      # pdftotext -layout → corpus/text/  (requires poppler)
```

Then run [`research/analyze.workflow.js`](research/analyze.workflow.js) with a workflow runner that provides `agent()`, `parallel()`, and `phase()` (for example [pi-dynamic-workflows](https://github.com/tomdale/toolbelt)). It sends one small-model agent to each book and one large-model agent to synthesize a first draft of the guidance. The published skill consolidates and revises that draft. The original run cost about $1.20 and took six minutes. Leave out the six X-Ref index volumes, but include the X-Ref glossary.

[`skills/inside-mac/references/sources.md`](skills/inside-mac/references/sources.md) maps each technique to the book and line range in `corpus/text/` where it appears. Each entry paraphrases the technique rather than quoting it.

Sources, all hosted by [vintageapple.org](https://vintageapple.org):

- Original series, Volumes I–VI (1985–1991): <https://vintageapple.org/inside_o/>
- New series (1992–1994): <https://vintageapple.org/inside_r/>

The full URL list is in [`scripts/sources.txt`](scripts/sources.txt).

## Legal

*Inside Macintosh* is © Apple Inc. This project is not affiliated with or endorsed by Apple. It contains original text written after studying the series, and links to publicly hosted copies. It redistributes no Apple content.

The skill and scripts are released under the [MIT License](LICENSE).
