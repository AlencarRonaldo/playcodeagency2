// Audio System Types
export interface AudioTrack {
  id: string
  name: string
  url: string | string[] // Support multiple formats for fallback
  loop?: boolean
  volume?: number
  category: 'music' | 'sfx'
  preload?: boolean
}

export interface AudioPreferences {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  musicEnabled: boolean
  sfxEnabled: boolean
  audioQuality: 'low' | 'medium' | 'high'
  reducedMotion: boolean
}

export interface AudioContextState {
  audioContext: AudioContext | null
  masterGainNode: GainNode | null
  musicGainNode: GainNode | null
  sfxGainNode: GainNode | null
  initialized: boolean
}

export interface PlayingTrack {
  id: string
  audioElement: HTMLAudioElement
  source?: MediaElementAudioSourceNode
  gainNode?: GainNode
  startTime: number
  category: 'music' | 'sfx'
}

export interface AudioManagerState {
  isInitialized: boolean
  currentMusic: string | null
  preferences: AudioPreferences
  loadedTracks: Map<string, HTMLAudioElement>
  playingTracks: Map<string, PlayingTrack>
  isUserInteracted: boolean
}

export type AudioEventType = 
  | 'audio_initialized'
  | 'music_started'
  | 'music_stopped'
  | 'sfx_played'
  | 'volume_changed'
  | 'preferences_updated'