# Inside Zustand: State Management with Zustand

A complete example output of the `inside-mac` skills: a from-scratch, Inside-Macintosh-style
technical guide to [Zustand](https://github.com/pmndrs/zustand), the pmndrs React state-management
library, rendered as a print-quality PDF book with `imac-pdf-book`.

**[Read the PDF](./Inside%20Zustand-%20State%20Management%20for%20React.pdf)** — 67 pages.

This guide is unofficial and independently written. It is not affiliated with, endorsed by, or
reviewed by the pmndrs organization or Zustand's maintainers. Zustand is MIT-licensed; see
[pmndrs/zustand](https://github.com/pmndrs/zustand) for the canonical source and official docs.

## Preview

| Cover | Contents |
|---|---|
| ![Cover](./preview/01-cover.png) | ![Contents](./preview/02-contents.png) |

| Chapter opener | Figure |
|---|---|
| ![Chapter opener](./preview/03-chapter-opener.png) | ![Figure](./preview/04-figure.png) |

## What it covers

The guide documents **Zustand 5.0.15** at commit
[`b57db4f86ef179285da216eeb291266da82c361c`](https://github.com/pmndrs/zustand/commit/b57db4f86ef179285da216eeb291266da82c361c)
on `pmndrs/zustand` `main`, cloned shallowly for research and not included in this repository.
Every claim is grounded in that commit's source (`src/vanilla.ts`, `src/react.ts`,
`src/react/shallow.ts`, `src/vanilla/shallow.ts`, `src/traditional.ts`, `src/middleware.ts`, and
each file under `src/middleware/`), its test suite, and its `docs/` folder — not reproduced from
Zustand's prose, which this guide does not copy.

Chapters:

1. **Introduction to Zustand** — the problem, non-goals, comparison with Context and Redux, core
   vocabulary, one worked example, and a component diagram.
2. **Stores** — the vanilla store's internals: `setState` merge/replace semantics, listeners,
   `getInitialState`; creating a store, actions, async actions, and reading state outside React.
3. **Using Stores in React** — `create`/`useStore`, the `Object.is` re-render rule, `useShallow`,
   `createWithEqualityFn`/`zustand/traditional`, and context-scoped stores for SSR or per-instance
   state.
4. **Middleware** — composition order and typing via mutators; `persist`, `devtools`, `immer`,
   `subscribeWithSelector`, `combine`, and `redux`, each with usage and a full option/method
   reference.
5. **TypeScript** — why `create<T>()(...)` is curried, `StateCreator`'s type parameters, typing a
   middleware stack, writing your own middleware, and the slices pattern.
6. **Testing and Patterns** — resetting stores between tests, slicing a large store, and transient
   (non-re-rendering) updates via `subscribe`.

Plus a Preface and three appendixes: Glossary, API Summary, and Known Gaps and Pitfalls.

No claim in the guide is marked **Inferred**: every behavioral statement was checked directly
against the commit's source or its `docs/` folder while writing, rather than assumed. One section
is a deliberate, disclosed simplification rather than an inference: Chapter 6's store-reset pattern
adapts Zustand's own Jest/Vitest `__mocks__/zustand.ts` testing guide into a plain wrapped `create`
function, without the mock-file wiring, to keep the example self-contained; the chapter's own text
notes that a real test suite still needs a module alias or mock to substitute it for `zustand`'s
`create`.

## How this was produced

Written using the `inside-mac` skills against the cloned Zustand source and docs:

- `imac-doc-architecture` for the book's chapter layout and each chapter's roadmap opener.
- `imac-concept-explainer` for the "About" sections (store internals, the React integration,
  middleware composition, Zustand's TypeScript design).
- `imac-task-guides` for the "Using" sections (creating stores, wiring React components, applying
  each middleware, testing and patterns).
- `imac-api-reference` for every reference entry (`createStore`, `StoreApi`, `create`, `useStore`,
  `useShallow`, and the six middleware).
- `imac-voice-and-tone` for modal-verb discipline, callouts, and rule/rationale/consequence prose.
- `imac-review`'s checklist, applied as a self-review pass before rendering.
- `imac-pdf-book` to render the Markdown in `src/` to the PDF above.

## Rebuilding

```sh
cd examples/zustand
npm install
npm run build        # writes "Inside Zustand: State Management for React.pdf" and build/book.html
```

Requires a local Google Chrome install; set `CHROME_PATH` if it isn't at the default macOS
location. See [`../../skills/imac-pdf-book/SKILL.md`](../../skills/imac-pdf-book/SKILL.md) for the
build pipeline's source-file conventions and troubleshooting.

To regenerate the preview images after a rebuild:

```sh
PDF="Inside Zustand- State Management for React.pdf"
pdftoppm -r 150 -png -f 1 -l 1 -singlefile "$PDF" preview/01-cover
pdftoppm -r 150 -png -f 2 -l 2 -singlefile "$PDF" preview/02-contents
pdftoppm -r 150 -png -f 7 -l 7 -singlefile "$PDF" preview/03-chapter-opener
pdftoppm -r 150 -png -f 12 -l 12 -singlefile "$PDF" preview/04-figure
pdftoppm -r 150 -png -f 42 -l 42 -singlefile "$PDF" preview/05-reference
```

Page numbers above match this build; a future edit to `src/` will shift them, so re-check the PDF's
table of contents before re-running the commands.
