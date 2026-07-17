# Full-stack Learning

A personal engineering knowledge base, built with [VitePress](https://vitepress.dev/). This
repository contains project infrastructure and folder scaffolding only — all learning content is
written by hand as topics are studied.

Live site: `https://venkatesan-jayasankar.github.io/Full-stack-learning/` (once Pages is enabled).

## Install

```bash
npm install
```

## Run locally

```bash
npm run docs:dev
```

Opens a dev server (default `http://localhost:5173`) with hot reload as you edit Markdown files.

Other scripts:

```bash
npm run docs:build     # production build to docs/.vitepress/dist
npm run docs:preview   # preview the production build locally
```

## Adding a new topic

Topics are just folders under `docs/`. To add a brand-new top-level subject (e.g. `nodejs/`):

1. Create the folder: `docs/nodejs/`
2. Add an `index.md` inside it, starting with an `# H1` title — that title becomes the nav/sidebar
   label automatically.
3. Restart `npm run docs:dev` so the new top-level section is picked up in the nav bar and sidebar
   (existing sections update live without a restart).

To add a subtopic folder under an existing section (e.g. `docs/react/new-topic/`), the same rules
apply — no restart needed if the parent already appears in the sidebar and you're only adding
pages inside an existing folder tree; a restart is only needed when a brand-new folder is
introduced.

## Adding a new Markdown page

Drop a `.md` file into the relevant folder, starting with an `# H1` title. It's picked up by the
sidebar automatically — no config changes required. For example:

```
docs/react/hooks/use-effect.md
```

## Folder structure

```text
docs/
  .vitepress/
    config.mts       # nav + sidebar are generated from the folders on disk
  index.md            # landing page
  react/
    fundamentals/ jsx/ components/ props/ state/ hooks/ routing/
    forms/ api/ performance/ testing/ projects/ interview/ mistakes/
  angular/
  backend/
  database/
  system-design/
  resources/
  daily-learning/
```

## Deployment

Deployment is automated via [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

- On every push to `main`, the workflow builds the site with `npm run docs:build` and deploys the
  output to GitHub Pages.
- In the repository settings, under **Pages**, set the source to **GitHub Actions** (one-time
  setup) for this to take effect.

## Future expansion

New subject areas (Node.js, NestJS, Python, AI, DevOps, Kubernetes, etc.) can be added the same
way — create a folder under `docs/`, add an `index.md`, and the nav/sidebar update themselves. No
architectural changes needed.
