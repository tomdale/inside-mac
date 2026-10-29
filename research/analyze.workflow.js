// Reproduces the corpus analysis behind skills/inside-mac. The synthesis phase
// writes a first draft of the guidance as separate skills; skills/inside-mac
// consolidates and revises that draft.
// Runs with pi-dynamic-workflows (https://github.com/tomdale/toolbelt) or any
// runner that provides agent()/parallel()/phase(). Pass:
//   args.dir   absolute path to corpus/text
//   args.out   absolute path to the directory that receives the skills
//   args.files the .txt files to analyze (omit the X-Ref index volumes)
// One cheap model analyzes each book; one strong model synthesizes the skills.
export const meta = {
  name: 'inside_mac_style_analysis',
  description: 'Analyze Inside Macintosh books and synthesize documentation-style skills',
  phases: [{ title: 'Analyze' }, { title: 'Synthesize' }],
};

const lens = `Analyze this Inside Macintosh book as a model of technical documentation. The extracted text is at: FILE
It is large: do NOT read it all. Sample strategically (grep -n, sed -n ranges): the preface and conventions, the table of contents, 2-3 chapter openings, one conceptual "About X" section, one task "Using X" section with code, one reference section, and summaries or the glossary if present.
Report concisely (<= 900 words), citing line numbers. Paraphrase; quote at most a few words.
1. STRUCTURE: book, chapter, and section architecture; recurring templates; concept -> task -> reference ordering; navigation aids; cross-references; summaries; note/warning conventions.
2. TONE & VOICE: person, formality, sentence patterns, handling of caveats and compatibility.
3. METHODOLOGY: how APIs are specified (parameters, results, errors, preconditions), how examples are built, how completeness is ensured.
4. PEDAGOGY: concept introduction, layering, analogy and figures, prerequisites, progressive disclosure, reader roadmaps.
5. DISTINCTIVE TECHNIQUES worth copying for modern docs, and practices that have aged badly.`;

phase('Analyze');
const reports = await parallel(
  args.files.map((f) => () =>
    agent(lens.replace('FILE', `${args.dir}/${f}`), { label: `analyze ${f.slice(0, 40)}`, tier: 'small' })
      .then((report) => ({ file: f, report })),
  ),
);
const ok = reports.filter((r) => r.report);
log(`${ok.length}/${reports.length} reports`);

phase('Synthesize');
const synth = await agent(
  `Synthesize these ${ok.length} analyses of Apple's Inside Macintosh series into agent skills for writing documentation in that style for a modern audience (web APIs, SDKs, CLIs, frameworks; TypeScript examples).
Write each skill as ${args.out}/<name>/SKILL.md with YAML frontmatter (name; a description stating when to use it) and a dense, imperative body with concrete templates, under ~250 lines. Suggested set, all prefixed "imac-": doc-architecture, voice-and-tone, concept-explainer, task-guides, api-reference, review, plus an imac-style router. Modernize (Markdown, typed errors instead of result codes, web navigation) and name the practices to drop. Do not reproduce Apple's text; paraphrase and cite book and line numbers in ${args.out}/imac-style/references/sources.md.

ANALYSES:
${ok.map((r) => `### ${r.file}\n${r.report}`).join('\n\n')}`,
  { label: 'synthesize skills', tier: 'big' },
);
return { reports: ok.length, missing: reports.filter((r) => !r.report).map((r) => r.file), synth };
