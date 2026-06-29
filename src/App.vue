<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { usePlayer } from './composables/usePlayer'
import { formatTime } from './utils/format'
import { getTrackType } from './types'
import ProgressBar from './components/ProgressBar.vue'
import PlayerControls from './components/PlayerControls.vue'
import VolumeControl from './components/VolumeControl.vue'
import Playlist from './components/Playlist.vue'
import type { Track } from './types'
import logoUrl from './assets/logo.png'

const {
  playlist,
  currentIndex,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playMode,
  bindMedia,
  setPlaylist,
  togglePlay,
  seek,
  setVolume,
  toggleMute,
  next,
  prev,
  switchPlayMode,
  playTrack,
} = usePlayer()

const showPlaylist = ref(true)
const mediaRef = ref<HTMLVideoElement>()

const isVideo = computed(() =>
  currentTrack.value ? getTrackType(currentTrack.value) === 'video' : false
)

watch(mediaRef, (el) => {
  if (el) bindMedia(el)
})

onMounted(() => {
  if (mediaRef.value) bindMedia(mediaRef.value)
})

const demoTracks: Track[] = [
  { id: 1, title: '晨光微曦', artist: '自然之声', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: '星河漫步', artist: '夜空旋律', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: '海风轻语', artist: '蔚蓝乐章', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: '山林回响', artist: '自然之声', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 5, title: '月光奏鸣', artist: '夜空旋律', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 6, title: '自然风光', artist: '视频示例', type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
]

onMounted(() => {
  setPlaylist(demoTracks)
})
</script>

<template>
  <div class="player-app">
    <!-- 背景装饰层 -->
    <div class="bg-orb bg-orb--1" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--2" aria-hidden="true"></div>
    <div class="bg-grain" aria-hidden="true"></div>

    <div class="player-shell" :class="{ 'list-collapsed': !showPlaylist }">
      <!-- 左侧：封面 + 信息区 -->
      <div class="player-left">
        <!-- 封面 / 视频区域 -->
        <div class="artwork-wrap" :class="{ 'is-video': isVideo }">
          <video
            ref="mediaRef"
            class="video-el"
            :class="{ 'hidden': !isVideo }"
            preload="auto"
            playsinline
          />
          <div v-if="!isVideo" class="artwork-disc" :class="{ spinning: isPlaying }">
            <div class="disc-ring disc-ring--outer"></div>
            <div class="disc-ring disc-ring--mid"></div>
            <div class="disc-center">
              <img :src="logoUrl" alt="cover" />
            </div>
          </div>
          <!-- 播放状态光晕 -->
          <div v-if="isPlaying && !isVideo" class="artwork-glow" aria-hidden="true"></div>
        </div>

        <!-- 曲目信息 -->
        <div class="track-meta">
          <h1 class="track-name">{{ currentTrack?.title ?? '选择一首曲目' }}</h1>
          <p class="track-by">{{ currentTrack?.artist ?? '——' }}</p>
        </div>

        <!-- 进度 -->
        <div class="progress-wrap">
          <ProgressBar
            :current-time="currentTime"
            :duration="duration"
            @seek="seek"
          />
          <div class="time-row">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- 主控区 -->
        <PlayerControls
          :is-playing="isPlaying"
          :play-mode="playMode"
          @toggle-play="togglePlay"
          @next="next"
          @prev="prev"
          @switch-mode="switchPlayMode"
        />

        <!-- 底部工具 -->
        <div class="toolbar">
          <VolumeControl
            :volume="volume"
            :muted="isMuted"
            @set-volume="setVolume"
            @toggle-mute="toggleMute"
          />
          <button
            class="icon-btn list-toggle"
            :class="{ active: showPlaylist }"
            @click="showPlaylist = !showPlaylist"
            :title="showPlaylist ? '收起列表' : '展开列表'"
            :aria-label="showPlaylist ? '收起列表' : '展开列表'"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
              <path d="M4 6h16M4 12h10M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 右侧：播放列表 -->
      <Transition name="panel">
        <div v-if="showPlaylist" class="player-right">
          <Playlist
            :tracks="playlist"
            :current-index="currentIndex"
            @select="playTrack"
          />
        </div>
      </Transition>
    </div>

    <!-- 底部品牌签名 -->
    <footer class="player-footer">
      <span class="footer-brand">🥕 萝卜播放器</span>
      <span class="footer-dash">—</span>
      <span class="footer-tagline">用心做一个好看又好用的播放器</span>
      <span class="footer-dot">·</span>
      <span class="footer-credit">出品：<strong>Q-Quick</strong></span>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Amber-warm dark palette (OKLCH-inspired) */
  --gold:       oklch(72% 0.16 68);
  --gold-dim:   oklch(58% 0.12 68);
  --gold-glow:  oklch(72% 0.16 68 / 0.28);
  --gold-trace: oklch(72% 0.16 68 / 0.10);

  --surface-0:  oklch(11% 0.015 50);
  --surface-1:  oklch(15% 0.018 50);
  --surface-2:  oklch(19% 0.020 50);
  --surface-3:  oklch(24% 0.022 50);

  --text-hi:    oklch(94% 0.01 60);
  --text-mid:   oklch(70% 0.02 60);
  --text-lo:    oklch(48% 0.02 60);

  --border:     oklch(28% 0.02 50);

  --font-display: 'DM Serif Display', Georgia, serif;
  --font-ui:      'DM Sans', system-ui, sans-serif;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
}

html, body {
  height: 100%;
}

body {
  font-family: var(--font-ui);
  background: var(--surface-0);
  min-height: 100vh;
  color: var(--text-hi);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* 全局图标按钮 */
.icon-btn {
  background: none;
  border: none;
  color: var(--text-mid);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  line-height: 1;
}

.icon-btn:hover {
  color: var(--text-hi);
  background: var(--surface-3);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

.icon-btn.active {
  color: var(--gold);
}
</style>

<style scoped>
/* ── 整体容器 ─────────────────────────────── */
.player-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  isolation: isolate;
}

/* 背景装饰 */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  z-index: -1;
}

.bg-orb--1 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, oklch(55% 0.14 55 / 0.18) 0%, transparent 70%);
  top: -100px;
  left: -80px;
  animation: orb-drift 18s ease-in-out infinite alternate;
}

.bg-orb--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, oklch(42% 0.12 30 / 0.14) 0%, transparent 70%);
  bottom: -80px;
  right: -60px;
  animation: orb-drift 22s ease-in-out infinite alternate-reverse;
}

.bg-grain {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity: 0.6;
}

@keyframes orb-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(40px, 30px) scale(1.08); }
}

/* ── 主壳体 ─────────────────────────────── */
.player-shell {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 780px;
  background: var(--surface-1);
  border-radius: 20px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow:
    0 0 0 1px oklch(28% 0.02 50 / 0.5),
    0 24px 80px oklch(8% 0.01 50 / 0.7),
    0 4px 20px oklch(8% 0.01 50 / 0.5);
  position: relative;
  transition: max-width 0.32s var(--ease-out-expo);
}

/* 收起列表时壳体收缩至左侧宽度 */
.player-shell.list-collapsed {
  max-width: 340px;
}

/* 顶部金色细线 */
.player-shell::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--gold-dim) 30%,
    var(--gold) 50%,
    var(--gold-dim) 70%,
    transparent 100%
  );
  z-index: 1;
}

/* ── 左侧主体 ─────────────────────────────── */
.player-left {
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px 28px 24px;
}

/* 展开列表时左侧显示分隔线 */
.player-shell:not(.list-collapsed) .player-left {
  border-right: 1px solid var(--border);
}

/* ── 封面 / 视频区域 ─────────────────────────────── */
.artwork-wrap {
  position: relative;
  width: 190px;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.artwork-wrap.is-video {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.video-el {
  width: 100%;
  border-radius: 10px;
  background: #000;
  object-fit: contain;
  display: block;
}

.video-el.hidden {
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;
  overflow: hidden;
}

/* 黑胶唱片风格封面 */
.artwork-disc {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s var(--ease-out-quart);
}

.artwork-disc.spinning {
  animation: disc-spin 10s linear infinite;
}

@keyframes disc-spin {
  to { transform: rotate(360deg); }
}

.disc-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
}

.disc-ring--outer {
  inset: 0;
  background: radial-gradient(circle, var(--surface-2) 30%, var(--surface-0) 100%);
  border-color: var(--border);
  box-shadow: inset 0 0 40px oklch(8% 0.01 50 / 0.6);
}

.disc-ring--mid {
  inset: 20px;
  border-color: oklch(28% 0.025 55);
  background: transparent;
}

.disc-center {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--gold-dim);
  box-shadow:
    0 0 0 6px var(--surface-2),
    0 0 0 8px oklch(30% 0.025 55),
    0 0 20px var(--gold-glow);
  z-index: 1;
  position: relative;
  background: var(--surface-2);
  flex-shrink: 0;
}

.disc-center img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 播放光晕 */
.artwork-glow {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--gold-trace) 0%, transparent 70%);
  animation: glow-pulse 2.4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.05); }
}

/* ── 曲目信息 ─────────────────────────────── */
.track-meta {
  text-align: center;
  width: 100%;
}

.track-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  font-style: italic;
  color: var(--text-hi);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.track-by {
  font-size: 12px;
  font-weight: 500;
  color: var(--gold-dim);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 6px;
}

/* ── 进度区 ─────────────────────────────── */
.progress-wrap {
  width: 100%;
}

.time-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-lo);
  font-variant-numeric: tabular-nums;
  margin-top: 5px;
  letter-spacing: 0.04em;
}

/* ── 工具栏 ─────────────────────────────── */
.toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-toggle {
  position: relative;
}

/* ── 右侧播放列表 ─────────────────────────────── */
.player-right {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  background: var(--surface-0);
}

/* 过渡动画 */
.panel-enter-active {
  transition: all 0.32s var(--ease-out-expo);
}

.panel-leave-active {
  transition: all 0.22s var(--ease-out-quart);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(24px);
  flex-basis: 0 !important;
  max-width: 0;
}

/* ── 底部品牌签名 ─────────────────────────────── */
.player-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 11px;
  color: var(--text-lo);
  letter-spacing: 0.03em;
  user-select: none;
  white-space: nowrap;
  margin-top: 20px;
  padding-bottom: 4px;
}

.footer-brand {
  color: var(--gold-dim);
  font-weight: 600;
}

.footer-dash {
  color: oklch(38% 0.02 50);
}

.footer-tagline {
  color: var(--text-lo);
}

.footer-dot {
  color: oklch(38% 0.02 50);
  margin: 0 2px;
}

.footer-credit {
  color: var(--text-lo);
}

.footer-credit strong {
  font-weight: 600;
  color: var(--text-mid);
}

/* ── 响应式 ─────────────────────────────── */
@media (max-width: 640px) {
  .player-app {
    padding: 0;
    align-items: flex-start;
  }

  .player-shell {
    flex-direction: column;
    border-radius: 0;
    min-height: 100vh;
    border-left: none;
    border-right: none;
  }

  .player-left {
    flex: none;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 24px 20px 20px;
  }

  .player-right {
    flex: 1;
  }

  .panel-enter-from,
  .panel-leave-to {
    transform: translateY(16px);
    max-width: none;
    max-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .artwork-disc.spinning,
  .artwork-glow,
  .bg-orb--1,
  .bg-orb--2 {
    animation: none;
  }
}
</style>
