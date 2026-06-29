<div align="center">
	<img src="public/logo.png">
    <h1>
        萝卜播放器 · Q-Player
    </h1>
    <p align="center">
    <img src="https://img.shields.io/badge/version-1.0.0-orange?style=flat-square" />
    <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" />
    <img src="https://img.shields.io/badge/license-MIT-orange?style=flat-square" />
	</p>
	<p>&nbsp;</p>
</div>
> 一款轻量、高颜值的网页音视频播放器，基于 Vue 3 + TypeScript 构建。

---

## ✨ 特性

- 🎵 **音频 & 视频双模式** — 自动识别媒体类型，无缝切换播放形式
- 🎨 **深邃琥珀主题** — 精心设计的暖棕黑 + 琥珀金配色，OKLCH 色彩空间，视觉均匀不刺眼
- 💿 **黑胶唱片封面** — 播放时旋转，配合金色光晕脉冲动效
- 📋 **侧边播放列表** — 可展开/收起，带音乐柱动画指示当前曲目
- 🔁 **多种播放模式** — 顺序 / 随机 / 单曲循环
- 🔊 **精细音量控制** — 滑块调节 + 一键静音
- ⌨️ **完整键盘支持** — 所有交互均可键盘操作，符合 WCAG AA 无障碍标准
- 📱 **响应式布局** — 移动端自动切换为纵向布局



## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm / npm / yarn

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（推荐）
pnpm install
```

### 本地开发

```bash
npm run dev
# 访问 http://localhost:5173
```

### 构建生产版本

```bash
npm run build
# 产物输出至 dist/
```

### 预览构建结果

```bash
npm run preview
```



## 🗂️ 项目结构

```
q-player/
├── src/
│   ├── App.vue                   # 根组件，布局与状态编排
│   ├── main.ts                   # 应用入口
│   ├── types.ts                  # Track 类型定义
│   ├── composables/
│   │   └── usePlayer.ts          # 播放器核心逻辑（响应式状态 + 控制）
│   ├── components/
│   │   ├── PlayerControls.vue    # 播放控制按钮组（上一首/播放暂停/下一首/模式）
│   │   ├── ProgressBar.vue       # 进度条（支持拖拽 seek）
│   │   ├── VolumeControl.vue     # 音量滑块 + 静音按钮
│   │   └── Playlist.vue          # 播放列表面板
│   └── utils/
│       └── format.ts             # 时间格式化工具
├── public/
│   └── logo.png                  # 默认封面图
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🎮 使用方式

### 加载自定义曲目

在 `App.vue` 中修改 `demoTracks` 数组即可替换播放内容：

```typescript
const myTracks: Track[] = [
  {
    id: 1,
    title: '我的歌曲',
    artist: '我的艺术家',
    src: 'https://example.com/song.mp3',
    // type: 'audio' | 'video'  — 可选，默认自动检测
  },
  {
    id: 2,
    title: '我的视频',
    artist: '影视',
    type: 'video',
    src: 'https://example.com/video.mp4',
  },
]
```

### Track 类型定义

```typescript
interface Track {
  id: number
  title: string
  artist: string
  src: string
  type?: 'audio' | 'video'  // 可选，不填则按文件后缀自动判断
}
```

---

## ⌨️ 键盘快捷键

| 按键 | 功能 |
|------|------|
| `Enter` / `Space` | 播放/暂停（焦点在播放按钮时）|
| `Tab` | 在控件间切换焦点 |
| `Enter` | 选中播放列表中的曲目 |
| 进度条 `←` / `→` | 快退/快进 5 秒 |

---

## 🎨 设计系统

### 色彩规范

| 变量 | 值 | 用途 |
|------|-----|------|
| `--gold` | `oklch(72% 0.16 68)` | 主色、强调色 |
| `--gold-dim` | `oklch(58% 0.12 68)` | 次级强调 |
| `--surface-0` | `oklch(11% 0.015 50)` | 页面背景 |
| `--surface-1` | `oklch(15% 0.018 50)` | 卡片底层 |
| `--surface-2` | `oklch(19% 0.020 50)` | 悬停层 |
| `--text-hi` | `oklch(94% 0.01 60)` | 主要文本 |
| `--text-mid` | `oklch(70% 0.02 60)` | 次要文本 |

### 字体

- **标题**: DM Serif Display (斜体)
- **UI 文本**: DM Sans

---

## ♿ 无障碍

- 所有交互元素均有 `aria-label` 描述
- 播放列表实现 `role="listbox"` + `aria-selected`
- `focus-visible` 焦点环，满足 WCAG 2.1 AA 对比度要求
- 遵守 `prefers-reduced-motion` 媒体查询，自动关闭动效

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [Vue 3](https://vuejs.org/) | ^3.5 | 响应式 UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | ^5.6 | 类型安全 |
| [Vite](https://vitejs.dev/) | ^6.0 | 构建工具 |

---

## 📄 许可证

[MIT](./LICENSE) © 2026 Q-Player Contributors

---

<div align="center">
  <sub>🥕 萝卜播放器 — 用心做一个好看又好用的播放器</sub>
</div>
