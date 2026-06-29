export interface Track {
  id: number
  title: string
  artist: string
  src: string
  cover?: string
  type?: 'audio' | 'video'
}

export type PlayMode = 'sequence' | 'loop' | 'shuffle'

const VIDEO_EXTS = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'm4v']

export function getTrackType(track: Track): 'audio' | 'video' {
  if (track.type) return track.type
  const ext = track.src.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
  return VIDEO_EXTS.includes(ext) ? 'video' : 'audio'
}
