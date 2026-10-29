# Inside Skills: Agent Skills and the skills CLI

A complete, from-scratch technical guide to the [`skills`](https://github.com/vercel-labs/skills)
CLI, the package manager for the open agent skills ecosystem (installed and run as `npx skills …`),
written and rendered with this repository's `inside-mac` skill. It is **unofficial**: not affiliated
with, endorsed by, or reviewed by Vercel, Inc. or the `skills` maintainers.

- **Covers:** `skills` 1.7.4, tag [`v1.7.4`](https://github.com/vercel-labs/skills/tree/v1.7.4)
  (commit [`a80e4c9`](https://github.com/vercel-labs/skills/commit/a80e4c9d12d607631249d4d7d059f835d4b2f13a)),
  the release that `npx skills@1.7.4` installs.
- **Length:** 58 pages (front matter, 7 chapters, 3 appendixes).
- **License of the subject project:** MIT, © Vercel, Inc. This guide quotes only command names,
  flag names, and short output fragments from that public repository; the surrounding prose is
  original.

## Contents

The CLI is one system, so the book separates concepts, tasks, and reference across chapters:

1. Introduction to Agent Skills
2. About Skills and Sources
3. About Scopes, Agents, and Lock Files
4. Installing and Managing Skills
5. Sharing Skills Through a Project
6. Authoring and Publishing Skills
7. Command Reference

The book also has a Preface and three appendixes: Files and Environment Variables, Errors and
Recovery, and Glossary.

## Previews

<p>
  <img src="preview/01-cover.png" alt="Cover" width="32%">
  <img src="preview/02-contents.png" alt="Table of contents" width="32%">
  <img src="preview/03-chapter-opener.png" alt="Chapter 1 opener" width="32%">
</p>
<p>
  <img src="preview/04-figure.png" alt="Figure 3-1, symlink mode compared with copy mode" width="32%">
  <img src="preview/05-reference.png" alt="The skills add entry in the command reference" width="32%">
</p>

## How this was produced

The guide was written with the [`inside-mac`](../../skills/inside-mac) skill by the same multi-agent
workflow as the [Zustand example](../zustand/README.md#how-this-was-produced): one planning agent,
one drafting agent per file, a cutting pass, three whole-book reviewers (structure and content,
accuracy, and prose), and one revising agent per file.

1. **Plan.** The planning agent read the skill, studied the CLI's TypeScript source, tests, and
   docs at the tag above, and gave every file a page budget and a word budget of 220 words per
   page, as [`architecture.md`](../../skills/inside-mac/references/architecture.md) describes. The
   plan totaled 47.5 pages.
2. **Draft.** Each drafting agent measured its file against its word budget. Every file finished
   within 10% of its budget, so the cutting pass changed nothing.
3. **Capture.** Every command transcript was captured from `skills` 1.7.4. Each run used a fresh
   temporary `HOME`, local fixture skills as sources, and `DISABLE_TELEMETRY=1`, so no run touched
   a real configuration or sent telemetry. The book shows sandbox paths as
   `/tmp/demo`.
4. **Review and revise.** The reviewers reported 54 findings, 17 of them major. The revising agents
   applied all of them except four that asked for changes in another file. The book ended at about
   12,000 words.
5. **Render.** This directory is a copy of
   [`skills/inside-mac/assets/`](../../skills/inside-mac/assets) with its sample `src/` replaced by
   this guide's chapters and `book.json`'s title set. The pipeline's figure check passed every
   figure at 5.5 pt or larger, and every internal link resolves to a heading.

## Claims marked Unverified

The book marks two claims **Unverified**, as
[`content.md`](../../skills/inside-mac/references/content.md) asks for claims a reader would act on:

- Windows behavior, such as directory junctions in place of symbolic links. It is read from the
  source, and no example was run on Windows.
- The scope of the `notion` source in Chapter 2's source-format table, which the CLI routes
  through a dedicated code path that the book did not exercise.

## Rebuilding

```sh
cd examples/skills-cli
npm install
npm run build        # writes "Inside Skills- Agent Skills and the skills CLI.pdf" and build/book.html
```

Requires a local Google Chrome install (or set `CHROME_PATH`). To re-export the previews after a
rebuild:

```sh
PDF="Inside Skills- Agent Skills and the skills CLI.pdf"
pdftoppm -r 150 -png -f 1  -l 1  -singlefile "$PDF" preview/01-cover
pdftoppm -r 150 -png -f 2  -l 2  -singlefile "$PDF" preview/02-contents
pdftoppm -r 150 -png -f 8  -l 8  -singlefile "$PDF" preview/03-chapter-opener
pdftoppm -r 150 -png -f 21 -l 21 -singlefile "$PDF" preview/04-figure
pdftoppm -r 150 -png -f 45 -l 45 -singlefile "$PDF" preview/05-reference
```

Page numbers shift when the source changes, so check the table of contents first.

## What this is not

This example does not modify, vendor, or redistribute any code from `vercel-labs/skills`. The
checkout used for research was made outside the tracked tree and is not included here.
