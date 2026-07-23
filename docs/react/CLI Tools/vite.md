# Vite

Vite (French for "fast", pronounced "veet") is a build tool and dev server for modern frontend
projects, including React. It replaced Create React App (CRA) as the standard way to scaffold
React apps because of its speed and simplicity.

## What Vite actually is

Vite is two tools in one, switched automatically depending on what command you run:

- **A dev server** (`vite` / `npm run dev`) that serves your source files over native ES modules
  (`<script type="module">`), transforming each file on demand with esbuild the moment the browser
  requests it — nothing is bundled upfront.
- **A production bundler** (`vite build`) that hands the same project to Rollup to produce a
  small, optimized, tree-shaken bundle for deployment.

This dev/build split is the core idea: development optimizes for *speed of feedback*, production
optimizes for *bundle size and caching* — and Vite uses a different tool suited to each job instead
of forcing one bundler to do both.

## How the dev server is so fast

- **No upfront bundling** — traditional bundlers (webpack) must build a full dependency graph and
  bundle the entire app before serving a single page, which gets slower as the app grows. Vite
  serves source files directly over ESM and only transforms a file when the browser actually
  imports it, so startup time stays roughly constant regardless of project size.
- **Esbuild pre-bundling of dependencies** — `node_modules` packages (often shipped as CommonJS,
  with hundreds of internal files) are pre-bundled once into a few ESM files using esbuild, which
  is written in Go and compiled to native code, making it 10–100x faster than JS-based bundlers for
  this step. This is cached in `node_modules/.vite`.
- **HTTP caching for source files** — already-transformed modules are served with strong cache
  headers, so the browser doesn't refetch/retransform files that haven't changed between reloads.
- **Fast Hot Module Replacement (HMR)** — saving a file recompiles and swaps only that module in
  the browser, without a full reload or losing component/form state.

## Why Vite over Create React App

- **CRA is deprecated** — Create React App is no longer actively maintained, and the React docs no
  longer recommend it. Vite (or a full framework like Next.js) is the current recommended path for
  a plain React SPA.
- **Simpler, visible config** — sensible defaults for JSX, TypeScript, CSS Modules, and static
  assets out of the box, in a plain `vite.config.js` you can read and edit — no "ejecting" a hidden
  webpack config to customize anything.
- **Smaller, faster production builds** in most cases, since Rollup tree-shakes more aggressively
  than webpack's CRA defaults.

## Installing a new React + Vite project

Requires Node.js 18+ installed.

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

Other templates available: `react-ts` (React + TypeScript), `vanilla`, `vue`, `svelte`, etc. — pass
the one you want after `--template`.

### Interactive alternative

Running without flags prompts you to pick a framework and variant interactively:

```bash
npm create vite@latest
```

### Resulting project structure

```text
my-app/
  index.html          # entry HTML — lives at the root, not in public/
  package.json
  vite.config.js       # Vite + plugin configuration
  public/              # static assets copied as-is (favicon, robots.txt, ...)
  src/
    main.jsx            # entry point — mounts <App /> into index.html's #root
    App.jsx
    App.css
    index.css
```

`index.html` is a first-class source file in Vite (not just a template) — it directly
`<script type="module" src="/src/main.jsx">`s your entry point, which is how Vite knows where the
module graph starts.

## Running the project

```bash
npm run dev       # start the dev server (default: http://localhost:5173)
npm run build     # production build, output to dist/
npm run preview   # locally preview the production build from dist/
```

## Adding Vite to an existing React project

If you're migrating off CRA or webpack:

1. Install Vite and the React plugin:
   ```bash
   npm install --save-dev vite @vitejs/plugin-react
   ```
2. Add a `vite.config.js` at the project root:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```
3. Move `index.html` to the project root (Vite expects it there, not in `public/`) and add:
   ```html
   <script type="module" src="/src/main.jsx"></script>
   ```
4. Update `package.json` scripts to use `vite`, `vite build`, `vite preview` instead of
   `react-scripts`.
5. Replace any CRA-specific env var usage (`process.env.REACT_APP_*`) with Vite's
   `import.meta.env.VITE_*` convention, and rename `.env` variables accordingly.

## Common `vite.config.js` options

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // import Button from '@/components/Button'
    },
  },

  server: {
    port: 3000,
    proxy: {
      // forward /api/* to a backend during dev, avoiding CORS issues
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

- **`plugins`** — `@vitejs/plugin-react` enables JSX transform and Fast Refresh (React's HMR).
- **`resolve.alias`** — define import shortcuts instead of long relative paths (`../../../`).
- **`server.proxy`** — forward specific paths to a backend API during development.
- **`build`** — controls the production output (output directory, sourcemaps, chunking, etc.).

## Environment variables

- Files: `.env`, `.env.local`, `.env.[mode]` (e.g. `.env.production`) at the project root.
- Only variables prefixed with `VITE_` are exposed to client code — this is a deliberate security
  boundary so secrets in `.env` aren't accidentally bundled into the browser build.
- Access them via `import.meta.env.VITE_API_URL`, not `process.env` (there is no Node `process`
  object in the browser bundle).
- Built-ins: `import.meta.env.MODE`, `import.meta.env.DEV`, `import.meta.env.PROD`,
  `import.meta.env.BASE_URL`.

## Troubleshooting / gotchas

- **Blank page after deploying to a subpath** (e.g. GitHub Pages) — set `base: '/repo-name/'` in
  `vite.config.js` so built asset URLs resolve correctly.
- **`process is not defined`** — you're using CRA-style `process.env.REACT_APP_*`; switch to
  `import.meta.env.VITE_*`.
- **New dependency not picked up** — Vite's dependency pre-bundle cache can go stale; clear it with
  `rm -rf node_modules/.vite` and restart the dev server.
- **Importing a `.json`/asset behaves oddly** — Vite has built-in handling for JSON, CSS, and
  common asset types, but custom file types need an explicit plugin.

## Key differences from CRA to keep in mind

| | CRA (webpack) | Vite |
|---|---|---|
| Dev server startup | Bundles everything first — slow on large apps | No bundling — near-instant |
| Env vars | `process.env.REACT_APP_*` | `import.meta.env.VITE_*` |
| Static assets | `public/` folder + `%PUBLIC_URL%` | `public/` folder, referenced as `/asset.png` |
| Config | `webpack.config.js` (often hidden, needs eject) | `vite.config.js`, plain and visible |
| Production bundler | webpack | Rollup |
