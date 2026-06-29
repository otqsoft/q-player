<script setup lang="ts">
import type { PlayMode } from '../types'

defineProps<{
  isPlaying: boolean
  playMode: PlayMode
}>()

const emit = defineEmits<{
  'toggle-play': []
  next: []
  prev: []
  'switch-mode': []
}>()

const modeLabel: Record<PlayMode, string> = {
  sequence: '顺序播放',
  loop: '单曲循环',
  shuffle: '随机播放',
}
</script>

<template>
  <div class="controls" role="group" aria-label="播放控制">
    <!-- 播放模式 -->
    <button
      class="icon-btn ctrl-sm"
      @click="emit('switch-mode')"
      :title="modeLabel[playMode]"
      :aria-label="modeLabel[playMode]"
      :class="{ 'mode-active': playMode !== 'sequence' }"
    >
      <!-- sequence -->
      <svg v-if="playMode === 'sequence'" viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
      <!-- loop -->
      <svg v-else-if="playMode === 'loop'" viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path d="M17 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        <path d="M7 22l-4-4 4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
      <!-- shuffle -->
      <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path d="M16 3h5v5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 20L21 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        <path d="M21 16v5h-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 15l6 6M4 4l5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- 上一首 -->
    <button class="icon-btn ctrl-md" @click="emit('prev')" title="上一首" aria-label="上一首">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M19 5l-8 7 8 7V5z" fill="currentColor"/>
        <rect x="5" y="5" width="2.5" height="14" rx="1.25" fill="currentColor"/>
      </svg>
    </button>

    <!-- 播放/暂停 -->
    <button
      class="play-btn"
      @click="emit('toggle-play')"
      :title="isPlaying ? '暂停' : '播放'"
      :aria-label="isPlaying ? '暂停' : '播放'"
    >
      <div class="play-btn-ring" aria-hidden="true"></div>
      <!-- pause -->
      <svg v-if="isPlaying" viewBox="0 0 24 24" width="22" height="22">
        <rect x="5.5" y="4" width="4" height="16" rx="2" fill="currentColor"/>
        <rect x="14.5" y="4" width="4" height="16" rx="2" fill="currentColor"/>
      </svg>
      <!-- play -->
      <svg v-else viewBox="0 0 24 24" width="22" height="22">
        <path d="M7 4.5v15l12-7.5L7 4.5z" fill="currentColor"/>
      </svg>
    </button>

    <!-- 下一首 -->
    <button class="icon-btn ctrl-md" @click="emit('next')" title="下一首" aria-label="下一首">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M5 5l8 7-8 7V5z" fill="currentColor"/>
        <rect x="16.5" y="5" width="2.5" height="14" rx="1.25" fill="currentColor"/>
      </svg>
    </button>

    <!-- 占位（保持对称） -->
    <div class="ctrl-sm" style="width:32px; height:32px;"></div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
}

.ctrl-sm {
  width: 32px;
  height: 32px;
}

.ctrl-md {
  width: 36px;
  height: 36px;
}

.mode-active {
  color: var(--gold) !important;
}

/* 播放按钮 */
.play-btn {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: var(--gold);
  color: var(--surface-0);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  margin: 0 8px;
  transition:
    transform 0.18s var(--ease-out-quart),
    box-shadow 0.18s var(--ease-out-quart),
    background 0.18s;
  box-shadow:
    0 0 0 0 var(--gold-glow),
    0 6px 20px var(--gold-glow);
  flex-shrink: 0;
}

.play-btn:hover {
  transform: scale(1.06);
  box-shadow:
    0 0 0 6px var(--gold-trace),
    0 8px 28px var(--gold-glow);
}

.play-btn:active {
  transform: scale(0.94);
}

.play-btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
}

/* 脉冲环 */
.play-btn-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid var(--gold-dim);
  opacity: 0.4;
  pointer-events: none;
}
</style>
