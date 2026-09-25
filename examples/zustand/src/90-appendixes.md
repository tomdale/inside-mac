# Glossary {.appendix}

**action**
: A function that calls `set` to change a store's state. Zustand has no separate dispatch layer;
  actions are ordinary functions, usually defined alongside the state they change. Compare
  **dispatch**, the `redux` middleware's action-object variant.

**dispatch**
: A function, added by the `redux` middleware, that takes an action object and runs it through a
  reducer before calling `set`. See Chapter 4.

**equality function**
: A function `(a, b) => boolean` used in place of the default `Object.is` comparison to decide
  whether a selector's result has changed. See **selector**, `useShallow`, and
  `createWithEqualityFn` in Chapter 3.

**hydration**
: The process by which the `persist` middleware reads previously stored state and merges it into
  a store, either synchronously (for storage like `localStorage`) or asynchronously (for storage
  like `AsyncStorage`). See Chapter 4.

**listener**
: A function registered with `subscribe` that runs after every state-changing `setState` call.
  React's store hook registers a listener internally; you can also register your own. See
  Chapter 2.

**merge (of state)**
: The default behavior of `setState`: a one-level-deep `Object.assign` of the next value onto the
  current state. Compare **replace**.

**middleware**
: A function that wraps a state creator and returns another state creator, optionally changing
  what `set`, `get`, or `store` expose. See Chapter 4.

**mutator identifier**
: A string, such as `'zustand/persist'`, that names a middleware's type-level effect in the
  `StoreMutators` interface, letting `StateCreator` compute the correct types for a composed
  middleware stack. See Chapter 5. Compare **middleware**, which is the runtime concept this
  identifier describes at the type level.

**replace**
: The behavior requested by passing `true` as `setState`'s second argument: the next value
  becomes the entire state, discarding any keys the previous state had that the next value does
  not. Compare **merge**.

**selector**
: A function `(state) => slice` passed to a store hook to read part of the state. The store hook
  re-renders the calling component only when the selector's result changes, by default compared
  with `Object.is`. See Chapter 1 and Chapter 3.

**slice**
: A portion of a larger store's state and actions, typically defined in its own function and
  combined with other slices inside one `create` call. Not a separate store or a separate `set`.
  See Chapter 5 and Chapter 6.

**state creator**
: The function passed to `create`, `createStore`, or any middleware; receives `set`, `get`, and
  `store`, and returns the initial state. See Chapter 2.

**store**
: An object exposing `getState`, `setState`, `getInitialState`, and `subscribe` over one piece of
  state. A store created with `create` is also a React hook. See Chapter 2.

**transient update**
: A state change read through `subscribe` directly, rather than through a store hook selector, so
  that reading it does not cause a React re-render. See Chapter 6.

# API Summary {.appendix}

Grouped by where each name is defined. See the linked chapter for the full contract.

## `zustand`

| Name | Kind | Chapter |
|---|---|---|
| `create` | function | 3 |
| `createStore` | function | 2 |
| `useStore` | hook | 3 |
| `StateCreator` | type | 5 |
| `StoreApi` | type | 2 |
| `StoreMutators` | type | 5 |
| `StoreMutatorIdentifier` | type | 5 |
| `Mutate` | type | 5 |
| `ExtractState` | type | 5 |

## `zustand/react/shallow`

| Name | Kind | Chapter |
|---|---|---|
| `useShallow` | hook | 3 |

## `zustand/shallow`

| Name | Kind | Chapter |
|---|---|---|
| `shallow` | function | 3 |

## `zustand/traditional`

| Name | Kind | Chapter |
|---|---|---|
| `createWithEqualityFn` | function | 3 |
| `useStoreWithEqualityFn` | hook | 3 |

## `zustand/middleware`

| Name | Kind | Chapter |
|---|---|---|
| `persist` | middleware | 4 |
| `createJSONStorage` | function | 4 |
| `devtools` | middleware | 4 |
| `subscribeWithSelector` | middleware | 4 |
| `combine` | middleware | 4 |
| `redux` | middleware | 4 |

## `zustand/middleware/immer`

| Name | Kind | Chapter |
|---|---|---|
| `immer` | middleware | 4 |

# Known Gaps and Pitfalls {.appendix}

| Pitfall | Consequence | Fix |
|---|---|---|
| Mutating state directly instead of calling `set` | No listener runs; components never re-render, even though the underlying object changed. | Always produce a new value (or draft-mutate through `immer`) and pass it to `set`. |
| A selector that builds a new object or array on every call | The component re-renders on every store update, or — since v5 — can throw `Maximum update depth exceeded` if the new reference feeds back into another update. | Split into one selector per value, or wrap a multi-value selector in `useShallow`. |
| `setState(partial, true)` with an incomplete object | Silently deletes every key the replacement object omits, including actions. | Only pass `true` with a complete state object, typically from `getInitialState()`. |
| Reading `get()` or `store.getInitialState()` inside the state creator function itself | `get()` returns `undefined`; `getInitialState()` throws, because initialization has not finished. | Do only the minimum work in the creator; read state from the actions it returns instead. |
| Applying middleware inside an individual slice instead of around the combined store | That slice's `set` diverges from the rest of the store's `set`, breaking assumptions other slices and components make. | Apply middleware once, around the `create` call that combines every slice. |
| Assuming synchronous hydration timing with `persist` and an asynchronous storage engine | The first render reflects the creator's default state, not the persisted value, because hydration finishes later in a microtask. | Check `persist.hasHydrated()` or use `onRehydrateStorage` before relying on persisted values at first render. |
| Nesting `devtools` inside another `set`-wrapping middleware | Action names and payloads shown in the extension no longer match what actually ran. | Apply `devtools` as the outermost middleware in the composition. |

> [!NOTE]
> This guide covers Zustand 5.0.15. The experimental `unstable_ssrSafe` middleware
> (`zustand/middleware/ssrSafe`), which throws on server-side `setState` calls, is deliberately
> out of scope: its own source marks it experimental and subject to change before the project
> finalizes its design.
