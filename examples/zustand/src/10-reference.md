# Zustand Reference

This chapter specifies the public contract of Zustand 5.0.16 for lookup, with one entry for each function and type you call or configure. The `persist` middleware is specified in [Persist reference](#persist-reference) in Chapter 7. Core declarations follow the [Zustand source](https://github.com/pmndrs/zustand/tree/main/src). Middleware signatures omit the mutator type parameters ([How middleware changes the store type](#how-middleware-changes-the-store-type)).

## Roadmap

### Read this chapter if

You need the exact behavior of a Zustand function or type.

### Before you begin

Read [Stores and State Updates](#stores-and-state-updates). The entries use its terms and link to its sections instead of repeating them.

### In this chapter you will

- find which entry point exports a name, in [Entry points](#entry-points), the book's interface summary;
- look up the core store, the React bindings, the equality helpers, and the middleware.

### You can skip

Everything you are not looking up.

## Entry points

The packages in the last column are optional peer dependencies, so install one only if you import an entry point that needs it. [Requirements](#requirements) gives their minimum versions. Every export is named; there are no default exports.

| Entry point | Exports | Needs |
|---|---|---|
| `zustand` | Everything in `zustand/vanilla` and `zustand/react` | `react` |
| `zustand/vanilla` | [`createStore`](#createstore), [`StoreApi`](#storeapi), [`StateCreator`](#statecreator), [`ExtractState`](#usestore); `Mutate`, `StoreMutators`, and `StoreMutatorIdentifier` ([store types](#how-middleware-changes-the-store-type)) | Nothing |
| `zustand/react` | [`create`](#create), [`UseBoundStore`](#create), [`useStore`](#usestore) | `react` |
| `zustand/middleware` | [`devtools`, `DevtoolsOptions`, `NamedSet`](#devtools); [`subscribeWithSelector`](#subscribewithselector); [`combine`](#combine); [`redux`](#redux); [`persist`](#persist), [`PersistOptions`](#persistoptions), [`createJSONStorage`](#createjsonstorage), [`StateStorage`, `PersistStorage`](#statestorage-and-persiststorage), [`StorageValue`](#storagevalue); [`unstable_ssrSafe`](#experimental-and-unstable-apis) | Nothing |
| `zustand/middleware/immer` | [`immer`](#immer) | `immer` |
| `zustand/shallow` | [`shallow`](#shallow), [`useShallow`](#useshallow) | `react`, even if you use only `shallow` |
| `zustand/vanilla/shallow` | [`shallow`](#shallow) | Nothing |
| `zustand/react/shallow` | [`useShallow`](#useshallow) | `react` |
| `zustand/traditional` | [`createWithEqualityFn`, `UseBoundStoreWithEqualityFn`](#createwithequalityfn), [`useStoreWithEqualityFn`](#usestorewithequalityfn) | `react`, `use-sync-external-store` |

The entry points that need nothing import nothing from React and run in any JavaScript runtime.

## Shared rules

These rules hold for every entry in this chapter.

- Everything is synchronous except `persist` hydration and writes when the storage or `migrate` returns a promise.
- Zustand keeps your values by reference and never clones or freezes them, so you must create a new object for each level you change ([Immutability rules](#immutability-rules)).
- Selectors, equality functions, and listeners can run on every update and every render. They must be pure, because React can call a selector several times per render, and they should be cheap, because their cost adds to every update.
- The core store throws no errors of its own and catches none of yours ([Store invariants](#store-invariants)).
- The React APIs are hooks built on `useSyncExternalStore`, so they need React 18 or later.

## `createStore()`

Creates a vanilla store from a state creator and returns the store API.

```ts
type CreateStore = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ): Mutate<StoreApi<T>, Mos>

  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ) => Mutate<StoreApi<T>, Mos>
}
```

### Returns

A [`StoreApi<T>`](#storeapi) with any members that middleware adds. The curried form, `createStore<T>()(initializer)`, lets you write `T` while TypeScript infers the middleware's mutators ([Why `create` is curried in TypeScript](#why-create-is-curried-in-typescript)).

### Behavior

Calls `initializer(setState, getState, api)` once, synchronously, and stores its return value as both the current state and the initial state. A store lives as long as something references it.

### See also

[How a store is created](#how-a-store-is-created) and [Define a store with state and actions](#define-a-store-with-state-and-actions).

## `StoreApi`

The four methods that every store exposes and that a bound hook carries.

```ts
// Simplified; the full declaration is in src/vanilla.ts.
export interface StoreApi<T> {
  setState: {
    (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false): void
    (state: T | ((state: T) => T), replace: true): void
  }
  getState: () => T
  getInitialState: () => T
  subscribe: (listener: (state: T, prevState: T) => void) => () => void
}
```

### Members

| Member | Behavior |
|---|---|
| `getState()` | Returns the current state. |
| `setState(partial)` | Merges a partial state, or an updater's result, one level deep ([How setState computes the next state](#how-setstate-computes-the-next-state)). |
| `setState(state, true)` | Replaces the state with a complete `T`, removing omitted fields, including actions. |
| `subscribe(listener)` | Calls `listener(state, prevState)` after each change and returns an unsubscribe function ([How listeners are notified](#how-listeners-are-notified)). |
| `getInitialState()` | Returns the state the state creator returned, which React uses as the server snapshot. |

The [full declaration](https://github.com/pmndrs/zustand/blob/main/src/vanilla.ts) expresses the two `setState` forms with an internal helper type. The methods do not use `this`, so you can destructure them. Middleware can replace `setState` and `subscribe` and add members.

## `StateCreator`

The type of the function that a store or a middleware calls once to produce state.

```ts
export type StateCreator<
  T,
  Mis extends [StoreMutatorIdentifier, unknown][] = [],
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
> = ((
  setState: Get<Mutate<StoreApi<T>, Mis>, 'setState', never>,
  getState: Get<Mutate<StoreApi<T>, Mis>, 'getState', never>,
  store: Mutate<StoreApi<T>, Mis>,
) => U) & { $$storeMutators?: Mos }
```

### Type parameters

| Name | Meaning |
|---|---|
| `T` | The full state type of the store. |
| `Mis` | Mutators from middleware outside this creator, which type its arguments. |
| `Mos` | Mutators this creator applies, which determine the store's type. |
| `U` | The returned type. A slice's `U` is narrower than `T`. |

The function must return synchronously, because a returned promise becomes the state itself.

### See also

[Split a large store into slices](#split-a-large-store-into-slices) and [Write your own middleware](#write-your-own-middleware).

## `create()`

Creates a store and returns a bound hook: a React hook that reads the store, with the store API attached.

```ts
export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>
  <U>(selector: (state: ExtractState<S>) => U): U
} & S
```

### Parameters

The same as [`createStore()`](#createstore), in the same direct and curried forms.

### Behavior

Calls `createStore(initializer)` and copies the API's members onto the hook, so `useCartStore.getState()` works outside components. A hook call is [`useStore()`](#usestore) with the store applied. The hook takes no equality function, so use [`useShallow()`](#useshallow) or [`createWithEqualityFn()`](#createwithequalityfn) instead. A module-scope hook is one store shared by every component, test, and server request ([Module stores and scoped stores](#module-stores-and-scoped-stores)).

### See also

[How a component subscribes to a store](#how-a-component-subscribes-to-a-store) and [Read a value in a component](#read-a-value-in-a-component).

## `useStore()`

Reads a store in a React component and re-renders the component when the selected value changes.

```ts
export function useStore<S extends ReadonlyStoreApi<unknown>>(
  api: S,
): ExtractState<S>

export function useStore<S extends ReadonlyStoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
): U

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never
```

`ReadonlyStoreApi<T>` is `StoreApi<T>` without `setState`, so `api` can be a vanilla store or a bound hook. The default `selector` returns the whole state.

### Behavior

Subscribes through `useSyncExternalStore`, using `getInitialState()` for the server snapshot, and re-renders when the selected value differs under `Object.is` ([When a component re-renders](#when-a-component-re-renders)).

### Errors

A selector that returns a new object, array, or function on every call makes React warn that the snapshot should be cached, and can end in "Maximum update depth exceeded" ([Selectors must return stable values](#selectors-must-return-stable-values)).

### See also

[Use a vanilla store in React](#use-a-vanilla-store-in-react) and [Scope a store to a component tree](#scope-a-store-to-a-component-tree).

## `useShallow()`

Wraps a selector so that it keeps returning its previous result while each new result is shallowly equal to it.

```ts
export function useShallow<S, U>(selector: (state: S) => U): (state: S) => U
```

### Behavior

Each call of the returned selector runs `selector` and compares the result with the previous one using [`shallow()`](#shallow). If they are equal, it returns the previous result, so the reference does not change. It keeps the previous result in a React ref, so it is a hook: call it inline, as in `useCartStore(useShallow((s) => …))`.

### See also

[Shallow comparison with `useShallow`](#shallow-comparison-with-useshallow) and [Select several values](#select-several-values).

## `shallow()`

Compares two values one level deep and returns the result of the first rule that applies.

```ts
export function shallow<T>(valueA: T, valueB: T): boolean
```

| Rule | Result |
|---|---|
| `Object.is(valueA, valueB)` | `true` |
| Either value is `null` or not an object | `false` |
| The prototypes differ | `false` |
| Both are iterable and have an `entries` member, such as arrays, `Map`, and `Set` | `true` if both have the same keys with `Object.is`-equal values |
| Both are iterables without `entries` | `true` if their values are `Object.is`-equal position by position |
| Otherwise | `true` if both have the same own enumerable keys with `Object.is`-equal values |

Nested objects compare by reference. [Shallow comparison with `useShallow`](#shallow-comparison-with-useshallow) shows example pairs and their results.

## `createWithEqualityFn()`

Creates a store and returns a bound hook whose calls accept an equality function, with an optional default for the store.

```ts
createWithEqualityFn(initializer, defaultEqualityFn?: <U>(a: U, b: U) => boolean)
useBoundStore(selector, equalityFn?: (a: U, b: U) => boolean)
```

### Behavior

Takes the same forms as [`create()`](#create) and returns a `UseBoundStoreWithEqualityFn`. Each hook call is [`useStoreWithEqualityFn()`](#usestorewithequalityfn) with the per-call equality function, or else `defaultEqualityFn`, or else `Object.is`.

### Errors

Importing `zustand/traditional` fails if `use-sync-external-store` is not installed.

### See also

[Custom equality with `zustand/traditional`](#custom-equality-with-zustand-traditional) and [Changes from Zustand 4](#changes-from-zustand-4).

## `useStoreWithEqualityFn()`

Reads a store in a React component and re-renders only when an equality function reports that the selected value changed.

```ts
export function useStoreWithEqualityFn<S extends ReadonlyStoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  equalityFn?: (a: U, b: U) => boolean,
): U
```

A second overload takes only `api` and returns the whole state. The default `equalityFn` is `Object.is`.

### Behavior

Subscribes with `useSyncExternalStoreWithSelector` from `use-sync-external-store`. While `equalityFn(previous, next)` returns `true`, the hook returns the previous selected value and the component does not re-render.

## `devtools()`

Connects a store to the Redux DevTools browser extension, which records each update as an action.

```ts
devtools(initializer: StateCreator<T>, devtoolsOptions?: DevtoolsOptions)

export interface DevtoolsOptions extends Config {
  name?: string
  enabled?: boolean
  anonymousActionType?: string
  store?: string
}
```

### Parameters

| Option | Default | Description |
|---|---|---|
| `name` | none | The instance name the extension shows. |
| `enabled` | `true` outside production builds | `false` makes `devtools` a pass-through. The ES module build stays enabled if `import.meta.env` is undefined, so pass `enabled` when your bundler does not define it. |
| `anonymousActionType` | inferred from the stack | The action type for an update that names no action. |
| `store` | none | Shares one connection among stores with the same `name`. |

Other fields are the extension's [connection options](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md).

### Behavior

When the extension is present and `enabled` holds, `devtools` replaces `setState` with one that takes a third argument, `action` (a string or an object with a `type`), and adds `store.devtools.cleanup()`. Otherwise it is a pass-through that adds no `store.devtools` ([Inspect a store with Redux DevTools](#inspect-a-store-with-redux-devtools)).

Apply `devtools` outermost, because it records only updates that pass through its wrapper; a layer outside it, such as `persist` during hydration, updates the store unrecorded ([How middleware composes](#how-middleware-composes)). `devtools` throws nothing of its own.

## `immer()`

Lets function updaters produce the next state by mutating an Immer draft. Import it from `zustand/middleware/immer`, which requires the `immer` package.

```ts
immer(initializer: StateCreator<T>): StateCreator<T>
```

### Behavior

Replaces `setState` so that a function updater runs through Immer's `produce` with a draft of the current state; mutate the draft and return nothing, or return a complete replacement. Other arguments pass through unchanged. An updater that changes nothing returns the same state object, so the store does not notify.

### Errors

Errors from Immer propagate out of `setState`, and the state is unchanged. An updater that both modifies the draft and returns a value throws ([Write updates as mutations with Immer](#write-updates-as-mutations-with-immer)), and so does reading or modifying a `Map` or `Set` field of the draft before you call Immer's `enableMapSet()`.

### See also

[Write updates as mutations with Immer](#write-updates-as-mutations-with-immer).

## `subscribeWithSelector()`

Extends `subscribe` so that a listener can watch one selected value and run only when it changes.

```ts
subscribeWithSelector(initializer: StateCreator<T>): StateCreator<T>

// Added overload of store.subscribe:
subscribe<U>(
  selector: (state: T) => U,
  listener: (selectedState: U, previousSelectedState: U) => void,
  options?: {
    equalityFn?: (a: U, b: U) => boolean
    fireImmediately?: boolean
  },
): () => void
```

### Behavior

The selector form calls the listener only when `equalityFn(lastDelivered, next)` returns `false`; the default is `Object.is`, and [`shallow`](#shallow) suits objects and arrays. With `fireImmediately: true` it calls `listener(current, current)` before `subscribe` returns. The one-argument form is the original `subscribe`, so React hooks behave as before.

### See also

[Subscribe to part of the state](#subscribe-to-part-of-the-state).

## `combine()`

Builds a state creator from an initial data object and a creator for the remaining fields, and infers the state type from both.

```ts
combine(initialState: T, create: StateCreator<T, [], [], U>): StateCreator</* T merged with U */>
```

### Returns

The state creator for `T` merged with `U`, where a field of `U` wins over a field of `T` with the same name.

### Behavior

Calls `create` with the store's arguments, typed by `T` only, and returns `Object.assign({}, initialState, result)`. Nested objects in `initialState` are shared by reference, including between stores created from one `combine` call, so they must not be mutated. The state type comes from the initial values, so widen any field whose type is wider than its initial value ([Infer the state type with combine](#infer-the-state-type-with-combine)).

### See also

[Infer the state type with combine](#infer-the-state-type-with-combine).

## `redux()`

Builds a state creator that updates the state with a reducer, and adds `dispatch` to the state and to the store API.

```ts
redux(reducer: (state: T, action: A) => T, initialState: T): StateCreator<T & { dispatch }>
```

### Behavior

`dispatch(action)`, on the store and on the state, calls `set((state) => reducer(state, action), false, action)` and returns `action`. The result is merged, so `dispatch` survives a reducer that returns only data fields. Under `devtools(redux(…))`, each action is recorded under its `type`. A reducer exception propagates out of `dispatch` and leaves the state unchanged.

### Example

```ts
import { createStore } from 'zustand/vanilla'
import { redux } from 'zustand/middleware'

type Counts = { counts: Record<string, number> }
type CartAction = { type: 'cart/add'; sku: string } | { type: 'cart/clear' }

const initialCounts: Counts = { counts: {} }

function cartReducer(state: Counts, action: CartAction): Counts {
  switch (action.type) {
    case 'cart/add':
      return { counts: { ...state.counts, [action.sku]: (state.counts[action.sku] ?? 0) + 1 } }
    case 'cart/clear':
      return initialCounts
  }
}

const cartStore = createStore(redux(cartReducer, initialCounts))
cartStore.dispatch({ type: 'cart/add', sku: 'TEA-01' })
cartStore.dispatch({ type: 'cart/clear' })
console.log(Object.keys(cartStore.getState()))
```

```text
[ 'dispatch', 'counts' ]
```

`dispatch` survives `cart/clear` because the reducer's result is merged.
