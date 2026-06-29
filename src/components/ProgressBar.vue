<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  currentTime: number
  duration: number
}>()

const emit = defineEmits<{
  seek: [time: number]
}>()

const progress = computed(() =>
  props.duration > 0 ? (props.currentTime / props.duration) * 100 : 0
)

const isDragging = ref(false)

function getRatioFromEvent(e: MouseEvent | Touch, el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
}

function onClick(e: MouseEvent) {
  const bar = e.currentTarget as HTMLElement
  emit('seek', getRatioFromEvent(e, bar) * props.duration)
}

function onMouseDown(e: MouseEvent) {
  isDragging.value = true
  const bar = e.currentTarget as HTMLElement

  const move = (ev: MouseEvent) => {
    emit('seek', getRatioFromEvent(ev, bar) * props.duration)
  }
  const up = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
  emit('seek', getRatioFromEvent(e, bar) * props.duration)
}
</script>

<template>
  <div
    class="progress-bar"
    role="slider"
    :aria-valuenow="Math.round(currentTime)"
    :aria-valuemin="0"
    :aria-valuemax="Math.round(duration)"
    aria-label="播放进度"
    tabindex="0"
    @click="onClick"
    @mousedown="onMouseDown"
  >
    <div class="track">
      <div class="fill" :style="{ width: progress + '%' }">
        <div class="fill-glow"></div>
      </div>
      <div class="thumb" :style="{ left: progress + '%' }" :class="{ dragging: isDragging }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0;
  outline: none;
  user-select: none;
}

.progress-bar:focus-visible .track {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  border-radius: 3px;
}

.track {
  width: 100%;
  height: 3px;
  background: var(--surface-3);
  border-radius: 3px;
  position: relative;
  transition: height 0.15s;
}

.progress-bar:hover .track {
  height: 5px;
}

.fill {
  height: 100%;
  background: var(--gold);
  border-radius: 3px;
  position: relative;
  transition: width 0.1s linear;
}

.fill-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 6px;
  background: radial-gradient(ellipse, var(--gold-glow) 0%, transparent 100%);
  pointer-events: none;
}

.thumb {
  position: absolute;
  top: 50%;
  width: 13px;
  height: 13px;
  background: var(--text-hi);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  box-shadow: 0 1px 6px oklch(8% 0.01 50 / 0.6);
  transition:
    left 0.1s linear,
    transform 0.15s var(--ease-out-quart),
    background 0.15s;
  pointer-events: none;
}

.progress-bar:hover .thumb,
.thumb.dragging {
  transform: translate(-50%, -50%) scale(1);
  background: var(--gold);
  box-shadow: 0 0 0 3px var(--gold-trace), 0 2px 8px var(--gold-glow);
}
</style>
