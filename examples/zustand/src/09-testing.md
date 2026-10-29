# Testing Stores

A store is a plain object that a test can create, drive, and inspect, so most store tests need no React. This chapter tests the cart from Chapters 5 to 7 with Node's built-in test runner.

## Roadmap

### Read this chapter if

You write unit tests for stores, for components that read stores, or for persisted state.

### Before you begin

- The tests import `cart.ts` from [Define a store with state and actions](#define-a-store-with-state-and-actions). The component test also imports `cart-context.tsx` and `scoped-components.tsx` from [Scope a store to a component tree](#scope-a-store-to-a-component-tree).
- Run test files with `npx tsx --test`. To type-check them, install `@types/node` and add `"node"` to `compilerOptions.types`.

### In this chapter you will

1. Test checkout against a fake backend.
2. Reset module stores between tests.
3. Test components and persisted stores.

### You can skip

[Test persisted stores](#test-persisted-stores) if you do not use `persist`.

## Test store logic without React

Create a new store in each test with `createCartStore()`. Each call returns an independent store, so no test sees another test's state. Pass a fake `OrdersApi` that rejects the order:

```ts
// checkout.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCartStore, MUG, OrderRejectedError, type OrdersApi } from './cart'

const rejectingApi: OrdersApi = {
  submit: async () => {
    throw new OrderRejectedError('MUG-02 is out of stock')
  },
}

test('a rejected order keeps the cart so the user can retry', async () => {
  const store = createCartStore()
  const statuses: string[] = []
  store.subscribe((state, previous) => {
    if (state.checkout !== previous.checkout) statuses.push(state.checkout.status)
  })
  store.getState().addItem(MUG)
  const itemsBefore = store.getState().items

  await store.getState().submitOrder(rejectingApi)

  assert.deepEqual(statuses, ['submitting', 'failed'])
  assert.equal(store.getState().checkout.error, 'MUG-02 is out of stock')
  // Same reference: the failure left the cart untouched, so a retry is safe.
  assert.equal(store.getState().items, itemsBefore)
})
```

`getState()` returns the latest state synchronously, so assertions after `await submitOrder(…)` see the final state. The `submitting` status exists only while the request is pending, so a listener attached beforehand records it ([How listeners are notified](#how-listeners-are-notified)).

## Reset module stores between tests

A module store, such as `useCartStore`, lives as long as the process that imported it, so items one test adds are still there when the next test starts. Node's test runner gives each file its own process, so the leak stays within one file.

Restore the initial state before each test with `setState(getInitialState(), true)`, the reset described in [Reset a store](#reset-a-store). When tests touch several module stores, record a reset function for each in a small registry:

```ts
// store-resets.ts
import type { StoreApi } from 'zustand'

const resets = new Set<() => void>()

export function resetBetweenTests<S>(store: StoreApi<S>): StoreApi<S> {
  resets.add(() => store.setState(store.getInitialState(), true))
  return store
}

export function resetAllStores(): void {
  for (const reset of resets) reset()
}
```

A test file calls `resetBetweenTests(useCartStore)` and `beforeEach(resetAllStores)`. A bound hook carries the store API, so `resetBetweenTests` accepts `useCartStore` directly.

A reset does not remove listeners. A subscription made in one test keeps running in later tests, so unsubscribe when the test ends, for example with `t.after(unsubscribe)`. For Jest and Vitest, Zustand's [testing guide](https://zustand.docs.pmnd.rs/learn/guides/testing) shows a module mock of `zustand` that resets every store automatically.

## Test components with an injected store

Render a component that calls `useCartStoreContext` under a `CartStoreProvider` with test props, such as `initialItems`. Each render mounts a new provider with a new store, so these tests need no reset. `renderToString` from `react-dom/server` renders the store's initial state ([Server rendering and the initial state](#server-rendering-and-the-initial-state)), which for a scoped store is the state built from the provider's props:

```tsx
// components.test.tsx
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderToString } from 'react-dom/server'
import { MUG, TEA } from './cart'
import { CartStoreProvider } from './cart-context'
import { CartBadge } from './scoped-components'

test('the badge counts every unit in the provided cart', () => {
  const items = {
    [TEA.sku]: { ...TEA, quantity: 2 },
    [MUG.sku]: { ...MUG, quantity: 1 },
  }
  const html = renderToString(
    <CartStoreProvider initialItems={items}>
      <CartBadge />
    </CartStoreProvider>,
  )
  assert.equal(html, '<span aria-label="Items in cart">3</span>')
})

test('the badge outside a provider throws', () => {
  assert.throws(() => renderToString(<CartBadge />), /inside <CartStoreProvider>/)
})
```

Running `npx tsx --test components.test.tsx` prints:

```text
✔ the badge counts every unit in the provided cart (2.678959ms)
✔ the badge outside a provider throws (0.231333ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 127.896583
```

The durations differ from run to run. Tests that click and re-render need a DOM environment, such as jsdom with Testing Library, which this book does not cover.

## Test persisted stores

This test builds the persisted cart from [Persist a store](#persist-a-store), saved as `persisted-cart-model.ts`, on a Map-backed storage, which it seeds with the JSON that `persist` writes and empties before each test:

```ts
// persisted-cart.test.ts
import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { createStore } from 'zustand/vanilla'
import { createJSONStorage, persist } from 'zustand/middleware'
import { cartCreator, createMapStorage, partializeCart, tea, type CartState } from './persisted-cart-model'

const storage = createMapStorage()
beforeEach(() => storage.entries.clear())

const createCart = () =>
  createStore<CartState>()(
    persist(cartCreator, {
      name: 'cart',
      storage: createJSONStorage(() => storage),
      partialize: partializeCart,
    }),
  )

test('hydrates from stored JSON and writes only persisted fields', () => {
  const state = { items: { 'TEA-01': { ...tea, quantity: 3 } }, coupon: 'WELCOME10' }
  storage.entries.set('cart', JSON.stringify({ state, version: 0 }))

  const store = createCart()
  assert.equal(store.getState().items['TEA-01']?.quantity, 3)

  store.getState().addItem(tea)
  assert.deepEqual(JSON.parse(storage.entries.get('cart') ?? 'null').state, {
    items: { 'TEA-01': { ...tea, quantity: 4 } },
    coupon: 'WELCOME10',
  })
})
```

Synchronous storage hydrates while the store is created, so the test can assert at once. With asynchronous storage, `await store.persist.rehydrate()` first ([Wait for hydration with asynchronous storage](#wait-for-hydration-with-asynchronous-storage)). Create the store inside each test, after seeding storage, because a store created at module scope hydrates once and never reads what a later test seeds.

## Troubleshooting

| Symptom | Cause | Recovery |
|---|---|---|
| State from one test appears in the next | A module store lives for the whole test file | Reset it in `beforeEach` ([Reset module stores between tests](#reset-module-stores-between-tests)), or create a store per test |
| A listener from an earlier test still runs | Resetting state does not remove listeners | Unsubscribe when the test ends, for example with `t.after(unsubscribe)` |
| A persisted store ignores the storage a test seeded | The store was created at module scope and hydrated before the seed | Create the store inside the test after seeding, or call `await store.persist.rehydrate()` |
| A persisted store shows default state with asynchronous storage | The test asserted before hydration finished | Call `await store.persist.rehydrate()` before asserting |
