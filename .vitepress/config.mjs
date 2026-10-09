import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import markdownItKatex from '@luogu-dev/markdown-it-katex'

const CATEGORIES = [
  { key: '学习', desc: '算法与数据结构学习笔记' },
  { key: '闲话', desc: '游记、杂谈与日常' },
  { key: '题解', desc: '各类题目题解' },
]

function listPosts(cat) {
  const dir = path.join('专栏', cat)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort((a, b) => a.localeCompare(b, 'zh-CN', { numeric: true }))
}

function makeItems(cat) {
  return listPosts(cat).map((f) => {
    const name = f.replace(/\.md$/, '')
    const text = cat === '题解' ? name.replace(/^题解[：:]\s*/, '') : name
    return { text, link: `/专栏/${cat}/${name}` }
  })
}

const sidebar = {}
for (const c of CATEGORIES) {
  sidebar[`/专栏/${c.key}/`] = [{ text: c.key, items: makeItems(c.key) }]
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'dvsfanjo 的博客',
  description: 'OI / 算法 / 题解 / 学习笔记',
  outDir: 'dist',
  markdown: {
    config: (md) => {
      md.use(markdownItKatex, { throwOnError: false })
    },
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      ...CATEGORIES.map((c) => ({ text: c.key, link: `/专栏/${c.key}/` })),
    ],
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/dvsfanjo' }],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
  },
})
