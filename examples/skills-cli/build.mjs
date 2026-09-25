// Builds a book from src/*.md into build/book.html and "<title>.pdf", using
// the title in book.json. Markdown is rendered with marked; Mermaid renders the
// diagrams and Paged.js paginates (running heads, TOC page numbers) inside
// headless Chrome, which puppeteer-core drives to print the PDF.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Marked } from 'marked';
import puppeteer from 'puppeteer-core';

const root = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'build');
const book = JSON.parse(await readFile(path.join(root, 'book.json'), 'utf8'));
const pdfPath = path.join(root, `${book.title.replace(/[\\/:*?"<>|]/g, '-')}.pdf`);
const chrome =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const slugCounts = new Map();
function slugify(text) {
  const base = text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`'’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const n = slugCounts.get(base) ?? 0;
  slugCounts.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Convert GitHub-style alert blockquotes into styled callout blocks.
function convertCallouts(md) {
  const lines = md.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^> \[!(NOTE|IMPORTANT|WARNING)\]\s*$/);
    if (!m) {
      out.push(lines[i]);
      continue;
    }
    const body = [];
    while (i + 1 < lines.length && lines[i + 1].startsWith('>')) {
      body.push(lines[++i].replace(/^> ?/, ''));
    }
    const kind = m[1].toLowerCase();
    const label = m[1][0] + m[1].slice(1).toLowerCase();
    out.push(
      `<div class="callout ${kind}"><div class="callout-label">${label}</div>`,
      '',
      ...body,
      '',
      '</div>',
    );
  }
  return out.join('\n');
}

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.md')).sort();
const toc = [];
let chapter = 0;
let appendix = 0;
let currentChapterId = null;

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth, text }) {
      const raw = text;
      const attr = raw.match(/\s*\{\.(unnumbered|appendix)\}\s*$/);
      const clean = raw.replace(/\s*\{\.[a-z]+\}\s*$/, '');
      const inner = this.parser.parseInline(
        new Marked().lexer(clean)[0]?.tokens ?? tokens,
      );
      if (clean === 'Contents') return `<h2 class="toc-title">Contents</h2>`;
      const id = slugify(clean);
      if (depth === 1) {
        let label = '';
        let cls = 'chapter';
        if (attr?.[1] === 'unnumbered') {
          cls = 'chapter unnumbered';
        } else if (attr?.[1] === 'appendix') {
          label = `Appendix ${String.fromCharCode(65 + appendix++)}`;
          cls = 'chapter appendix';
        } else {
          label = `Chapter ${++chapter}`;
        }
        currentChapterId = id;
        toc.push({ depth: 1, id, text: inner, label });
        return `<section class="${cls}-start"><div class="chapter-label">${label}</div><h1 id="${id}" class="${cls}">${inner}</h1></section>`;
      }
      if (depth === 2) toc.push({ depth: 2, id, text: inner, parent: currentChapterId });
      return `<h${depth} id="${id}">${inner}</h${depth}>`;
    },
    paragraph({ tokens }) {
      const inner = this.parser.parseInline(tokens);
      if (/^<strong>Figure /.test(inner)) return `<p class="figcaption">${inner}</p>\n`;
      return `<p>${inner}</p>\n`;
    },
    code({ text, lang }) {
      if (lang === 'mermaid') return `<pre class="mermaid">${escapeHtml(text)}</pre>`;
      return `<pre class="code"><code class="lang-${lang ?? 'text'}">${escapeHtml(text)}</code></pre>`;
    },
  },
});

let body = '';
for (const file of files) {
  const md = convertCallouts(await readFile(path.join(srcDir, file), 'utf8'));
  body += `<div class="file file-${file.replace(/\.md$/, '')}">${marked.parse(md)}</div>\n`;
}

const tocHtml =
  '<ul class="toc">' +
  toc
    .map((e) =>
      e.depth === 1
        ? `<li class="toc-1"><a href="#${e.id}"><span class="toc-label">${e.label}</span><span class="toc-text">${e.text}</span></a></li>`
        : `<li class="toc-2"><a href="#${e.id}"><span class="toc-text">${e.text}</span></a></li>`,
    )
    .join('') +
  '</ul>';
body = body.replace(
  /(<p class="figcaption">[\s\S]*?<\/p>)\s*(<pre class="mermaid">[\s\S]*?<\/pre>)/g,
  '<figure>$1$2</figure>',
);
body = body.replace('<nav id="toc"></nav>', `<nav id="toc">${tocHtml}</nav>`);

const css = (await readFile(path.join(root, 'style.css'), 'utf8')).replaceAll('__BOOK_TITLE__', book.title.replace(/"/g, '\\"'));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${book.title}</title>
<style>${css}</style>
<script>window.PagedConfig = { auto: false };</script>
<script src="../node_modules/mermaid/dist/mermaid.min.js"></script>
<script src="../node_modules/pagedjs/dist/paged.polyfill.js"></script>
</head><body>${body}
<script>
  (async () => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose',
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      flowchart: { htmlLabels: true, curve: 'basis' }, sequence: { useMaxWidth: true } });
    await mermaid.run({ querySelector: 'pre.mermaid' });
    await window.PagedPolyfill.preview();
    window.__pagedDone = true;
  })().catch((e) => { window.__pagedError = String(e && e.stack || e); });
</script>
</body></html>`;

await mkdir(outDir, { recursive: true });
const htmlPath = path.join(outDir, 'book.html');
await writeFile(htmlPath, html);

const browser = await puppeteer.launch({ executablePath: chrome, headless: true,
  args: ['--allow-file-access-from-files'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.goto('file://' + htmlPath, { waitUntil: 'load', timeout: 120_000 });
  await page.waitForFunction('window.__pagedDone || window.__pagedError', { timeout: 300_000 });
  const err = await page.evaluate('window.__pagedError');
  if (err) throw new Error(err);
  const pages = await page.evaluate('document.querySelectorAll(".pagedjs_page").length');
  await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true, timeout: 300_000 });
  console.log(`Wrote ${pdfPath} (${pages} pages)`);
} finally {
  await browser.close();
}
