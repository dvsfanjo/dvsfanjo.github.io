# dvsfanjo 的博客

基于 [VitePress](https://vitepress.dev/) + 洛谷官方 KaTeX 插件 [@luogu-dev/markdown-it-katex](https://github.com/luogu-dev/markdown-it-katex) 搭建的个人博客，部署在 GitHub Pages（`dvsfanjo.github.io`）。

- **洛谷同款 Markdown**：markdown-it 内核
- **KaTeX 公式**：`$...$` 行内、`$$...$$` 块级，和洛谷渲染一致

## 目录结构

```
blog/
├── .vitepress/          # 站点配置与主题
│   ├── config.mjs       # 导航、侧栏、KaTeX 插件配置
│   └── theme/           # 主题（加载 KaTeX 样式）
├── 专栏/                # 博客内容（就是你的专栏）
│   ├── 学习/
│   ├── 闲话/
│   └── 题解/
├── index.md             # 首页
└── .github/workflows/   # 自动部署
```

## 本地运行

```bash
npm install
npm run dev      # 开发预览 http://localhost:5173
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

## 发布新文章

把 `.md` 文件放进对应分类文件夹（`专栏/学习`、`专栏/闲话`、`专栏/题解`），左侧目录会自动生成，无需改配置。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库 **`dvsfanjo/dvsfanjo.github.io`**（public）
2. 推送代码（见下方 Git 配置）
3. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**
4. 之后每次 `push` 到 `main` 分支都会自动构建并上线

## Git 配置（首次）

```bash
git config --global user.name "dvsfanjo"
git config --global user.email "你的邮箱@example.com"

git init
git add .
git commit -m "init blog"
git remote add origin https://github.com/dvsfanjo/dvsfanjo.github.io.git
git push -u origin main
```

> 推送时如需登录，Git 会弹窗走浏览器授权（首次配置 Git Credential Manager 后即可）。

## 关于洛谷导出的「转义」

从洛谷导出或复制的 Markdown 有时会带反斜杠转义（如 `\## 标题`、`$T\_0$`、`\[链接](...)`），直接渲染会显示成字面符号。可用以下脚本一键恢复成干净的洛谷写法（脚本会自动处理 HTML 实体与反斜杠）：

```bash
node normalize.mjs
```

脚本运行前会备份原文到 `.backup/`（该目录已加入 `.gitignore`，不会被上传）。
