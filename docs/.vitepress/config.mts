import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Auto-discovers folders/pages under docs/ so nav + sidebar update
// themselves as new topics and pages are added — no manual editing here.

const docsDir = fileURLToPath(new URL('..', import.meta.url))

const IGNORED = new Set(['.vitepress', 'public', 'node_modules'])

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function titleFromMarkdown(filePath: string, fallback: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)/m)
    if (match) return match[1].trim()
  } catch {
    // file missing/unreadable — fall back to the slug-derived title
  }
  return fallback
}

function listSections() {
  return fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !IGNORED.has(e.name))
    .map((e) => e.name)
    .sort()
}

function buildSidebarItems(dirPath: string, urlBase: string): any[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const items: any[] = []

  const folders = entries
    .filter((e) => e.isDirectory() && !IGNORED.has(e.name))
    .map((e) => e.name)
    .sort()

  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')
    .map((e) => e.name)
    .sort()

  for (const folder of folders) {
    const folderPath = path.join(dirPath, folder)
    const indexPath = path.join(folderPath, 'index.md')
    const hasIndex = fs.existsSync(indexPath)
    const children = buildSidebarItems(folderPath, `${urlBase}${folder}/`)

    items.push({
      text: hasIndex ? titleFromMarkdown(indexPath, titleCase(folder)) : titleCase(folder),
      link: hasIndex ? `${urlBase}${folder}/` : undefined,
      collapsed: true,
      items: children.length ? children : undefined,
    })
  }

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const slug = file.replace(/\.md$/, '')
    items.push({
      text: titleFromMarkdown(filePath, titleCase(slug)),
      link: `${urlBase}${slug}`,
    })
  }

  return items
}

function buildSidebar() {
  const sidebar: Record<string, any[]> = {}
  for (const section of listSections()) {
    sidebar[`/${section}/`] = buildSidebarItems(path.join(docsDir, section), `/${section}/`)
  }
  return sidebar
}

function buildNav() {
  return listSections().map((section) => {
    const indexPath = path.join(docsDir, section, 'index.md')
    const text = fs.existsSync(indexPath)
      ? titleFromMarkdown(indexPath, titleCase(section))
      : titleCase(section)
    return { text, link: `/${section}/` }
  })
}

export default defineConfig({
  title: 'Engineering Learning Base',
  description: 'Personal engineering knowledge base',
  base: '/Full-stack-learning/',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: buildNav(),
    sidebar: buildSidebar(),

    search: {
      provider: 'local',
    },

    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/venkatesan-jayasankar/Full-stack-learning' },
    ],

    editLink: {
      pattern:
        'https://github.com/venkatesan-jayasankar/Full-stack-learning/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Personal engineering knowledge base — built with VitePress',
    },
  },

  appearance: true,
})
