# Using Stores in Components

This chapter reads the cart store from React components, first through the module store and then through a store scoped to a provider or a server request. It applies the rules from [Selectors and Rendering in React](#selectors-and-rendering-in-react).

## Roadmap

### Read this chapter if

You render store data in React components or need a separate store for each subtree, test, or server request.

### Before you begin

Read [Selectors must return stable values](#selectors-must-return-stable-values).

### In this chapter you will

1. Select values, actions, and derived values.
2. Read a vanilla store with `useStore`.
3. Scope a store to a component tree or a server request.

### You can skip

The last section if you do not render on a server.

## Read a value in a component

The listings import `cart.ts` from [Define a store with state and actions](#define-a-store-with-state-and-actions), with these exports added at its end:

```ts
// cart.ts (continued)
export type CartStore = ReturnType<typeof createCartStore>

// Sorting builds a new array on every call; read it through useShallow.
export const selectLinesByName = (s: CartState) =>
  Object.values(s.items).sort((a, b) => a.name.localeCompare(b.name))

export const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`
```

Call the bound hook with a selector that returns exactly the value the component displays:

```tsx
// cart-line.tsx
import { useCartStore } from './cart'

export function CartLine({ sku }: { sku: string }) {
  const quantity = useCartStore((s) => s.items[sku]?.quantity ?? 0)
  const setQuantity = useCartStore((s) => s.setQuantity)
  return (
    <li>
      {sku}: {quantity}
      <button onClick={() => setQuantity(sku, quantity + 1)}>+</button>
    </li>
  )
}
```

The first selector and its fallback both return a number, so under [When a component re-renders](#when-a-component-re-renders) the line re-renders only when its own quantity changes. A fallback such as `?? {}` would build a new object on each call. The second selector returns an action, which keeps its reference across merges. Calling `useCartStore()` without a selector returns the whole state and re-renders on every update.

## Select several values

A component can call the hook once per value, as `CartLine` does, or call it once with a selector wrapped in `useShallow`:

```tsx
// line-hooks.tsx
import { useShallow } from 'zustand/react/shallow'
import { useCartStore } from './cart'

export function useLine(sku: string) {
  return useCartStore(
    useShallow((s) => ({
      name: s.items[sku]?.name ?? sku,
      quantity: s.items[sku]?.quantity ?? 0,
    })),
  )
}
```

The selector builds a new object on each call, but `useShallow` returns its previous result while the new one is [shallowly equal](#shallow-comparison-with-useshallow). That comparison is one level deep, so a result that contains a newly built nested object never equals the previous one. Such a result is unstable and fails like any [unstable selector](#selectors-must-return-stable-values).

Separate calls need no wrapper, and each one triggers a re-render only when its own value changes. Use `useShallow` when the component needs an object or array assembled from several fields. It also handles a set of fields that depends on props, which separate calls cannot, because a component must make the same hook calls on every render.

## Compute derived values

A selector that computes a number, string, or boolean is stable, so `CartBadge` below re-renders only when the count changes. A selector that builds a new array, for example with `sort`, needs `useShallow`. Export selectors from the store's module so that components, tests, and plain code share them.

```tsx
// summary.tsx
import { useShallow } from 'zustand/react/shallow'
import { formatCents, selectItemCount, selectLinesByName, selectSubtotal, useCartStore } from './cart'
import { CartLine } from './cart-line'

export function CartBadge() {
  const count = useCartStore(selectItemCount)
  return <span aria-label="Items in cart">{count}</span>
}

export function CartSummary() {
  const subtotal = useCartStore(selectSubtotal)
  const lines = useCartStore(useShallow(selectLinesByName))
  return (
    <section>
      <ul>{lines.map((line) => <CartLine key={line.sku} sku={line.sku} />)}</ul>
      <p>Subtotal: {formatCents(subtotal)}</p>
    </section>
  )
}
```

The sorted array holds the stored `CartItem` objects, so `useShallow` keeps the previous array until an item changes. The selector still sorts after every store update. If a derivation is expensive, select `s.items`, which changes only when an item changes, and derive inside `useMemo(() => …, [items])`.

## Use a vanilla store in React

Read a store made with `createStore` with `useStore(store, selector)`, which follows the bound hook's rules. `ExtractState` types a wrapper hook:

```tsx
// vanilla.tsx
import { useStore, type ExtractState } from 'zustand'
import { createCartStore } from './cart'

export const cartStore = createCartStore()

export function useCart<U>(selector: (state: ExtractState<typeof cartStore>) => U): U {
  return useStore(cartStore, selector)
}
```

## Scope a store to a component tree

A scoped store is created by a provider and shared with descendants through context, so each mounted provider owns one instance. [Module stores and scoped stores](#module-stores-and-scoped-stores) explains when to choose one. This provider creates a store from its props:

```tsx
// cart-context.tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createCartStore, type CartItem, type CartState, type CartStore } from './cart'

const CartStoreContext = createContext<CartStore | null>(null)

export function CartStoreProvider(props: {
  initialItems?: Record<string, CartItem>
  children: ReactNode
}) {
  // The initializer runs on the first render only, so each mount owns one store.
  const [store] = useState(() => createCartStore(props.initialItems))
  return <CartStoreContext.Provider value={store}>{props.children}</CartStoreContext.Provider>
}

export function useCartStoreContext<U>(selector: (state: CartState) => U): U {
  const store = useContext(CartStoreContext)
  if (!store) {
    throw new Error('useCartStoreContext must be called inside <CartStoreProvider>')
  }
  return useStore(store, selector)
}
```

Pass a function to `useState`, because `useState(createCartStore(…))` would build a new store on every render. The context value never changes, so context does not re-render consumers; each component re-renders through its own selector. The provider reads `initialItems` once, so to start over from new items, give it a `key` that changes with them. Those items are the store's initial state, so [Reset a store](#reset-a-store) returns to them. Scoped components call the context hook:

```tsx
// scoped-components.tsx
import { selectItemCount } from './cart'
import { useCartStoreContext } from './cart-context'

export function CartBadge() {
  const count = useCartStoreContext(selectItemCount)
  return <span aria-label="Items in cart">{count}</span>
}
```

## Create a store per server request

On a server, render the provider once per request. Each render runs its `useState` initializer, so each request gets its own store, discarded with the render:

```tsx
// per-request.tsx
import { renderToString } from 'react-dom/server'
import { TEA } from './cart'
import { CartStoreProvider } from './cart-context'
import { CartBadge } from './scoped-components'

function handleRequest(userId: string) {
  // Stands in for a database read keyed by the signed-in user.
  const items = { [TEA.sku]: { ...TEA, quantity: userId === 'ana' ? 5 : 1 } }
  return renderToString(
    <CartStoreProvider initialItems={items}>
      <CartBadge />
    </CartStoreProvider>,
  )
}

console.log('ana:', handleRequest('ana'))
console.log('ben:', handleRequest('ben'))
```

Running `npx tsx per-request.tsx` prints:

```text
ana: <span aria-label="Items in cart">5</span>
ben: <span aria-label="Items in cart">1</span>
```

Each response shows its own items, because server rendering reads `getInitialState()`, which came from that request's props. A module store, by contrast, would share request data across every request in the process ([Server rendering and the initial state](#server-rendering-and-the-initial-state)).

Render the browser's provider with the same `initialItems`, because React hydration reads the client store's initial state. With server components, put the provider in a `'use client'` module. For routing details, follow Zustand's [Next.js guide](https://zustand.docs.pmnd.rs/learn/guides/nextjs).

## Troubleshooting

| Symptom | Cause | Recovery |
|---|---|---|
| "Maximum update depth exceeded", or a warning that getSnapshot should be cached | A selector builds a new object, array, or function on each call, including fallbacks such as `?? []`, or a new nested object inside a `useShallow` result | Follow [Selectors must return stable values](#selectors-must-return-stable-values) |
| A component re-renders on every store change | No selector, so the component reads the whole state | Select only the fields the component displays |
| A component does not update | State was mutated in place, or the component reads a different store instance | Follow [Immutability rules](#immutability-rules), and check which store the hook targets |
| Hydration mismatch in a persisted store | The client's first render reads storage the server cannot | Follow [Control hydration for server rendering](#control-hydration-for-server-rendering) |
| `useCartStoreContext must be called inside <CartStoreProvider>` | The component rendered outside the provider | Wrap the tree, or the test's render, in `CartStoreProvider` |
