# MPA vs SPA (Multi-Page vs Single-Page Applications)

Two architectures for structuring a web app around how navigation between pages/routes actually
happens.

## The core idea

| | MPA (Multi-Page App) | SPA (Single-Page App) |
|---|---|---|
| What loads per navigation | A brand-new HTML page from the server | Nothing — the same HTML page stays loaded |
| Who renders the page | The server, on every request | The browser, via JavaScript, after the first load |
| Routing | Real URLs, handled by the server | Virtual URLs, handled by client-side JS (History API) |
| Example tech | PHP, Django, Rails, JSP — server templates | React Router, Vue Router, Angular Router |
| Full reload on navigation? | Yes, every time | No — only the first load |

## MPA flow

Every link click is a brand-new round trip to the server. The browser throws away the current
page entirely and starts over.

```text
User clicks a link (e.g. /products)
  │
  ▼
Browser sends a full HTTP GET request to the server
  │
  ▼
Server looks up the route, queries the database,
renders a complete HTML page (e.g. via a template engine)
  │
  ▼
Server sends the full HTML (+ its own <link>/<script> tags) back
  │
  ▼
Browser discards the old page entirely
  │
  ▼
Browser parses the new HTML from scratch —
re-downloads CSS/JS, re-runs everything, repaints the whole screen
  │
  ▼
Page is interactive again
```

```html
<!-- server renders a full page for each route, e.g. /products.html -->
<html>
  <head><link rel="stylesheet" href="/site.css"></head>
  <body>
    <nav>...</nav>
    <h1>Products</h1>
    <!-- server injected this list directly into the HTML -->
    <ul>
      <li>Widget A</li>
      <li>Widget B</li>
    </ul>
  </body>
</html>
```

Clicking "About" from this page is just `<a href="/about">`, a normal link — the browser does its
default full-navigation behavior.

## SPA flow

The server sends one HTML shell, once. From then on, JavaScript intercepts navigation, fetches
only the data it needs, and updates the DOM in place.

```text
User loads the app the first time
  │
  ▼
Server sends ONE HTML shell + one JS bundle
  │
  ▼
JS bundle boots up, renders the initial view into the shell
  │
  ▼
User clicks a link (e.g. /products)
  │
  ▼
Client-side router intercepts the click
(calls preventDefault — no browser navigation happens)
  │
  ▼
Router matches /products to a component,
optionally fetches data via an API call (fetch/XHR)
  │
  ▼
Component re-renders — only the changed part of the DOM updates
  │
  ▼
Router updates the URL bar via the History API
(history.pushState) — no reload happened
  │
  ▼
Page is already interactive — nothing was thrown away
```

```jsx
// React Router: this is still one page — no full reload happens
import { Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <>
      <nav>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}
```

`<Link>` renders an `<a>` tag but hijacks the click so the router handles it in JavaScript instead
of letting the browser do a real navigation.

## Side-by-side: what actually happens on click

```text
MPA:  click → [ full server round trip → full HTML → full re-parse ] → new page
SPA:  click → [ router intercept → maybe an API call → DOM patch ] → same page, updated
```

The MPA version re-does work the SPA version never has to repeat (loading the JS framework,
re-establishing app state, re-running setup code) — that's the main performance argument for SPAs
on subsequent navigations, at the cost of a heavier *first* load (the whole JS bundle upfront).

## Trade-offs

| | MPA | SPA |
|---|---|---|
| First page load | Fast — just HTML/CSS | Slower — has to download and boot the JS bundle first |
| Subsequent navigation | Slow — full reload every time | Fast — only fetches/renders what changed |
| SEO | Straightforward — search engines see full HTML | Needs extra work (SSR/prerendering) since content is JS-rendered |
| Server load | Higher — server renders every page view | Lower — server mostly just serves data (APIs) |
| Complexity | Simpler mental model, less client-side code | More moving parts: routing, state management, data fetching all live in the client |
| Offline/app-like feel | No | Yes — can behave like a native app between navigations |

## Where you'll see this in practice

- A classic server-rendered site (Django/Rails/PHP templates, or even this VitePress docs site in
  production) is architecturally an **MPA** — each route is its own generated HTML page.
- A React app using **React Router** (or Vue/Angular Router) is a **SPA** — one HTML shell,
  everything after that is client-side rendering and routing.
- Many real products are **hybrid**: frameworks like Next.js or Remix server-render the initial
  HTML (solving the SEO/first-load problem) and then behave like an SPA for navigation after that
  — getting the fast-first-paint benefit of MPA and the fast-subsequent-navigation benefit of SPA.
