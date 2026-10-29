# Glossary {.appendix}

Each entry defines a term as this book uses it and links to the section that explains it.

**action**: A function-valued field of the state that updates the store through `set`, such as `addItem`. See [Actions and where logic lives](#actions-and-where-logic-lives).

**bound hook**: The React hook `create` returns, such as `useCartStore`, which also carries the store API methods for code outside React. See [How a component subscribes to a store](#how-a-component-subscribes-to-a-store). **Compare** vanilla store.

**equality function**: A function that receives the previous and next selected values and returns `true` when they count as equal, so the component does not re-render or the listener is not called. The hooks from `zustand/traditional` accept one per call or per store, and `subscribeWithSelector` accepts one as `equalityFn`. `create` and `useStore` accept none and compare with `Object.is`. See [Custom equality with `zustand/traditional`](#custom-equality-with-zustand-traditional). **Compare** shallow equality.

**hydration**: The process in which `persist` reads stored state, migrates it if needed, and merges it into the current state. With asynchronous storage it finishes after creation. See [The hydration lifecycle](#the-hydration-lifecycle).

**initial state**: The value the state creator returned at creation, which `getInitialState()` returns for the life of the store. See [Reset a store](#reset-a-store).

**listener**: A function passed to `subscribe` that receives `(state, previousState)`. The store calls it synchronously inside `setState`. See [How listeners are notified](#how-listeners-are-notified).

**merge**: (1) How `setState` combines a partial state with the current state, one level deep ([How setState computes the next state](#how-setstate-computes-the-next-state)). (2) The `persist` option that combines stored and current state during hydration ([Merge nested persisted state](#merge-nested-persisted-state)).

**middleware**: A function that takes a state creator and returns one, and can wrap `set` or extend the store API. See [What middleware is](#what-middleware-is).

**migration**: The `migrate` call that `persist` makes during hydration when the stored version is a number that differs from the `version` option. It converts persisted state to the current shape, and `persist` writes the result back, so each stored value is migrated once. Without `migrate`, `persist` logs an error and keeps the defaults. See [Version and migrate persisted state](#version-and-migrate-persisted-state).

**module store**: A store created at the top level of a module, so every component, test, and server request in the process shares it. See [Module stores and scoped stores](#module-stores-and-scoped-stores). **Compare** scoped store.

**mutator**: A type-level change that a middleware makes to the store type, registered in the `StoreMutators` interface and written as a pair such as `['zustand/persist', unknown]`. A middleware stack produces an ordered list of mutators, which `create` applies to `StoreApi<T>`; slices under middleware and custom middleware pass these lists through the type parameters of `StateCreator`. A mutator changes only types; the middleware itself makes the runtime change. See [How middleware changes the store type](#how-middleware-changes-the-store-type). **Compare** middleware.

**partial state**: An object with only some of the state's fields, passed to `set` or `setState` or returned by an updater. Without the replace flag the store merges it one level deep into a new state object, so the fields it omits, including actions, keep their values. See [How setState computes the next state](#how-setstate-computes-the-next-state). **Compare** replace flag.

**`partialize`**: The `persist` option that chooses what to store: a function from the current state to the persisted state, called on every write. By default `persist` stores the whole state. Use it to leave out fields that are wrong to restore, such as a request status. See [Persist a store](#persist-a-store) and [`PersistOptions`](#persistoptions).

**persisted state**: The value `persist` stores under its `name`, as the `state` field of a [`StorageValue`](#storagevalue). It is the `partialize` output at the last write, and hydration passes it to `migrate` and `merge`. Because it can come from an older or newer release, treat it as untrusted input. See [About persistence](#about-persistence). **Compare** initial state.

**replace flag**: The second argument of `set` and `setState`. With `true`, the given value becomes the whole state, so omitted fields, including actions, disappear. See [How setState computes the next state](#how-setstate-computes-the-next-state).

**scoped store**: A store that a provider component creates and shares with its descendants through React context, one instance per mounted provider. See [Scope a store to a component tree](#scope-a-store-to-a-component-tree). **Compare** module store.

**selected value**: What a selector returns. A component re-renders only when it changes under `Object.is`. Zustand's type parameters call this value a slice; this book does not. See [When a component re-renders](#when-a-component-re-renders).

**selector**: A pure function from the state to a selected value, which runs on render and after every update. See [Selectors must return stable values](#selectors-must-return-stable-values).

**shallow equality**: The comparison `shallow` performs: `Object.is` on each top-level entry, so nested objects match only by reference. See [Shallow comparison with `useShallow`](#shallow-comparison-with-useshallow).

**slice**: In this book, a state creator that builds part of a store's state and is combined with other slices in one store. See [Split a large store into slices](#split-a-large-store-into-slices). **Compare** selected value.

**state**: The single value a store holds, usually an object of data and actions. Changes are detected by reference, so each update must create new objects. See [Immutability rules](#immutability-rules).

**state creator**: The function `(set, get, store) => initialState` passed to `create`, `createStore`, or a middleware, and called once at creation. See [How a store is created](#how-a-store-is-created).

**storage**: The object `persist` reads and writes, given as its `storage` option. A `PersistStorage` stores `StorageValue` objects; a `StateStorage` stores strings, as `localStorage` does, and `createJSONStorage` adapts one into a `PersistStorage`. A `getItem` that returns a promise makes hydration asynchronous. See [`StateStorage` and `PersistStorage`](#statestorage-and-persiststorage).

**store**: A container for one current state value and its listeners, independent of React and reached through the store API. See [What a store is](#what-a-store-is) and [`StoreApi`](#storeapi).

**store API**: The object with `getState`, `setState`, `subscribe`, and `getInitialState` through which code reaches a store. `createStore` returns it, `create` attaches its methods to the bound hook, and a state creator receives it as its third argument. Middleware can replace its methods or add members such as `store.persist`. See [`StoreApi`](#storeapi).

**subscription**: A listener registered with `subscribe`, which stays registered until you call the unsubscribe function that `subscribe` returns. Until then the store keeps the listener, and everything the listener closes over, alive. A component subscribes through `useStore`, and React manages that subscription. See [How listeners are notified](#how-listeners-are-notified). **See also** listener.

**transient update**: A state change that code handles in a `subscribe` listener instead of through a render, such as updating a page title or a log. Frequent changes handled this way cost no React render. See [React to changes without rendering](#react-to-changes-without-rendering).

**vanilla store**: The store API object `createStore` returns, with no hook. Components read it with `useStore`. See [`createStore()`](#createstore). **Compare** bound hook.
