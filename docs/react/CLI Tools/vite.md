# Vite

Vite is a build tool and dev server for modern frontend projects, including React. It replaced
Create React App (CRA) as the standard way to scaffold React apps because of its speed and
simplicity.

## Why Vite?

- **Instant dev server start** — Vite doesn't bundle your app on startup. It uses native ES
  modules in the browser and only compiles the file a route actually needs, so the server starts
  in milliseconds regardless of project size.
- **Fast Hot Module Replacement (HMR)** — when you save a file, only that module is re-compiled
  and swapped in the browser without a full page reload or losing component state.
- **Esbuild-powered pre-bundling** — dependencies in `node_modules` are pre-bundled with esbuild
  (written in Go), which is 10–100x faster than JavaScript-based bundlers.
- **Rollup for production builds** — when you build for production, Vite switches to Rollup,
  which produces smaller, more optimized bundles than webpack in most cases.
- **Simpler config** — sensible defaults out of the box (JSX, TypeScript, CSS Modules, static
  assets) without needing to eject or maintain a large webpack config.
- **CRA is deprecated** — Create React App is no longer actively maintained and the React docs no
  longer recommend it; Vite (or a framework like Next.js) is the current recommended path for a
  plain React SPA.

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

## Key differences from CRA to keep in mind

| | CRA (webpack) | Vite |
|---|---|---|
| Dev server startup | Bundles everything first — slow on large apps | No bundling — near-instant |
| Env vars | `process.env.REACT_APP_*` | `import.meta.env.VITE_*` |
| Static assets | `public/` folder + `%PUBLIC_URL%` | `public/` folder, referenced as `/asset.png` |
| Config | `webpack.config.js` (often hidden, needs eject) | `vite.config.js`, plain and visible |
| Production bundler | webpack | Rollup |
