import { ref, computed } from 'vue'
import type { Track, PlayMode } from '../types'

const playlist = ref<Track[]>([])
const currentIndex = ref(-1)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const playMode = ref<PlayMode>('sequence')
let mediaEl: HTMLMediaElement | null = null

const currentTrack = computed(() =>
  currentIndex.value >= 0 ? playlist.value[currentIndex.value] : null
)

function bindMedia(el: HTMLMediaElement) {
  // 解绑旧元素
  if (mediaEl) {
    mediaEl.removeEventListener('timeupdate', onTimeUpdate)
    mediaEl.removeEventListener('loadedmetadata', onLoadedMetadata)
    mediaEl.removeEventListener('ended', onEnded)
  }
  mediaEl = el
  mediaEl.addEventListener('timeupdate', onTimeUpdate)
  mediaEl.addEventListener('loadedmetadata', onLoadedMetadata)
  mediaEl.addEventListener('ended', onEnded)
  mediaEl.volume = volume.value
  mediaEl.muted = isMuted.value
  // 如果已有曲目，设置src
  if (currentTrack.value) {
    mediaEl.src = currentTrack.value.src
  }
}

function setPlaylist(tracks: Track[], startIndex = 0) {
  playlist.value = tracks
  currentIndex.value = startIndex
  loadCurrent()
}

function loadCurrent() {
  const track = currentTrack.value
  if (!track || !mediaEl) return
  mediaEl.src = track.src
  mediaEl.load()
}

function play() {
  if (!currentTrack.value || !mediaEl) return
  mediaEl.play()
  isPlaying.value = true
}

function pause() {
  if (!mediaEl) return
  mediaEl.pause()
  isPlaying.value = false
}

function togglePlay() {
  isPlaying.value ? pause() : play()
}

function seek(time: number) {
  if (!mediaEl) return
  mediaEl.currentTime = time
  currentTime.value = time
}

function setVolume(val: number) {
  volume.value = Math.max(0, Math.min(1, val))
  if (mediaEl) mediaEl.volume = volume.value
  if (volume.value > 0) isMuted.value = false
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (mediaEl) mediaEl.muted = isMuted.value
}

function next() {
  if (playlist.value.length === 0) return
  if (playMode.value === 'shuffle') {
    let nextIdx = Math.floor(Math.random() * playlist.value.length)
    if (nextIdx === currentIndex.value && playlist.value.length > 1) {
      nextIdx = (nextIdx + 1) % playlist.value.length
    }
    currentIndex.value = nextIdx
  } else {
    currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  }
  loadCurrent()
  play()
}

function prev() {
  if (playlist.value.length === 0) return
  if (playMode.value === 'shuffle') {
    let prevIdx = Math.floor(Math.random() * playlist.value.length)
    if (prevIdx === currentIndex.value && playlist.value.length > 1) {
      prevIdx = (prevIdx + 1) % playlist.value.length
    }
    currentIndex.value = prevIdx
  } else {
    currentIndex.value =
      (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  }
  loadCurrent()
  play()
}

function switchPlayMode() {
  const modes: PlayMode[] = ['sequence', 'loop', 'shuffle']
  const idx = modes.indexOf(playMode.value)
  playMode.value = modes[(idx + 1) % modes.length]
}

function playTrack(index: number) {
  if (index < 0 || index >= playlist.value.length) return
  currentIndex.value = index
  loadCurrent()
  play()
}

// 事件处理
function onTimeUpdate() {
  if (mediaEl) currentTime.value = mediaEl.currentTime
}

function onLoadedMetadata() {
  if (mediaEl) duration.value = mediaEl.duration
}

function onEnded() {
  if (playMode.value === 'loop') {
    if (mediaEl) {
      mediaEl.currentTime = 0
      mediaEl.play()
    }
  } else {
    next()
  }
}

export function usePlayer() {
  return {
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
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    next,
    prev,
    switchPlayMode,
    playTrack,
  }
}
