# Declarative vs Imperative Programming

Two ways of telling a computer to do something. The difference isn't the language — most
languages let you write both styles — it's whether you're describing **how** to get a result, or
**what** result you want.

## The core idea

| | Imperative | Declarative |
|---|---|---|
| Focus | **How** — the exact steps to take | **What** — the desired outcome |
| Control flow | You manage it explicitly (loops, conditionals, mutation) | The language/engine manages it for you |
| Example | `for` loop, manual DOM updates | `map`/`filter`, SQL, CSS, JSX |
| Mental model | "Do this, then this, then this" | "This is what the result should look like" |
| Trade-off | More control, more code, more room for step-by-step bugs | Less code, easier to read, less control over the exact execution path |

## Imperative example

You describe every step needed to reach the result — the *how*.

```js
// Imperative: double every even number in a list
const numbers = [1, 2, 3, 4, 5, 6]
const result = []

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    result.push(numbers[i] * 2)
  }
}

console.log(result) // [4, 8, 12]
```

Nothing here says "I want the doubled evens" directly — you have to read the loop, the
condition, and the mutation to figure out the intent.

## Declarative example

Same result, but you describe the *what* — the transformation itself — and let the language
handle the looping internally.

```js
// Declarative: double every even number in a list
const numbers = [1, 2, 3, 4, 5, 6]

const result = numbers
  .filter((n) => n % 2 === 0)
  .map((n) => n * 2)

console.log(result) // [4, 8, 12]
```

The intent reads almost like the sentence you'd say out loud: "filter the evens, then double
them."

## Comparing the flow

**Imperative flow** — you are the one driving execution, one instruction at a time, and you
manage the intermediate state (`result`, the loop index `i`) yourself:

```text
Start
  │
  ▼
result = []
  │
  ▼
i = 0 ──────────────┐
  │                 │
  ▼                 │
i < numbers.length? ─No──▶ return result
  │ Yes                        ▲
  ▼                            │
numbers[i] even?               │
  │ Yes      │ No              │
  ▼          │                 │
push doubled │                 │
value        │                 │
  │          │                 │
  ▼          ▼                 │
i++  ────────┴─────────────────┘
```

**Declarative flow** — you hand over a description of the end result, and the underlying
implementation (here, `Array.prototype.filter`/`map`) owns the step-by-step execution and the
intermediate state:

```text
Start
  │
  ▼
Describe transformation:
  "filter evens, then double each"
  │
  ▼
Runtime executes the loop internally
(you never see or manage the index or accumulator)
  │
  ▼
result
```

The imperative flow has branches and mutable state you have to trace by hand. The declarative
flow collapses that into a single description — the looping still happens, just not in code you
wrote or have to reason about.

## More examples across contexts

- **UI**: manually calling `document.createElement`, setting attributes, and calling
  `appendChild` is imperative — you're describing every DOM operation. Writing JSX like
  `<button disabled={isLoading}>Save</button>` is declarative — you describe what the UI *should
  look like* for a given state, and the framework (React) figures out the actual DOM operations.
- **Data querying**: writing a manual loop to scan an array of records and collect matches is
  imperative. Writing `SELECT * FROM users WHERE age > 18` is declarative — you describe the
  data you want, not how the database should scan or index to find it.
- **Styling**: computing an element's pixel position with `element.style.left = x + 'px'` inside
  a loop is imperative. Writing a CSS rule like `.card { display: flex; justify-content: center }`
  is declarative — you describe the desired layout, and the browser's layout engine works out
  the actual positioning.

## Why this distinction matters

- Declarative code is usually **shorter and easier to read** because the intent isn't buried in
  step-by-step mechanics.
- Imperative code gives you **more precise control** — useful when you need to optimize a specific
  loop, short-circuit early, or do something the declarative API doesn't expose.
- Most real code is a **mix of both**: e.g. React's JSX (declarative UI) is built with JavaScript
  (a language that lets you write imperative logic inside event handlers, `useEffect`, etc.).
  Recognizing which style you're in helps you pick the right tool — reach for `map`/`filter`/JSX
  when describing a transformation or UI, and drop to an explicit loop only when you genuinely
  need manual control over the steps.
