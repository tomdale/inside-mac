# Testing and Patterns

This chapter is short by design: it collects the patterns you need once a Zustand store is no
longer a toy — resetting state between tests, splitting a large store into slices, and reading
state without triggering a React re-render.

## Read this chapter if

- Your tests see state left over from a previous test.
- One store file has grown past a few hundred lines and mixes unrelated concerns.
- You need to read fast-changing state (mouse position, scroll offset, WebSocket ticks) without
  re-rendering a component on every change.

## In this chapter you will

- reset one store, or every store in an app, between test runs;
- split a store into slices without changing how components read it;
- subscribe to a store from inside a component without causing that component to re-render.

## Resetting stores between tests

Chapter 2 introduced the single-store reset: `set(store.getInitialState(), true)`. For a whole test
suite, wrap `create` itself so every store it produces registers a reset function, then reset all
of them in an `afterEach`:

```ts
// test-setup.ts
import { act } from '@testing-library/react'
import { create as actualCreate } from 'zustand'
import type { StateCreator } from 'zustand'

export const storeResetFns = new Set<() => void>()

export const create = (<T>(stateCreator: StateCreator<T>) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}) as typeof actualCreate

afterEach(() => {
  act(() => {
    storeResetFns.forEach((reset) => reset())
  })
})
```

Import `create` from this file instead of `zustand` in application code that a test suite exercises
(a module alias or a test-runner mock, such as Jest's `__mocks__/zustand.ts` or Vitest's `vi.mock`,
applies this substitution without changing import paths). Every store created with the wrapped
`create` resets to its exact initial state — including nested objects and unchanged actions —
after each test, so tests do not leak state into one another regardless of execution order.

> [!IMPORTANT]
> Wrap `afterEach`'s reset calls in `act(...)` when any reset triggers a React state update in a
> currently-mounted test component; otherwise React logs an "update not wrapped in act" warning.

## Testing components that use a store

Prefer asserting through the rendered UI, with React Testing Library, over reaching into a store's
internal state:

```tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './counter'

test('increments the visible count when clicked', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  expect(await screen.findByText('1')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /one up/i }))
  expect(await screen.findByText('2')).toBeInTheDocument()
})
```

When a test needs to assert on state a component does not render directly — a value only used to
decide whether to make a network call, for example — read it with `useCounterStore.getState()`
rather than adding a visible element solely to make the value assertable.

## Slices for a large store

Split a store's concerns into separate functions, each with the same `(set, get, store) => ({...})`
signature as a full state creator, and spread their results together in one `create` call:

```ts
// bear-slice.ts
import type { StateCreator } from 'zustand'

export interface BearSlice {
  bears: number
  addBear: () => void
}

export const createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
})
```

```ts
// fish-slice.ts
import type { StateCreator } from 'zustand'
import type { BearSlice } from './bear-slice'

export interface FishSlice {
  fishes: number
  addFish: () => void
}

export const createFishSlice: StateCreator<BearSlice & FishSlice, [], [], FishSlice> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})
```

```ts
// store.ts
import { create } from 'zustand'
import { createBearSlice, type BearSlice } from './bear-slice'
import { createFishSlice, type FishSlice } from './fish-slice'

export const useBoundStore = create<BearSlice & FishSlice>()((...args) => ({
  ...createBearSlice(...args),
  ...createFishSlice(...args),
}))
```

Components import `useBoundStore` and select from it exactly as they would from a single-file
store — slicing is a source-organization pattern, not a runtime concept; there is one store, one
`set`, and one set of subscribers, regardless of how many files contributed to its shape.

> [!WARNING]
> Apply middleware only around the combined store in `store.ts`, not inside individual slice
> files. Wrapping one slice in `persist` or `devtools` gives that slice a `set` the other slices
> do not share, which silently breaks the assumption that every slice's actions operate on the
> same store.

A slice that needs to call another slice's action reads it through `get()`, the same way any
action reads store state:

```ts
export const createBearFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  { addBearAndFish: () => void }
> = (set, get) => ({
  addBearAndFish: () => {
    get().addBear()
    get().addFish()
  },
})
```

## Transient updates without re-rendering

Some state changes too often to justify a React re-render on every update — a live cursor
position, a scroll offset, an incoming metric. Read the store directly in an event handler or
effect, and write to the DOM yourself, instead of selecting the value with the store hook:

```tsx
function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return usePositionStore.subscribe((state) => {
      const dot = dotRef.current
      if (dot) dot.style.transform = `translate(${state.x}px, ${state.y}px)`
    })
  }, [])

  return <div ref={dotRef} className="cursor-dot" />
}
```

`subscribe` (Chapter 2) runs the listener on every state-changing `setState`, entirely outside
React's render cycle — there is no selector comparison, no re-render, and no component output to
reconcile. This trades React's declarative rendering for direct DOM writes; use it only for state
that genuinely updates too fast for per-frame re-renders to be worthwhile, and prefer the ordinary
selector-based hook for everything else.

## Summary

### Mental model

Testing and scaling a Zustand store both come back to the same primitives from Chapter 2:
`getInitialState`, `setState`, and `subscribe`. Resetting is `setState` with the initial state;
slicing is source organization around one `set`; transient updates are `subscribe` used directly,
bypassing the React hook.

### Common path

1. Wrap `create` in test setup to collect reset functions; reset all stores in `afterEach`.
2. Assert through rendered UI first; fall back to `getState()` only for values the UI doesn't show.
3. Split a growing store into slice files that share one `StateCreator` type parameter and one
   `create` call.
4. Use `subscribe` directly, writing to the DOM by hand, for state that changes faster than a
   re-render is worth.

### Invariants

- **Must** apply middleware around the combined store, never inside an individual slice.
- **Should** reset stores between tests rather than relying on test execution order to avoid state
  leakage.
- **Never** use `subscribe`-driven direct DOM writes as a substitute for ordinary selectors when a
  normal re-render rate is acceptable — it forfeits React's reconciliation for no benefit there.

### Continue

- Appendix A defines every term this guide used as jargon; Appendix B indexes every function,
  hook, and type by name; Appendix C lists the pitfalls this guide called out, in one place.
