<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  volume: number
  muted: boolean
}>()

const emit = defineEmits<{
  'set-volume': [val: number]
  'toggle-mute': []
}>()

const level = computed(() => {
  if (props.muted || props.volume === 0) return 'mute'
  if (props.volume < 0.5) return 'low'
  return 'high'
})

const displayVolume = computed(() => props.muted ? 0 : props.volume * 100)

function onClick(e: MouseEvent) {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('set-volume', ratio)
}
</script>

<template>
  <div class="volume-control">
    <button
      class="icon-btn"
      @click="emit('toggle-mute')"
      :title="muted ? '取消静音' : '静音'"
      :aria-label="muted ? '取消静音' : '静音'"
    >
      <!-- mute -->
      <svg v-if="level === 'mute'" viewBox="0 0 24 24" width="17" height="17" fill="none">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <path d="M17 9l4 4m0-4l-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
      <!-- low -->
      <svg v-else-if="level === 'low'" viewBox="0 0 24 24" width="17" height="17" fill="none">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <path d="M15.5 8.5a4 4 0 010 7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" fill="none"/>
      </svg>
      <!-- high -->
      <svg v-else viewBox="0 0 24 24" width="17" height="17" fill="none">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <path d="M15.5 8.5a4 4 0 010 7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" fill="none"/>
        <path d="M19 6a8 8 0 010 12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" fill="none"/>
      </svg>
    </button>

    <div
      class="vol-bar"
      role="slider"
      :aria-valuenow="Math.round(displayVolume)"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="音量"
      tabindex="0"
      @click="onClick"
    >
      <div class="vol-track">
        <div class="vol-fill" :style="{ width: displayVolume + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.volume-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vol-bar {
  width: 76px;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;
}

.vol-bar:focus-visible .vol-track {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  border-radius: 2px;
}

.vol-track {
  width: 100%;
  height: 3px;
  background: var(--surface-3);
  border-radius: 2px;
  position: relative;
  transition: height 0.15s;
}

.vol-bar:hover .vol-track {
  height: 4px;
}

.vol-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold));
  border-radius: 2px;
  transition: width 0.08s linear;
}
</style>
