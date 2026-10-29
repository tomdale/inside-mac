# Compatibility and Migration {.appendix}

This appendix gives the requirements of Zustand 5.0.16 and the changes from Zustand 4 that require code edits.

## Requirements

Zustand's four peer dependencies are all optional, so a package manager does not install them. Install each one that your code needs, because an entry point whose peer is missing fails to load. [Entry points](#entry-points) shows which entry point needs which peer.

| Package | Minimum version |
|---|---|
| `react` | 18.0.0 |
| `@types/react` | 18.0.0 |
| `use-sync-external-store` | 1.2.0 |
| `immer` | 9.0.6 |

Zustand's types require TypeScript 4.5 or later.

Each entry point ships an ES module build and a CommonJS build, and the package's `exports` map selects one for `import` or `require` without configuration. The map also has a `react-native` condition, which this book does not cover. `zustand/vanilla` and `zustand/middleware` do not import React, so stores built from them run in any JavaScript runtime.

## Changes from Zustand 4

Each change below requires edits to code written for Zustand 4. [Zustand's migration guide](https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5) covers the rest.

- There are no default exports. Replace `import create from 'zustand'` with `import { create } from 'zustand'`.
- The bound hook and `useStore` accept no equality function. TypeScript rejects one, but at run time Zustand ignores it without a warning. Wrap the selector with [`useShallow`](#shallow-comparison-with-useshallow), or switch to [`zustand/traditional`](#custom-equality-with-zustand-traditional).
- Selectors must return stable values. Zustand 4 cached selected values, so a selector that built a new object on each call still worked. In Zustand 5 it can fail with "Maximum update depth exceeded" ([Selectors must return stable values](#selectors-must-return-stable-values)).
- Under TypeScript, `setState(next, true)` requires `next` to be a complete state, including actions ([How setState computes the next state](#how-setstate-computes-the-next-state)).
- `persist` no longer writes to storage when the store is created, only at the first update ([About persistence](#about-persistence)). If your code expects the initial state in storage, call `store.setState(store.getState())` once hydration has finished, for example in a `store.persist.onFinishHydration` listener or after `await store.persist.rehydrate()`. With synchronous storage, calling it right after creation is safe. With asynchronous storage, an earlier call writes the defaults over the saved state before hydration reads it ([Wait for hydration with asynchronous storage](#wait-for-hydration-with-asynchronous-storage)).
- `use-sync-external-store` is now an optional peer dependency, so a project that imports `zustand/traditional` must add it. The React floor rose from 16.8 to 18 ([Requirements](#requirements)).

## Experimental and unstable APIs

The book documents no export with the `unstable_` prefix, which Zustand uses to mark experimental APIs. In Zustand 5.0.16 the only one is `unstable_ssrSafe` in `zustand/middleware`. If you use it, pin the exact Zustand version, because an upgrade can change or remove it.
