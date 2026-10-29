# Using Middleware

This chapter builds the cart on a typical middleware stack, then covers each bundled middleware except `persist`, which has its own chapter, and `redux`, whose [`redux()`](#redux) entry carries an example.

## Roadmap

### Read this chapter if

You want DevTools debugging, mutation-style updates, or listeners on one value.

### Before you begin

Read [How middleware composes](#how-middleware-composes), and install the `immer` package.

### In this chapter you will

- build the cart with `devtools`, `persist`, and `immer`;
- name updates in the Redux DevTools and write them against an Immer draft;
- run a listener only when one value changes.

### You can skip

[Write your own middleware](#write-your-own-middleware), unless you write middleware.

## Compose a middleware stack

This module cart uses `immer` for drafts, `persist` for saving, and `devtools` outermost for named actions:

```ts
// stack-cart.ts
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type CartItem = { sku: string; name: string; unitPrice: number; quantity: number }
type CartState = {
  items: Record<string, CartItem> // keyed by sku; prices in integer cents
  addItem: (item: Omit<CartItem, 'quantity'>) => void
}

const memory = new Map<string, string>() // in a browser, omit `storage`
const storage = createJSONStorage(() => ({
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => void memory.set(key, value),
  removeItem: (key) => void memory.delete(key),
}))

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      immer((set) => ({
        items: {},
        addItem: (item) =>
          set(
            (draft) => {
              const line = draft.items[item.sku]
              if (line) line.quantity += 1
              else draft.items[item.sku] = { ...item, quantity: 1 }
            },
            undefined,
            { type: 'cart/addItem', sku: item.sku }, // the DevTools action
          ),
      })),
      { name: 'cart', storage },
    ),
    { name: 'cart' },
  ),
)

useCartStore.getState().addItem({ sku: 'TEA-01', name: 'Sencha tea', unitPrice: 1250 })
console.log(memory.get('cart'))
console.log(useCartStore.persist.hasHydrated(), useCartStore.devtools)
```

```text
{"state":{"items":{"TEA-01":{"sku":"TEA-01","name":"Sencha tea","unitPrice":1250,"quantity":1}}},"version":0}
true undefined
```

Write the stack inline inside `create<CartState>()(…)`, because TypeScript infers each layer's mutator there; that is why `set` accepts a draft and a name, and why `useCartStore.persist` is typed.

## Inspect a store with Redux DevTools

The `devtools` middleware sends the initial state and each update to the Redux DevTools extension. Name an update with the third argument to `set` or `setState`: a string, or an object whose `type` names the action and whose other fields appear as the payload, as in the stack above. An unnamed update appears as `anonymous` or an inferred function name.

Without the extension, as in Node, `devtools` is a pass-through and adds no `store.devtools`, which is why the listing printed `undefined`. The type declares the member anyway, so call `store.devtools?.cleanup()` when you discard a store; without optional chaining the call throws a `TypeError`. A jump or reset in the extension replaces the state and notifies listeners without recording an entry. The [`devtools()`](#devtools) entry covers the other options.

## Write updates as mutations with Immer

The `immer` middleware, from `zustand/middleware/immer`, passes function updaters a draft, as `addItem` uses above. Immer builds the next state with new objects only along the changed paths, so the result follows the [Immutability rules](#immutability-rules). Unchanged lines keep their identity, so components that select them do not re-render.

A draft updater must either change the draft or return a replacement. Doing both throws "An immer producer returned a new value *and* modified its draft" and leaves the state unchanged. An expression-bodied arrow such as `(draft) => (draft.coupon = code)` returns the assigned value, and TypeScript does not catch it, so give draft updaters a block body. `Map` and `Set` fields need Immer's `enableMapSet()` ([`immer()`](#immer)).

## Subscribe to part of the state

The `subscribeWithSelector` middleware adds `subscribe(selector, listener, options)`, which calls the listener with the new and previous selected values only when the selected value changes:

```ts
// subscribe-cart.ts
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

type Quantities = { quantities: Record<string, number> }
const cartStore = createStore<Quantities>()(
  subscribeWithSelector((): Quantities => ({ quantities: {} })),
)

cartStore.subscribe(
  (state) => Object.keys(state.quantities),
  (skus, previous) => console.log(previous, '->', skus),
  { equalityFn: shallow },
)

cartStore.setState({ quantities: { 'TEA-01': 1 } })
cartStore.setState({ quantities: { 'TEA-01': 2 } }) // same skus: no output
```

The script prints `[] -> [ 'TEA-01' ]` once. The selector builds a new array on each call, so it passes `shallow` as `equalityFn`; under the default `Object.is`, the listener would run after every update. See [`subscribeWithSelector()`](#subscribewithselector) for `fireImmediately`.

## Infer the state type with combine

`combine(initialState, creator)` merges the initial object with the object `creator` returns and infers the state type from both, so `createStore(combine({ coupon: null as string | null }, (set) => ({ … })))` needs no type argument. Widen initial values as that cast does; without it, `coupon` has type `null`. Because `get()` inside `creator` knows only the initial object's type, declare the type and use `create<T>()(…)` when actions call each other. See [`combine()`](#combine).

## Write your own middleware

**If you write middleware.** Read [How middleware changes the store type](#how-middleware-changes-the-store-type) first.

A middleware that wraps updates must replace both the `set` it passes to the inner creator and `store.setState`, so that all updates take one path. The wrapper must forward every argument, which carries action names to `devtools`, and return the wrapped result, which carries the promise `persist` returns for asynchronous storage.

The public type of a middleware is written in terms of two mutator lists, named as Zustand's own middleware names them. `Mps` (parent mutators) is the list applied by middleware outside yours; it becomes the `Mis` of the creator you return. `Mcs` (child mutators) is the list the wrapped creator applies; it is that creator's `Mos`. Type a middleware in three steps:

1. Declare a public type, generic in `T`, `Mps`, and `Mcs`, that accepts a `StateCreator<T, Mps, Mcs>` and returns one. Passing both lists through unchanged keeps the types that middleware above and below yours add, such as the draft `set` from `immer`.
2. Implement the middleware against `StateCreator<T, [], []>`. Inside a function generic in `Mps`, TypeScript cannot resolve the mutated types of `set` and `store`, so calls to them do not type-check. The plain store types are callable, and they are all the implementation needs.
3. Cast the implementation to the public type once. TypeScript cannot relate the two creator types without it, and the cast is safe as long as the implementation forwards `set` arguments and reads only `StoreApi` members.

This logging middleware follows those steps and wraps an `immer` layer:

```ts
// logger.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { StateCreator, StoreMutatorIdentifier } from 'zustand/vanilla'

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  creator: StateCreator<T, Mps, Mcs>,
  label: string,
) => StateCreator<T, Mps, Mcs>

const loggerImpl = <T>(
  creator: StateCreator<T, [], []>,
  label: string,
): StateCreator<T, [], []> => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    const result = set(...(args as Parameters<typeof set>)) // forward everything
    console.log(`[${label}]`, JSON.stringify(get()))
    return result
  }
  store.setState = loggedSet // log updates made outside actions too
  return creator(loggedSet, get, store)
}

export const logger = loggerImpl as Logger

type CartState = {
  quantities: Record<string, number>
  add: (sku: string) => void
}

const useCartStore = create<CartState>()(
  logger(
    immer((set) => ({
      quantities: {},
      add: (sku) =>
        set((draft) => {
          draft.quantities[sku] = (draft.quantities[sku] ?? 0) + 1
        }),
    })),
    'cart',
  ),
)

useCartStore.getState().add('TEA-01')
useCartStore.setState({ quantities: {} })
```

```text
[cart] {"quantities":{"TEA-01":1}}
[cart] {"quantities":{}}
```

Because `Mcs` carries `immer`'s mutator through `logger`, `useCartStore.setState` also accepts a draft updater; a `Logger` type that returned `StateCreator<T, Mps, []>` would drop it. The second line comes from `setState`, which `logger` replaced.

A middleware that adds a store member must also declare a mutator, so that the store type gains the member. Augment `StoreMutators` in `zustand/vanilla` with an identifier that maps the store type `S` to the changed type; prefix the identifier with your package name, because every declaration shares one interface. Then append the mutator to `Mps` for the creator you accept, so the inner creator's `store` has the member, and prepend it to `Mcs` for the creator you return, so `create` applies it. The second element of each pair is `A` in the augmentation, a type argument the mutator can use; pass `never` when it needs none. This middleware adds `store.reset()`:

```ts
// resettable.ts
import { createStore } from 'zustand/vanilla'
import type { StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand/vanilla'

declare module 'zustand/vanilla' {
  interface StoreMutators<S, A> {
    'example/resettable': Omit<S, 'reset'> & { reset: () => void }
  }
}

type Resettable = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  creator: StateCreator<T, [...Mps, ['example/resettable', never]], Mcs>,
) => StateCreator<T, Mps, [['example/resettable', never], ...Mcs]>

const resettableImpl = <T>(
  creator: StateCreator<T, [], []>,
): StateCreator<T, [], []> => (set, get, store) => {
  const initial = creator(set, get, store)
  ;(store as StoreApi<T> & { reset: () => void }).reset = () => set(initial, true)
  return initial
}

export const resettable = resettableImpl as Resettable

const counter = createStore<{ count: number }>()(resettable(() => ({ count: 0 })))
counter.setState({ count: 5 })
counter.reset() // typed through the mutator
console.log(counter.getState().count) // 0
```

The implementation still sees the plain store type, so it casts `store` once to assign the new member.

## Troubleshooting

| Symptom | Cause | Recovery |
|---|---|---|
| DevTools shows `anonymous` action names | No name was passed, or a middleware dropped it | Pass a name to `set`; forward all arguments |
| "An immer producer returned a new value *and* modified its draft" | A draft updater mutated and returned | Use a block body |
| Middleware "not assignable to parameter of type 'StateCreator<CartState, [], []>'" | `create` was not curried | Write `create<CartState>()(…)` |
| "Parameter 'draft' implicitly has an 'any' type" | The stack was built outside `create` | Write it inline inside `create<CartState>()(…)` |
