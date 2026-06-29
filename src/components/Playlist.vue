<script setup lang="ts">
import type { Track } from '../types'

defineProps<{
  tracks: Track[]
  currentIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="playlist">
    <div class="list-header">
      <span class="header-label">播放列表</span>
      <span class="header-count">{{ tracks.length }} 首</span>
    </div>

    <ul class="list-body" role="listbox" aria-label="播放列表">
      <li
        v-for="(track, idx) in tracks"
        :key="track.id"
        class="list-item"
        :class="{ 'is-active': idx === currentIndex }"
        role="option"
        :aria-selected="idx === currentIndex"
        :tabindex="idx === currentIndex ? 0 : -1"
        @click="emit('select', idx)"
        @keydown.enter="emit('select', idx)"
        @keydown.space.prevent="emit('select', idx)"
      >
        <!-- 序号 / 正在播放指示 -->
        <div class="item-num">
          <span v-if="idx !== currentIndex" class="num-text">{{ idx + 1 }}</span>
          <div v-else class="bars" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>

        <!-- 信息 -->
        <div class="item-info">
          <span class="item-title">{{ track.title }}</span>
          <span class="item-artist">{{ track.artist }}</span>
        </div>

        <!-- 活跃指示点 -->
        <div v-if="idx === currentIndex" class="active-dot" aria-hidden="true"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.playlist {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 头部 */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.header-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-lo);
}

.header-count {
  font-size: 11px;
  color: var(--text-lo);
  font-variant-numeric: tabular-nums;
}

/* 列表体 */
.list-body {
  list-style: none;
  overflow-y: auto;
  flex: 1;
  padding: 6px 0;
  scroll-behavior: smooth;
}

.list-body::-webkit-scrollbar {
  width: 3px;
}

.list-body::-webkit-scrollbar-track {
  background: transparent;
}

.list-body::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

.list-body::-webkit-scrollbar-thumb:hover {
  background: oklch(38% 0.02 50);
}

/* 列表项 */
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 0;
  transition: background 0.12s;
  position: relative;
  outline: none;
  border-left: 2px solid transparent;
}

.list-item:hover {
  background: var(--surface-2);
}

.list-item:focus-visible {
  background: var(--surface-2);
  border-left-color: var(--gold-dim);
}

.list-item.is-active {
  background: oklch(19% 0.025 55 / 0.8);
  border-left-color: var(--gold);
}

/* 序号区域 */
.item-num {
  width: 22px;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.num-text {
  font-size: 12px;
  color: var(--text-lo);
  font-variant-numeric: tabular-nums;
  transition: color 0.15s;
}

.list-item:hover .num-text {
  color: var(--text-mid);
}

/* 音乐柱动画 */
.bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 14px;
}

.bars span {
  display: block;
  width: 3px;
  background: var(--gold);
  border-radius: 1.5px;
  animation: bar-wave 0.9s ease-in-out infinite;
}

.bars span:nth-child(1) { height: 5px; animation-delay: 0s; }
.bars span:nth-child(2) { height: 10px; animation-delay: 0.18s; }
.bars span:nth-child(3) { height: 7px; animation-delay: 0.36s; }

@keyframes bar-wave {
  0%, 100% { transform: scaleY(0.4); }
  50%       { transform: scaleY(1); }
}

/* 曲目信息 */
.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 13px;
  color: var(--text-mid);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.12s;
  font-weight: 400;
}

.list-item:hover .item-title,
.list-item.is-active .item-title {
  color: var(--text-hi);
}

.list-item.is-active .item-title {
  color: var(--gold);
}

.item-artist {
  font-size: 11px;
  color: var(--text-lo);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 活跃点 */
.active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  flex-shrink: 0;
  box-shadow: 0 0 6px var(--gold-glow);
}

@media (prefers-reduced-motion: reduce) {
  .bars span {
    animation: none;
    height: 8px;
  }
}
</style>
