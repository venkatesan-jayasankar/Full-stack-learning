# Library vs Framework

Both are pre-written code you build on top of instead of writing everything from scratch. The
difference isn't about size or capability — it's about **who is in control of the program's
flow**.

## The core idea: Inversion of Control

- **Library**: *you* call it. Your code is in charge — it decides when and how to use a piece of
  library functionality, then keeps going with its own flow.
- **Framework**: *it* calls you. The framework owns the overall program structure and control
  flow, and it calls into your code at specific points it defines (a lifecycle hook, a route
  handler, a component render). This handing-over of control is called **Inversion of Control
  (IoC)** — the defining trait of a framework.

> "You call a library. A framework calls you." — the shorthand version of this whole page.

## Library example

Your code drives everything. You decide when to call the library, and your program's control
flow never leaves your hands.

```js
// lodash is a library — you're in control, you call it when you want it
import { debounce } from 'lodash'

function main() {
  const search = debounce((query) => {
    fetchResults(query)
  }, 300)

  document.getElementById('search').addEventListener('input', (e) => {
    search(e.target.value) // you decide exactly when this runs
  })

  console.log('app started') // your code continues right after
}

main()
```

```text
Your code starts (main)
  │
  ▼
Your code decides: "I need debounce right now"
  │
  ▼
Calls into the library ── library runs, returns a result ──▶ back to your code
  │
  ▼
Your code continues its own flow
```

## Framework example

The framework owns `main`. It boots itself up, and *it* decides when to call into the code you
wrote — you just fill in the blanks it defines.

```js
// Angular (a framework) — you don't write the bootstrap/render loop yourself,
// you plug your class into slots the framework calls at the right time
@Component({
  selector: 'app-search',
  template: `<input (input)="onSearch($event)" />`,
})
class SearchComponent {
  onSearch(event) {
    // the framework decides WHEN this runs (on that specific DOM event,
    // inside its own change-detection cycle) — you never call this yourself
  }
}
```

```text
Framework boots itself (its own main/bootstrap, not yours)
  │
  ▼
Framework sets up its lifecycle (render loop, routing, change detection)
  │
  ▼
An event/lifecycle point occurs the framework is watching for
  │
  ▼
Framework calls INTO your code (onSearch, a component's render, etc.)
  │
  ▼
Your code runs briefly, returns control back to the framework
  │
  ▼
Framework continues running its own loop
```

## Side-by-side

```text
Library:    your code → calls → library     → returns → your code keeps driving
Framework:  framework → drives → calls into → your code → returns → framework keeps driving
```

| | Library | Framework |
|---|---|---|
| Who calls whom | You call it | It calls you (Inversion of Control) |
| Control flow | Stays in your code | Owned by the framework |
| Structure | You design your own architecture | The framework imposes a structure/convention |
| Flexibility | High — use only what you need, mix freely | Lower — you work within its rules |
| Learning curve | Usually smaller, one API at a time | Usually larger — you learn its conventions, lifecycle, CLI |
| Examples | lodash, jQuery, axios, date-fns | Angular, Spring Boot, Django, Ruby on Rails, Next.js |

## Where this gets genuinely blurry: React

React officially calls itself a **library**, not a framework — and by the strict definition it
mostly is: you call `ReactDOM.createRoot(...).render(<App />)` yourself, and inside your own
components, you're just writing JavaScript that returns JSX.

But building a real app with React usually means adding a router (React Router), a data-fetching
layer, and a build tool — at which point the *ecosystem* around React starts making structural
decisions for you, which is why it *feels* framework-like in practice. This is also why full
frameworks built on top of React (Next.js, Remix) exist — they take React's rendering model and
wrap it with the routing/data-fetching/IoC structure a framework provides, so you stop assembling
that yourself.

- **Angular** is a framework end-to-end: routing, DI, forms, HTTP client, build tooling, and the
  overall app bootstrap are all owned by Angular, and it calls into your components/services.
- **Spring Boot** is the backend equivalent: it boots its own application context, scans for your
  `@Component`/`@Controller` classes, and calls into them when a matching HTTP request or event
  arrives — you never write the server's main loop yourself.

## Why this distinction matters

- It explains **why frameworks feel more rigid**: you're agreeing to work inside a structure
  someone else designed, in exchange for not having to design that structure yourself.
- It explains **why libraries compose more freely**: since you're always the one calling in, you
  can mix as many unrelated libraries as you want without them needing to agree on an overall
  architecture.
- It's the right lens for evaluating a new tool: ask "who calls whom here?" — if you write the
  `main`/entry point and call into it, it's a library, no matter how big it is. If it writes the
  entry point and calls into your code, it's a framework, even if it's small.
