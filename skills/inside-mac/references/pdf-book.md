# Render the guide as a book

Draft and review the content first. The pipeline in [`assets/`](../assets/) turns finished Markdown into a paginated PDF in the visual style of the 1990s series.

## Set up a book directory

Copy `assets/` into a new directory, for example `my-guide/`:

```
my-guide/
  book.json      { "title": "Inside Acme: Widgets" }
  package.json   marked, mermaid, pagedjs, puppeteer-core
  build.mjs      Markdown → HTML → Paged.js → PDF
  style.css      page geometry and typography
  src/           one Markdown file per chapter, built in filename order
```

Replace the sample chapters in `src/`, set the title in `book.json`, then install the dependencies and build:

```sh
npm install
npm run build        # writes "<title>.pdf" and build/book.html
```

The build drives a locally installed Google Chrome through `puppeteer-core`. Set `CHROME_PATH` when Chrome is not at `/Applications/Google Chrome.app`. Mermaid and Paged.js load from `node_modules`, so the build needs no network access after the install.

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
| Callout | `> [!NOTE]`, `> [!IMPORTANT]`, or `> [!WARNING]`, followed by `>` lines | Labeled box with a left rule |
| Figure | A paragraph starting `**Figure N-M: Caption.**` directly followed by a ` ```mermaid ` block | Captioned figure kept on one page |
| Code | Fenced code block with a language | Monospaced block with a left rule |
| Table | GFM table | Ruled table whose rows are not split across pages |

Number figures by chapter (`Figure 3-2`) in the text itself. [concepts.md](concepts.md) covers what a caption says and how large a figure's labels must be.

## Layout

- The trim size is 7.5 × 9.25 in, with mirrored margins and a wider inside margin.
- Body text is Palatino. Headings, tables, and running heads are Helvetica Neue. Code is Menlo.
- Page numbers sit on the outside edge. The running head shows the chapter label on the left and the chapter title on the right, and is hidden on chapter-opening pages.
- A chapter starts on the next page, which can be a left-hand page, so the book has fewer blank pages.
- A page holds about 220 words of a typical technical chapter once code listings, tables, figures, and chapter openings are counted. Multiply a page budget by 220 to get a word budget.

Make visual changes in `style.css` rather than `build.mjs`. Change `@page size` and the margins together.

## Verify the output

1. Read the page count the build prints.
2. Read the figure report that follows it. The build measures each Mermaid figure after pagination and lists, by page and figure number, every figure whose smallest label renders below 5.5 pt. Set `MIN_FIGURE_PT` to change the threshold, and set `STRICT_FIGURES=1` to make the build exit with an error when any figure is listed. Redesign each listed figure as concepts.md describes, even when that adds a page.
3. Rasterize a few pages (`pdftoppm -r 60 -png book.pdf pages/p`) and inspect the cover, the table of contents, one chapter opener, every figure, and one page with a wide table.
4. Confirm that no figure is separated from its caption, that the table of contents shows page numbers, and that no Mermaid block rendered as raw text. Raw text means a syntax error; look for `pageerror` in the build output.

To check text outside Mermaid figures, such as an image or a wide table, run `pdftotext -bbox -f N -l N book.pdf -` for the page. Each word's height (`yMax - yMin`) is about 1.15 times its font size in points.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| The build hangs, then times out | A Mermaid syntax error stopped rendering | Fix the diagram. Quote labels that contain `()` or `:`. |
| A chapter title sits alone on a page | A CSS `page:` property on the chapter opener forces a break | Do not assign named pages to chapter openers. |
| The figure report lists a figure | A wide layout was scaled down to the page width | Use `flowchart TB`, reduce the participants, or split the diagram. |
| The table of contents lacks page numbers | Headings lack IDs, or the TOC markup changed | Keep the `<nav id="toc"></nav>` placeholder. |
