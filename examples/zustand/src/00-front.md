<div class="cover">

<div class="cover-kicker">Inside Zustand</div>

<div class="cover-title">State Management with Zustand</div>

<div class="cover-sub">A guide to stores, selectors, middleware, and TypeScript in the pmndrs Zustand library</div>

<div class="cover-meta">

Covers Zustand 5.0.15 (commit `b57db4f`)

An unofficial guide, written as a worked example of the `inside-mac` documentation skills

</div>
</div>

<div class="toc-page">

## Contents

<nav id="toc"></nav>

</div>

# Preface {.unnumbered}

## About This Guide

Zustand is a small state-management library for React and other JavaScript UIs. A store holds
state and the functions that change it; components read slices of that state with a selector
and re-render only when the slice they read changes. This guide explains that model, the
`create` and `createStore` APIs, the official middleware, and the TypeScript conventions the
library uses to type them.

> [!NOTE]
> This is an unofficial, independently written guide produced as an example output of the
> `inside-mac` skills for a coding agent. It is not affiliated with, endorsed by, or reviewed by
> the pmndrs organization or Zustand's maintainers. Zustand is open-source software released
> under the MIT License; see [pmndrs/zustand](https://github.com/pmndrs/zustand) for the
> canonical source, issue tracker, and official documentation.

## Who Should Read This Guide

This guide is for developers who already know React and want to add or replace state
management with Zustand. It assumes you can read TypeScript, have used React hooks, and have
built at least one component that manages its own `useState`. It does not assume prior
experience with Redux, Flux, or any other state library, though Chapter 1 compares Zustand with
Context and Redux for readers coming from those tools.

## What to Read

| If you want to… | Read… | You can skip… |
|---|---|---|
| Decide whether Zustand fits your app | Chapter 1, Introduction to Zustand | Chapters 4–5 |
| Learn the store model before writing code | Chapter 2, About Stores | Chapter 5 |
| Wire a store into React components today | Chapter 3, Using Stores in React | Chapter 2's internals section |
| Add persistence, Redux DevTools, or Immer | Chapter 4, Middleware | Chapter 6 |
| Type a store, middleware stack, or slice | Chapter 5, TypeScript | Chapter 4's non-TypeScript examples |
| Test components and stores, or split a large store | Chapter 6, Testing and Patterns | — |
| Look up an exact signature, option, or term | Appendix B, API Summary, or Appendix A, Glossary | Narrative chapters |

## Supported Version

This guide documents **Zustand 5.0.15** at commit
[`b57db4f`](https://github.com/pmndrs/zustand/commit/b57db4f86ef179285da216eeb291266da82c361c)
on the `pmndrs/zustand` `main` branch. Zustand 5 requires React 18 or later for the React
integration (`zustand`, `zustand/react`, `zustand/traditional`) and drops the UMD build, default
exports, and ES5 support that earlier versions carried. The vanilla store (`zustand/vanilla`) has
no React dependency and works in any JavaScript runtime. Where a behavior changed from v4, this
guide says so; it does not otherwise cover v3 or v4.

## Conventions

Code samples use TypeScript and the ES module form of `import`. Samples that only illustrate the
runtime API use JavaScript. Every multi-line sample is complete enough to run after you add the
`zustand` import shown at its top; sample fragments that continue a previous listing say so in
the surrounding text.

This guide uses three callouts:

> [!NOTE]
> Optional context: background, a related pattern, or a fact that helps but is not required to
> proceed.

> [!IMPORTANT]
> A condition you must satisfy for the surrounding procedure or type to work correctly.

> [!WARNING]
> An action that can silently break re-rendering, discard data, or produce a runtime error.
> Warnings name the consequence and the safer alternative.

Function and hook names are set in `code font` on first use in each section and linked to their
reference entry where one exists. Terms defined in the Glossary appear in **bold** the first time
a chapter uses them.
