<div class="cover">

<div class="cover-kicker">Inside Zustand</div>

<div class="cover-title">State Management for React</div>

<div class="cover-sub">Stores, selectors, middleware, and persistence with the pmndrs Zustand library</div>

<div class="cover-meta">

Covers Zustand 5.0.16 (tag v5.0.16, commit 382d29c)

An unofficial, independently written guide. Not affiliated with or endorsed by pmndrs or the Zustand maintainers.

</div>
</div>

<div class="toc-page">

## Contents

<nav id="toc"></nav>

</div>

# Preface {.unnumbered}

Zustand is a small state-management library from the pmndrs collective. A Zustand store holds application state outside the React component tree. Components read it through hooks, and plain JavaScript reads and updates it through a handful of methods. This book explains how a store computes and announces each update, how React components subscribe to it, and how the bundled middleware changes that behavior. It then teaches the common tasks and specifies the contract of each public function for lookup.

The book is unofficial. It was written independently of the Zustand project, and the maintainers have not reviewed it.

## Who this book is for

This book is for application developers who build React or TypeScript applications with Zustand. You create stores, read them from components and from ordinary modules, add the bundled middleware, and test the result.

The book assumes that you already know:

- modern React: function components, hooks, context, and effects;
- TypeScript at the level of interfaces, union types, generics, and utility types such as `Partial<T>`;
- ES modules and `async` functions.

You do not need to know Redux, Flux, or React's `useSyncExternalStore` hook. Chapter 3 explains the part of `useSyncExternalStore` that decides when a component re-renders.

A smaller group of readers writes its own middleware or types a middleware stack by hand. Sections for those readers are labeled "If you write middleware." Everyone else can skip them without missing anything the other chapters depend on.

## What this book covers

The book covers the vanilla store, the React bindings and selectors, module and scoped stores, the six stable bundled middleware, TypeScript typing, custom middleware, and testing. Persistence gets a full chapter, because persisted state has its own lifecycle and failure modes.

The book leaves these topics out:

- Next.js routing and the split between server and client components. Zustand's [Next.js guide](https://zustand.docs.pmnd.rs/learn/guides/nextjs) covers them. The framework-independent pattern appears in [Create a store per server request](#create-a-store-per-server-request).
- React Native. The package declares a React Native export condition, as [Requirements](#requirements) notes, but no listing in this book was run on React Native.
- Jest and Vitest module mocks that reset every store automatically. Zustand's [testing guide](https://zustand.docs.pmnd.rs/learn/guides/testing) shows that wiring. The book resets stores without a test runner's mocking features.
- Experimental exports, which [Experimental and unstable APIs](#experimental-and-unstable-apis) names without documenting.
- Zustand 3 and 4 APIs, beyond the changes listed in [Changes from Zustand 4](#changes-from-zustand-4).
- The Redux DevTools message protocol, the type-level machinery behind middleware types, and third-party libraries built on Zustand.

## Supported versions and environments

This book describes Zustand 5.0.16, tag `v5.0.16`, commit `382d29c`. Behavioral statements were checked against the library's source code and test suite at that commit.

Every listing was type-checked with `tsc` 7.0.2 under a strict `tsconfig.json` with `jsx` set to `react-jsx`. Listings that produce output were run with `tsx` 4.23.15 on Node.js 25.9.0, with React 19.3.1, react-dom 19.3.1, and Immer 11.2.9 installed, and the output shown beside a listing is the output that run printed. The test environment has no DOM, so component listings were verified by type-checking and, where a listing renders markup, by rendering it with `renderToString` from `react-dom/server`. The `use-sync-external-store` package was not installed, so listings that import `zustand/traditional` were type-checked only. A statement the book could not verify carries a leading **Unverified:** label.

For the minimum versions of React, TypeScript, and the optional peer packages, and for the differences from Zustand 4, see [Compatibility and migration](#compatibility-and-migration).

## How to read this book

Chapters 1 to 4 explain the model, and they build on each other, so read them in order. Chapters 5 to 9 teach tasks. Chapter 5 builds the cart store that Chapters 6 to 9 extend, and after it you can read the task chapters in any order. Chapter 10 and the appendixes are for lookup.

**Read this first:** Chapter 2, [Stores and State Updates](#stores-and-state-updates), is foundational. Every later chapter applies its rules for merging updates, notifying listeners, and keeping state immutable, so a reader who skips it will find selector, persistence, and middleware behavior hard to predict.

Use this table to choose a path:

| If you want to | Read | You can skip |
|---|---|---|
| Understand the model | Chapters 1 to 4 | Chapters 9 and 10 |
| Add a store to a React app | Chapter 1, Chapter 3's sections on [re-rendering](#when-a-component-re-renders) and [stable selectors](#selectors-must-return-stable-values), Chapters 5 and 6 | Chapter 4's typing sections, Chapter 8 |
| Persist state | Chapter 2's [update rules](#how-setstate-computes-the-next-state), Chapter 7 | Chapters 8 and 9 |
| Write middleware | Chapter 4, [Write your own middleware](#write-your-own-middleware) in Chapter 8 | Chapters 6 and 9 |
| Look up a contract | Chapter 10, [Persist reference](#persist-reference) in Chapter 7, [Appendix B](#errors-and-symptoms) | The narrative chapters |

Each numbered chapter opens with a roadmap that names its readers, its prerequisites, and the sections you can skip.

## Conventions

Listings are written in TypeScript. Each listing shows its imports, the types it uses, and its sample data. A listing that builds on an earlier one imports from a file shown earlier in the same chapter.

Most examples use one sample model, a storefront cart. A cart holds items keyed by SKU, an optional coupon code, and the status of a checkout. Prices are integer cents, so `1250` means $12.50. Integer arithmetic keeps subtotals exact, where sums of fractional dollars would accumulate floating-point rounding error. [Define a store with state and actions](#define-a-store-with-state-and-actions) gives the full model.

Store names follow the kind of object:

- `useCartStore` names a bound hook, the function that `create` returns. The `use` prefix tells React's lint rules to treat it as a hook.
- `cartStore` names a vanilla store, the object that `createStore` returns.
- Selector functions that a module exports start with `select`, as in `selectItemCount`.

When a listing prints output, a `text` block follows the listing and contains exactly what the run printed:

```ts
import { createStore } from 'zustand/vanilla'

type CartItem = { sku: string; name: string; unitPrice: number; quantity: number }
type CartState = { items: Record<string, CartItem> }

const cartStore = createStore<CartState>()(() => ({
  items: {
    'TEA-01': { sku: 'TEA-01', name: 'Sencha tea', unitPrice: 1250, quantity: 2 },
  },
}))

const tea = cartStore.getState().items['TEA-01']
console.log(tea.name, tea.unitPrice * tea.quantity)
```

```text
Sencha tea 2500
```

Callouts have fixed meanings:

| Callout | Meaning |
|---|---|
| Note | Context that helps you understand a behavior but does not change what you do |
| Important | A condition that a procedure or design needs in order to work correctly |
| Warning | An action that can lose data, corrupt state, or break rendering, with the safer alternative |

"Hydration" by itself means the persist middleware reading stored state into a store; the React meaning is written "React hydration". The [Glossary](#glossary) defines the other terms the book uses with a fixed meaning.
