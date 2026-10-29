# Building Stores

This chapter builds the storefront cart store that the rest of the book uses: its state and actions, an asynchronous checkout, subscriptions outside React, resets, and slices. Chapters 6 to 9 extend the same store with components, persistence, middleware, and tests.

## Roadmap

### Read this chapter if

You are adding a store, or want the cart model that Chapters 6 to 9 extend.

### Before you begin

Read [How setState computes the next state](#how-setstate-computes-the-next-state) and [Actions and where logic lives](#actions-and-where-logic-lives). Run scripts with `npx tsx <file>.ts` as ES modules.

### In this chapter you will

- define the cart store as a vanilla store factory and as a module store;
- write synchronous and asynchronous actions, and run checkout against a fake backend;
- read, subscribe to, and reset a store outside components;
- split a store into slices.

### You can skip

[Split a large store into slices](#split-a-large-store-into-slices), if one state creator fits your store.

## Define a store with state and actions

The cart keys its line items by SKU, so that an update to one line touches one key. Prices are integer cents. Create `cart.ts`:

```ts
import { create, createStore, type StateCreator } from 'zustand'

export type CartItem = {
  sku: string
  name: string
  unitPrice: number // integer cents
  quantity: number
}

export type CheckoutState = {
  status: 'idle' | 'submitting' | 'failed' | 'done'
  orderId: string | null
  error: string | null
}

export type CartState = {
  items: Record<string, CartItem> // keyed by sku
  coupon: string | null
  checkout: CheckoutState
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  setQuantity: (sku: string, quantity: number) => void // quantity < 1 removes
  removeItem: (sku: string) => void
  applyCoupon: (code: string | null) => void
  submitOrder: (api: OrdersApi) => Promise<void>
  reset: () => void
}

export class OrderRejectedError extends Error {}
export type OrdersApi = {
  submit: (lines: CartItem[], coupon: string | null) => Promise<{ orderId: string }>
}

export const selectItemCount = (s: CartState) =>
  Object.values(s.items).reduce((n, i) => n + i.quantity, 0)
export const selectSubtotal = (s: CartState) =>
  Object.values(s.items).reduce((c, i) => c + i.unitPrice * i.quantity, 0)

export const TEA = { sku: 'TEA-01', name: 'Sencha tea', unitPrice: 1250 }
export const MUG = { sku: 'MUG-02', name: 'Stoneware mug', unitPrice: 1800 }

const idleCheckout: CheckoutState = { status: 'idle', orderId: null, error: null }

const cartStateCreator =
  (initialItems: Record<string, CartItem> = {}): StateCreator<CartState> =>
  (set, get, store) => ({
    items: initialItems,
    coupon: null,
    checkout: idleCheckout,

    addItem: (item, quantity = 1) =>
      set((state) => {
        const current = state.items[item.sku]
        const next = (current?.quantity ?? 0) + quantity
        return { items: { ...state.items, [item.sku]: { ...item, quantity: next } } }
      }),

    setQuantity: (sku, quantity) => {
      if (quantity < 1) {
        get().removeItem(sku)
        return
      }
      set((state) => {
        const item = state.items[sku]
        if (!item) return state
        return { items: { ...state.items, [sku]: { ...item, quantity } } }
      })
    },

    removeItem: (sku) =>
      set((state) => {
        if (!(sku in state.items)) return state
        const { [sku]: _removed, ...items } = state.items
        return { items }
      }),

    applyCoupon: (code) => set({ coupon: code }),

    submitOrder: async (api) => {
      if (get().checkout.status === 'submitting') return
      set({ checkout: { status: 'submitting', orderId: null, error: null } })
      const { items, coupon } = get()
      try {
        const { orderId } = await api.submit(Object.values(items), coupon)
        set({ items: {}, checkout: { status: 'done', orderId, error: null } })
      } catch (error) {
        if (error instanceof OrderRejectedError) {
          set({ checkout: { status: 'failed', orderId: null, error: error.message } })
          return
        }
        set({ checkout: idleCheckout })
        throw error
      }
    },

    reset: () => set(store.getInitialState(), true),
  })

export const createCartStore = (initialItems?: Record<string, CartItem>) =>
  createStore<CartState>()(cartStateCreator(initialItems))

export const useCartStore = create<CartState>()(cartStateCreator())
```

`createCartStore` calls [`createStore()`](#createstore) each time, so every provider, server request, or test gets an independent vanilla store whose initial state can include `initialItems`. [`create()`](#create) builds one module store and returns the bound hook `useCartStore`. [Module stores and scoped stores](#module-stores-and-scoped-stores) compares them. The selectors compute totals on demand, so a total cannot fall out of step with `items`.

To check the model, create `try-cart.ts`, which adds two teas and two mugs and prints the resulting state:

```ts
import { createCartStore, MUG, selectItemCount, selectSubtotal, TEA } from './cart'

const cartStore = createCartStore()
cartStore.getState().addItem(TEA)
cartStore.getState().addItem(MUG, 2)
cartStore.getState().addItem(TEA)

const { items, checkout } = cartStore.getState()
for (const item of Object.values(items)) {
  console.log(item.sku, item.quantity, item.unitPrice * item.quantity)
}
console.log(checkout.status)
console.log(selectItemCount(cartStore.getState()), selectSubtotal(cartStore.getState()))
```

```text
TEA-01 2 2500
MUG-02 2 3600
idle
4 6100
```

The second `addItem(TEA)` raised the existing line's quantity, so the record still has one entry per SKU.

## Update nested state

`setQuantity` and `removeItem` build a new `items` record and a new object for the changed line, as [Immutability rules](#immutability-rules) requires. Unchanged lines keep their identity, so components that select them do not re-render. Both actions return the current `state` for an unknown SKU, which notifies no listener. For deep updates, see [Write updates as mutations with Immer](#write-updates-as-mutations-with-immer).

## Run asynchronous actions

`submitOrder` calls `set` before and after it awaits the backend, and `checkout.status` records its progress:

1. If `status` is `submitting`, return. Because `set` is synchronous, a double click's second call sees `submitting`.
2. On success, set `done` with the `orderId` and clear `items`.
3. On `OrderRejectedError`, set `failed`. The cart is unchanged, so a retry submits the same order.
4. On any other error, set `idle` and rethrow, because a stuck `submitting` would block every later call.

A retry after an unexpected error is safe only if the backend did not record the order, so send an idempotency key if your API accepts one.

Create `checkout.ts`, which submits the same cart once against a backend that accepts it and once against one that rejects it. Each run calls `submitOrder` twice without waiting, as a double click would:

```ts
import { createCartStore, MUG, OrderRejectedError, TEA, type OrdersApi } from './cart'

const succeedingApi: OrdersApi = {
  submit: async () => ({ orderId: 'ord_1001' }),
}
const rejectingApi: OrdersApi = {
  submit: async () => {
    throw new OrderRejectedError('MUG-02 is out of stock')
  },
}

async function run(label: string, api: OrdersApi) {
  const cartStore = createCartStore()
  cartStore.getState().addItem(TEA)
  cartStore.getState().addItem(MUG)
  cartStore.subscribe((state, previous) => {
    if (state.checkout !== previous.checkout) {
      console.log(label, state.checkout.status)
    }
  })

  const pending = cartStore.getState().submitOrder(api)
  await cartStore.getState().submitOrder(api) // second click: returns at once
  await pending

  const { items, checkout } = cartStore.getState()
  console.log(label, Object.keys(items), checkout.orderId, checkout.error)
}

await run('success:', succeedingApi)
await run('rejected:', rejectingApi)
```

```text
success: submitting
success: done
success: [] ord_1001 null
rejected: submitting
rejected: failed
rejected: [ 'TEA-01', 'MUG-02' ] null MUG-02 is out of stock
```

Each run passes through `submitting` once, so the second call submitted nothing. The rejected run keeps both lines, which is what makes its retry safe. [Test store logic without React](#test-store-logic-without-react) turns the rejection path into a test.

## Read and write state outside components

Event handlers outside React, timers, and services call the [`StoreApi`](#storeapi) methods directly, as in `useCartStore.getState().addItem(TEA)`. Prefer actions to `setState()`, which skips their validation. Module-level functions that call `useCartStore.setState()` also work, but each is bound to one store instance. Inside a component, `getState()` reads without subscribing, so read rendered values through the hook ([How a component subscribes to a store](#how-a-component-subscribes-to-a-store)).

## React to changes without rendering

For a sink outside React, such as a page title, register a listener with [`subscribe()`](#storeapi). The listener runs after every update with `(state, previousState)` ([How listeners are notified](#how-listeners-are-notified)), so compare the part you need yourself. The store keeps a listener until you call the function `subscribe` returns. Create `title.ts`:

```ts
import { createCartStore, selectItemCount, TEA } from './cart'

const cartStore = createCartStore()
const unsubscribe = cartStore.subscribe((state, previousState) => {
  const count = selectItemCount(state)
  if (count !== selectItemCount(previousState)) {
    console.log(`Cart (${count})`) // a stand-in for document.title
  }
})

cartStore.getState().addItem(TEA)
cartStore.getState().applyCoupon('SPRING') // count unchanged: no output
cartStore.getState().setQuantity('TEA-01', 3)
unsubscribe()
cartStore.getState().removeItem('TEA-01') // no listener: no output
```

```text
Cart (1)
Cart (3)
```

The listener ran for the coupon update too, but the count comparison skipped it. In a component, subscribe in an effect and return the unsubscribe function from the effect's cleanup. For subscriptions to a selected value, see [Subscribe to part of the state](#subscribe-to-part-of-the-state).

## Reset a store

`getInitialState()` returns the state the creator built, actions included ([How a store is created](#how-a-store-is-created)). To reset, replace the current state with it: `store.setState(store.getInitialState(), true)`, which the cart's `reset` action does. For a partial reset, merge chosen fields from it without the replace flag. A store from `createCartStore(initialItems)` resets to those items, because they were part of its initial state. Under `persist`, also see [Clear persisted state](#clear-persisted-state).

## Split a large store into slices

A slice is a state creator that builds part of a store's state, so separate modules can own features while sharing one `set` and `get`. Type each slice as `StateCreator<StoreState, [], [], Slice>`. The first argument is the whole state, so `get()` inside a slice sees every slice. Create `slices.ts`:

```ts
import { createStore, type StateCreator } from 'zustand/vanilla'

type CartSlice = { skus: string[]; addItem: (sku: string) => void }
type UiSlice = { isCartOpen: boolean; toggleCart: () => void }
type StoreState = CartSlice & UiSlice

const createCartSlice: StateCreator<StoreState, [], [], CartSlice> = (set, get) => ({
  skus: [],
  addItem: (sku) => {
    set((s) => ({ skus: [...s.skus, sku] }))
    if (!get().isCartOpen) get().toggleCart() // cross-slice call
  },
})

const createUiSlice: StateCreator<StoreState, [], [], UiSlice> = (set) => ({
  isCartOpen: false,
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
})

const shopStore = createStore<StoreState>()((...args) => ({
  ...createCartSlice(...args),
  ...createUiSlice(...args),
}))

shopStore.getState().addItem('TEA-01')
console.log(shopStore.getState().isCartOpen) // true
```

Slice fields share one namespace, so a later spread overwrites an earlier field of the same name. Apply middleware once, around the combined creator, because wrapping each slice would create a separate middleware instance per slice. Then pass the stack's mutator list as each slice's second type argument, such as `[['zustand/devtools', never]]`, or a slice under `devtools` cannot name its actions ([How middleware changes the store type](#how-middleware-changes-the-store-type)).

## Troubleshooting

| Symptom | Cause | Recovery |
|---|---|---|
| A component or listener misses an update | An object was changed in place | Build new objects ([Immutability rules](#immutability-rules)) |
| An action is missing after `setState(…, true)` | The replacement omitted the actions | Replace with `getInitialState()`, or drop `true` |
| Type error on `setState(partial, true)` | Replacement needs a complete state | Drop `true`, or pass a full state |
| An async action loses concurrent changes | It wrote a value read before the `await` | Read with `get()` after the `await` |
