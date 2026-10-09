import fs from 'node:fs'
import path from 'node:path'

const root = '专栏'
const ESCAPED_RE = /\\[#_&*[\]~.\-]/
const UNESCAPE = new Set(['[', '_', '#', '&', '*', '.', '-', '{', '}', '~'])

// 单次解转义：先处理反斜杠转义，再解码 HTML 空白实体（顺序很重要：
// 有的文件里制表符实体被写成 \&#x09;，即 & 也被转义成 \&，必须先还原 &）
function unescapeOnce(s) {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '\\' && i + 1 < s.length) {
      const n = s[i + 1]
      if (n === '\\') {
        out += '\\' // 双反斜杠 -> 单反斜杠（LaTeX 命令、代码里的 \n 等）
        i++
      } else if (UNESCAPE.has(n)) {
        out += n // 转义的标点 -> 标点本身
        i++
      } else {
        out += '\\' // 孤立反斜杠（LaTeX 命令开头）-> 保留
      }
    } else {
      out += c
    }
  }
  return out.replace(/&#x09;/g, '\t').replace(/&#x20;/g, ' ')
}

function normalize(s) {
  if (!ESCAPED_RE.test(s)) return s // 干净文件（只有 \frac 这类 LaTeX），不动
  let r = unescapeOnce(s)
  // 部分文件被双重转义：再做一次，但跳过含 \begin{...}（行间对齐/矩阵，内部 \\ 换行不能动）的文件
  if (ESCAPED_RE.test(r) && !/\\begin\{/.test(r)) {
    r = unescapeOnce(r)
  }
  return r
}

const RENAMES = { '新建 文本文档.txt': 'NOIP游记.md' }

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

// 1) .txt -> .md
let renamed = 0
for (const p of walk(root)) {
  const base = path.basename(p)
  if (base in RENAMES) {
    fs.renameSync(p, path.join(path.dirname(p), RENAMES[base]))
    renamed++
  } else if (p.toLowerCase().endsWith('.txt')) {
    fs.renameSync(p, p.replace(/\.txt$/i, '.md'))
    renamed++
  }
}

// 2) 规范化
let changed = 0, clean = 0
for (const p of walk(root)) {
  if (!p.toLowerCase().endsWith('.md')) continue
  const s = fs.readFileSync(p, 'utf8')
  const r = normalize(s)
  if (r !== s) {
    fs.writeFileSync(p, r)
    changed++
  } else {
    clean++
  }
}

// 3) 复查残留
let leftovers = 0
for (const p of walk(root)) {
  if (!p.toLowerCase().endsWith('.md')) continue
  const s = fs.readFileSync(p, 'utf8')
  const bad = s.match(/\\[#_&*[\]~.\-]|&#x[0-9a-fA-F]+;|&#[0-9]+;/g)
  if (bad && bad.length) {
    leftovers += bad.length
    console.log(`LEFTOVER ${path.relative(root, p)}:`, [...new Set(bad)].join(' '))
  }
}

console.log(`\nrenamed: ${renamed}, normalized: ${changed}, clean: ${clean}, leftover-signatures: ${leftovers}`)
