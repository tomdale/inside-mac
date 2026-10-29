# Errors and Symptoms {.appendix}

Find the message or behavior you observed (`…` marks varying text) and follow the link to its cause and recovery. React's getSnapshot warning prints only in development; in production React throws `Maximum update depth exceeded` as minified error #185. The devtools warning prints wherever devtools runs outside production mode.

| Message or symptom | Likely cause | See |
|---|---|---|
| `Maximum update depth exceeded`, `Minified React error #185`, or `The result of getSnapshot should be cached…` (React) | A selector returns a new object, array, or function each call | [Stable selectors](#selectors-must-return-stable-values) |
| `[zustand persist middleware] Unable to update item '…', the given storage is currently unavailable.` | Storage is missing, as on a server, or its factory threw | [About persistence](#about-persistence) |
| `State loaded from storage couldn't be migrated since no migrate function was provided` | The stored version differs from `version`, with no `migrate` | [Migration](#version-and-migrate-persisted-state) |
| `[zustand devtools middleware] "__setState" action type is reserved…` | A `redux` store dispatched `__setState` under `devtools` | [`devtools()`](#devtools) |
| A component does not re-render after `set` | The update mutated state in place | [Immutability rules](#immutability-rules) |
| A component re-renders on every change | No selector, or the selector returns the whole state | [Re-renders](#when-a-component-re-renders) |
| React hydration mismatch with a persisted store | The first client render reads stored state the server lacked | [Hydration and SSR](#control-hydration-for-server-rendering) |
| Saved state replaced by defaults on reload | An update ran before asynchronous hydration finished | [Async hydration](#wait-for-hydration-with-asynchronous-storage) |
| `store.persist` or `store.devtools` is `undefined` | Storage is unavailable, or the extension is absent or disabled, as in production | [About persistence](#about-persistence), [Redux DevTools](#inspect-a-store-with-redux-devtools) |
