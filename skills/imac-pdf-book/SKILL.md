---
name: imac-pdf-book
description: Renders a Markdown documentation set into a print-quality PDF book in the Inside Macintosh visual style, with a cover, a table of contents with page numbers, chapter openers, running heads, labeled callouts, Mermaid figures, and appendixes. Use when asked to produce a PDF guide, manual, or book from Markdown, or to package documentation written with the imac-* skills as a printable deliverable.
---

# Render the guide as a book

Write the content with the other `imac-*` skills first. This skill only turns finished Markdown into a paginated PDF.

## Set up a book directory

Copy `assets/` from this skill into a new directory, for example `my-guide/`:

```
my-guide/
  book.json      { "title": "Inside Acme: Widgets" }
  package.json   marked, mermaid, pagedjs, puppeteer-core
  build.mjs      Markdown → HTML → Paged.js → PDF
  style.css      page geometry and typography
  src/           one Markdown file per chapter, built in filename order
```

Then install the dependencies and build:

```sh
npm install
npm run build        # writes "<title>.pdf" and build/book.html
```

The build drives a locally installed Google Chrome with `puppeteer-core`. Set `CHROME_PATH` if Chrome is somewhere other than `/Applications/Google Chrome.app`. Mermaid and Paged.js load from `node_modules`, so no network access is needed after install.

Add `node_modules/` and `build/` to `.gitignore`.

## Source conventions

| Construct | Write | Result |
|---|---|---|
| Cover | `<div class="cover">` containing `cover-kicker`, `cover-title`, `cover-sub`, and `cover-meta` divs | Full-bleed dark cover page |
| Table of contents | `<div class="toc-page">`, `## Contents`, and `<nav id="toc"></nav>` | Generated from H1 and H2 headings, with page numbers |
| Chapter | `# Title` | New page, "Chapter N" label, rule, running head |
| Unnumbered front matter | `# Preface {.unnumbered}` | Chapter opener without a number |
| Appendix | `# Glossary {.appendix}` | "Appendix A", "Appendix B", and so on |
| Section | `## Heading`, `### Heading` | Ruled sans-serif section heads |
| Callout | `> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`, followed by `>` lines | Labeled, left-ruled box |
| Figure | A paragraph starting `**Figure N-M: Caption.**` directly followed by a ` ```mermaid ` block | Captioned figure that is kept on one page |
| Code | Fenced code block with a language | Monospaced block with a left rule |
| Tables | GFM tables | Ruled tables. Rows are not split across pages. |

Number figures by chapter (`Figure 3-2`) in the text itself. Write captions that state the lesson, not just the topic.

## Layout decisions

- The trim size is 7.5 × 9.25 in, with mirrored margins and a wider inside margin, as in the 1990s series.
- Body text is Palatino. Headings, tables, and running heads are Helvetica Neue. Code is Menlo.
- Page numbers are on the outside edge. The running head shows the chapter label on the left and the chapter title on the right, and is hidden on chapter-opening pages.
- A chapter starts on a new page, not always a right-hand one, so the book has fewer blank pages.

Adjust `style.css` rather than `build.mjs` for visual changes. Change `@page size` and the margins together.

## Verify the output

1. Check the page count that the build prints.
2. Rasterize a few pages (`pdftoppm -r 60 -png book.pdf pages/p`) and inspect the cover, the table of contents, one chapter opener, one figure, and one page with a wide table.
3. Confirm that no figure is separated from its caption, that the table of contents shows page numbers, and that no Mermaid block rendered as raw text. Raw text means a syntax error: check the build output for `pageerror`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build hangs, then times out | A Mermaid syntax error stopped rendering | Fix the diagram. Quote labels that contain `()` or `:`. |
| A chapter title sits alone on a page | A CSS `page:` property on the chapter opener forces a break | Do not assign named pages to openers |
| Figure too small | A wide left-to-right layout was scaled down to the page width | Use `flowchart TB`, or split the diagram |
| Table of contents missing page numbers | Headings lack IDs, or the TOC markup changed | Keep the `<nav id="toc"></nav>` placeholder |
