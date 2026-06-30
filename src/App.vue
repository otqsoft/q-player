<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
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
const appRef = ref<HTMLElement>()
const isFullscreen = ref(false)

const isVideo = computed(() =>
  currentTrack.value ? getTrackType(currentTrack.value) === 'video' : false
)

// ── 全屏 ──
function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

async function toggleFullscreen() {
  if (!appRef.value) return
  try {
    if (!document.fullscreenElement) {
      await appRef.value.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch {
    // 浏览器不支持时静默
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

watch(mediaRef, (el) => {
  if (el) bindMedia(el)
})

onMounted(() => {
  if (mediaRef.value) bindMedia(mediaRef.value)
})

const demoTracks: Track[] = [
  { id: 1, title: '过火', artist: '经典老歌', src: 'http://music.163.com/song/media/outer/url?id=423406145.mp3' },
  { id: 2, title: '黄昏', artist: '经典老歌', src: 'http://music.163.com/song/media/outer/url?id=5255640.mp3' },
  { id: 3, title: '同桌的你', artist: '经典老歌', src: 'http://music.163.com/song/media/outer/url?id=28387594.mp3' },
  { id: 4, title: '挪威的森林', artist: '经典老歌', src: 'http://music.163.com/song/media/outer/url?id=5255631.mp3' },
  { id: 5, title: '倩女幽魂', artist: '经典老歌', src: 'http://music.163.com/song/media/outer/url?id=188175.mp3' },
  { id: 6, title: '建党100周年庆', artist: '视频示例', type: 'video', src: 'http://www.otqsoft.com/public/1.mp4' },
]

onMounted(() => {
  setPlaylist(demoTracks)
})
</script>

<template>
  <div class="player-app"
    :class="{
      'is-fullscreen': isFullscreen,
      'fs-video': isFullscreen && isVideo,
      'fs-audio': isFullscreen && !isVideo,
    }"
    ref="appRef">
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

          <!-- 全屏浮动控制栏 -->
          <div v-if="isVideo && isFullscreen" class="fs-overlay">
            <div class="fs-controls">
              <div class="fs-progress-wrap">
                <ProgressBar
                  :current-time="currentTime"
                  :duration="duration"
                  @seek="seek"
                />
              </div>
              <div class="fs-bar">
                <div class="fs-left">
                  <span class="fs-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                  <span class="fs-title">{{ currentTrack?.title }}</span>
                </div>
                <div class="fs-actions">
                  <button class="fs-btn" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
                    <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                    <svg v-else viewBox="0 0 24 24" width="20" height="20"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>
                  </button>
                  <VolumeControl
                    :volume="volume"
                    :muted="isMuted"
                    @set-volume="setVolume"
                    @toggle-mute="toggleMute"
                  />
                  <button class="fs-btn fs-btn--exit" @click="toggleFullscreen" aria-label="退出全屏">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 曲目信息 -->
        <div v-if="!(isFullscreen && isVideo)" class="track-meta">
          <h1 class="track-name">{{ currentTrack?.title ?? '选择一首曲目' }}</h1>
          <p class="track-by">{{ currentTrack?.artist ?? '——' }}</p>
        </div>

        <!-- 进度 -->
        <div v-if="!(isFullscreen && isVideo)" class="progress-wrap">
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
        <div v-if="!(isFullscreen && isVideo)" class="player-controls">
        <PlayerControls
          :is-playing="isPlaying"
          :play-mode="playMode"
          @toggle-play="togglePlay"
          @next="next"
          @prev="prev"
          @switch-mode="switchPlayMode"
        />
        </div>

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
          <button
            class="icon-btn fullscreen-btn"
            @click="toggleFullscreen"
            :title="isFullscreen ? '退出全屏' : '全屏播放'"
            :aria-label="isFullscreen ? '退出全屏' : '全屏播放'"
          >
            <!-- 进入全屏图标 -->
            <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="17" height="17" fill="none">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- 退出全屏图标 -->
            <svg v-else viewBox="0 0 24 24" width="17" height="17" fill="none">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
  max-width: 600px;
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
  max-width: 320px;
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
  cursor: default;
  transition: transform 0.4s var(--ease-out-quart);
}

.artwork-wrap:hover {
  transform: scale(1.04);
}

.artwork-wrap.is-video {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.artwork-wrap.is-video:hover {
  transform: none;
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

/* ── 黑胶唱片 ─────────────────────────────── */
.artwork-disc {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 8px 32px oklch(8% 0.01 50 / 0.55))
          drop-shadow(0 2px 6px oklch(8% 0.01 50 / 0.35));
  transition: filter 0.4s var(--ease-out-quart);
}

.artwork-wrap:hover .artwork-disc {
  filter: drop-shadow(0 12px 40px oklch(8% 0.01 50 / 0.65))
          drop-shadow(0 4px 10px oklch(8% 0.01 50 / 0.4));
}

.artwork-disc.spinning {
  animation: disc-spin 12s linear infinite;
}

/* 暂停时从旋转平滑过渡到静止 */
.artwork-disc:not(.spinning) {
  animation: none;
}

@keyframes disc-spin {
  to { transform: rotate(360deg); }
}

/* ── 唱片纹理圈 ─────────────────────────────── */
.disc-ring {
  position: absolute;
  border-radius: 50%;
}

/* 外圈 — 黑胶纹路 + 边缘 */
.disc-ring--outer {
  inset: 0;
  border: 1px solid var(--border);
  background:
    repeating-radial-gradient(
      circle at center,
      oklch(17% 0.014 50) 0px,
      oklch(18% 0.014 50) 1.5px,
      oklch(17.3% 0.014 50) 3px,
      oklch(17.8% 0.014 50) 4.5px
    );
  box-shadow: inset 0 0 50px oklch(6% 0.01 50 / 0.55);
}

/* 中圈 — 槽线引导环 */
.disc-ring--mid {
  inset: 22px;
  border: 1px solid oklch(28% 0.025 55 / 0.5);
  background: transparent;
  box-shadow: inset 0 0 6px oklch(8% 0.01 50 / 0.2);
}

/* ── 唱片表面光泽反射 ─────────────────────────────── */
.artwork-disc::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 315deg,
    transparent 0deg,
    oklch(100% 0 0 / 0.04) 10deg,
    oklch(100% 0 0 / 0.01) 25deg,
    transparent 50deg,
    transparent 180deg,
    oklch(100% 0 0 / 0.025) 210deg,
    oklch(100% 0 0 / 0.005) 230deg,
    transparent 270deg,
    transparent 360deg
  );
  pointer-events: none;
  z-index: 2;
}

/* ── 中心标签 ─────────────────────────────── */
.disc-center {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--gold-dim);
  box-shadow:
    0 0 0 5px var(--surface-2),
    0 0 0 6px oklch(25% 0.02 55 / 0.55),
    0 0 0 8px oklch(30% 0.025 55 / 0.3),
    0 0 24px var(--gold-glow);
  z-index: 3;
  position: relative;
  background: var(--surface-2);
  flex-shrink: 0;
  transition: box-shadow 0.4s var(--ease-out-quart);
}

.disc-center img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── 播放光晕环 ─────────────────────────────── */
.artwork-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(72% 0.16 68 / 0.18) 0%,
    oklch(65% 0.14 68 / 0.06) 35%,
    transparent 70%
  );
  animation: glow-breathe 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes glow-breathe {
  0%, 100% { opacity: 0.35; transform: scale(0.96); }
  50%       { opacity: 0.75; transform: scale(1.03); }
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
  flex: 0 0 260px;
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

/* ── 全屏模式 ─────────────────────────────── */
.player-app.is-fullscreen {
  padding: 0;
  background: #000 !important;
}

.player-app.is-fullscreen .bg-orb,
.player-app.is-fullscreen .bg-grain,
.player-app.is-fullscreen .player-footer {
  display: none;
}

.player-app.is-fullscreen .player-shell {
  max-width: none;
  width: 100%;
  height: 100vh;
  border: none;
  border-radius: 0;
  background: #000;
  box-shadow: none;
  overflow: visible;
}

.player-app.is-fullscreen .player-shell::before {
  display: none;
}

.player-app.is-fullscreen .player-left {
  flex: 1;
  border-right: none !important;
  padding: 0;
  justify-content: center;
  gap: 0;
  overflow: hidden;
}

.player-app.is-fullscreen .artwork-wrap {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
}

/* ── 视频全屏 ─────────────────────────────── */
.player-app.fs-video .toolbar,
.player-app.fs-video .player-right,
.player-app.fs-video .player-shell::before {
  display: none;
}

.player-app.fs-video .artwork-wrap.is-video {
  width: 100%;
  height: 100%;
}

.player-app.fs-video .video-el {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0;
  display: block !important;
}

.player-app.fs-video .video-el.hidden {
  width: 100% !important;
  height: 100% !important;
  position: relative;
  pointer-events: auto;
  overflow: visible;
}

/* ── 音频全屏 ─────────────────────────────── */
.player-app.fs-audio {
  background: var(--surface-0) !important;
}

/* 收起列表：卡片收窄至左侧内容宽度 */
.player-app.fs-audio .player-shell.list-collapsed {
  max-width: 380px;
  width: calc(100vw - 48px);
  height: auto;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface-1);
  box-shadow:
    0 0 0 1px oklch(28% 0.02 50 / 0.5),
    0 24px 80px oklch(8% 0.01 50 / 0.7);
}

/* 收起时左侧撑满壳体 */
.player-app.fs-audio .player-shell.list-collapsed .player-left {
  flex: 1;
}

/* 展开列表 */
.player-app.fs-audio .player-shell:not(.list-collapsed) {
  max-width: 600px;
  width: calc(100vw - 48px);
  height: auto;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface-1);
  box-shadow:
    0 0 0 1px oklch(28% 0.02 50 / 0.5),
    0 24px 80px oklch(8% 0.01 50 / 0.7);
}

.player-app.fs-audio .player-shell::before {
  display: block;
}

.player-app.fs-audio .player-left {
  flex: none;
  padding: 40px 36px 32px;
  gap: 24px;
}

/* 展开列表时左右列之间加分隔线 */
.player-app.fs-audio .player-shell:not(.list-collapsed) .player-left {
  border-right: 1px solid var(--border);
}

.player-app.fs-audio .artwork-wrap {
  width: 260px;
  height: 260px;
}

.player-app.fs-audio .artwork-disc {
  width: 260px;
  height: 260px;
}

.player-app.fs-audio .disc-center {
  width: 110px;
  height: 110px;
}

.player-app.fs-audio .track-name {
  font-size: 28px;
}

.player-app.fs-audio .track-by {
  font-size: 13px;
}

.player-app.fs-audio .progress-wrap {
  width: 100%;
}

.player-app.fs-audio .toolbar {
  width: 100%;
  display: flex;
}

/* 全屏浮动控制覆盖层 */
.fs-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
}

.fs-controls {
  pointer-events: auto;
  width: 100%;
  padding: 0 40px 20px;
  background: linear-gradient(to top, oklch(0% 0 0 / 0.65) 0%, transparent 100%);
}

.fs-progress-wrap {
  width: 100%;
  margin-bottom: 8px;
}

.fs-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.fs-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.fs-time {
  font-size: 13px;
  color: oklch(90% 0.01 60);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.fs-title {
  font-size: 14px;
  font-weight: 500;
  color: oklch(95% 0.01 60 / 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fs-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.fs-btn {
  background: oklch(20% 0.01 50 / 0.5);
  border: 1px solid oklch(40% 0.01 50 / 0.3);
  color: oklch(93% 0.01 60);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: background 0.15s, border-color 0.15s;
  line-height: 1;
}

.fs-btn:hover {
  background: oklch(30% 0.01 50 / 0.7);
  border-color: oklch(50% 0.01 50 / 0.4);
}

.fs-btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

.fs-btn--exit {
  margin-left: 6px;
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
  .bg-orb--2,
  .artwork-wrap {
    animation: none;
    transition: none;
  }
}
</style>
