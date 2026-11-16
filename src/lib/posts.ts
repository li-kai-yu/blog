import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)

export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingMinutes: number
  html: string
  toc: TocItem[]
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = token.info.trim().split(/\s+/)[0] || 'text'
  const language = hljs.getLanguage(info) ? info : ''
  const code = language
    ? hljs.highlight(token.content, { language, ignoreIllegals: true }).value
    : md.utils.escapeHtml(token.content)

  return `<div class="code-block">
  <div class="code-block__bar"><span>${md.utils.escapeHtml(info)}</span><span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
  <pre><code class="hljs${language ? ` language-${language}` : ''}">${code}</code></pre>
</div>`
}

md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  const href = token.attrGet('href') ?? ''
  if (/^https?:\/\//.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noreferrer noopener')
  }
  return self.renderToken(tokens, idx, options)
}

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 64)
}

function parseFrontmatter(raw: string) {
  const normalized = raw.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {} as Record<string, string>, body: normalized }

  const data: Record<string, string> = {}
  match[1].split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const separator = line.indexOf(':')
    if (separator < 0) return
    const key = line.slice(0, separator).trim()
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  })

  return { data, body: match[2] }
}

function estimateReadingMinutes(body: string) {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()|-]/g, ' ')
  const cjk = (plain.match(/[\u4e00-\u9fff]/g) ?? []).length
  const words = (plain.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length
  return Math.max(3, Math.round(cjk / 330 + words / 180))
}

function renderPost(body: string): { html: string; toc: TocItem[] } {
  const env = {}
  const tokens = md.parse(body, env)
  const used = new Map<string, number>()
  const toc: TocItem[] = []

  tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') return
    if (token.tag !== 'h2' && token.tag !== 'h3') return

    const inline = tokens[index + 1]
    const text =
      inline?.children
        ?.filter((child) => child.type === 'text' || child.type === 'code_inline')
        .map((child) => child.content)
        .join('') ??
      inline?.content ??
      ''

    const base = slugify(text) || `section-${toc.length + 1}`
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`

    token.attrSet('id', id)
    toc.push({ id, text, level: token.tag === 'h2' ? 2 : 3 })
  })

  return { html: md.renderer.render(tokens, md.options, env), toc }
}

const rawFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const posts: Post[] = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path
    const { data, body } = parseFrontmatter(raw)
    const { html, toc } = renderPost(body)

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ?? '2026-01-01',
      tags: (data.tags ?? '')
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean),
      readingMinutes: estimateReadingMinutes(body),
      html,
      toc,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPosts() {
  return posts
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export function getAllTags() {
  return Array.from(new Set(posts.flatMap((post) => post.tags)))
}

export function formatDate(date: string) {
  return date.replaceAll('-', '.')
}

export function formatDateCN(date: string) {
  const [year, month, day] = date.split('-')
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`
}
