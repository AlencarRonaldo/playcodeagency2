'use client'

import { 
  AudioTrack, 
  AudioPreferences, 
  AudioContextState as AudioCtx, 
  PlayingTrack, 
  AudioManagerState,
  AudioEventType 
} from './types'
import { AUDIO_TRACKS, PRELOAD_TRACKS } from './tracks'
import { audioSynthesizer } from './synthesizer'

const STORAGE_KEY = 'playcode_audio_preferences'
const AUDIO_VERSION = '1.0'

export class AudioManager {
  private state: AudioManagerState
  private audioContext: AudioCtx
  private eventListeners: Map<AudioEventType, Set<(data?: unknown) => void>> = new Map()
  private fadeIntervals: Map<string, number> = new Map()

  constructor() {
    this.state = {
      isInitialized: false,
      currentMusic: null,
      preferences: this.loadPreferences(),
      loadedTracks: new Map(),
      playingTracks: new Map(),
      isUserInteracted: false
    }

    this.audioContext = {
      audioContext: null,
      masterGainNode: null,
      musicGainNode: null,
      sfxGainNode: null,
      initialized: false
    }

    this.setupEventListeners()
  }

  private loadPreferences(): AudioPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.version === AUDIO_VERSION) {
          return {
            masterVolume: data.masterVolume ?? 0.7,
            musicVolume: data.musicVolume ?? 0.6,
            sfxVolume: data.sfxVolume ?? 0.8,
            musicEnabled: data.musicEnabled ?? true,
            sfxEnabled: data.sfxEnabled ?? true,
            audioQuality: data.audioQuality ?? 'medium',
            reducedMotion: data.reducedMotion ?? false
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load audio preferences:', error)
    }

    return {
      masterVolume: 0.7,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      musicEnabled: true,
      sfxEnabled: true,
      audioQuality: 'medium',
      reducedMotion: false
    }
  }

  private savePreferences(): void {
    try {
      const dataToSave = {
        ...this.state.preferences,
        version: AUDIO_VERSION,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Failed to save audio preferences:', error)
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // User interaction detection for autoplay policies
    const handleFirstInteraction = () => {
      this.state.isUserInteracted = true
      this.initializeAudioContext()
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    // Page visibility for pause/resume
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllMusic()
      } else if (this.state.currentMusic && this.state.preferences.musicEnabled) {
        this.resumeMusic()
      }
    })
  }

  private async initializeAudioContext(): Promise<void> {
    if (this.audioContext.initialized || typeof window === 'undefined') return

    try {
      // Create Web Audio Context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioContext.audioContext = new AudioContextClass()

      // Create gain nodes for volume control
      this.audioContext.masterGainNode = this.audioContext.audioContext.createGain()
      this.audioContext.musicGainNode = this.audioContext.audioContext.createGain()
      this.audioContext.sfxGainNode = this.audioContext.audioContext.createGain()

      // Connect gain nodes
      this.audioContext.musicGainNode.connect(this.audioContext.masterGainNode)
      this.audioContext.sfxGainNode.connect(this.audioContext.masterGainNode)
      this.audioContext.masterGainNode.connect(this.audioContext.audioContext.destination)

      // Set initial volumes
      this.updateVolumeNodes()

      this.audioContext.initialized = true
      this.state.isInitialized = true

      // Start preloading
      this.preloadTracks()

      this.emit('audio_initialized')
      console.log('🎵 Audio system initialized')

    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  private updateVolumeNodes(): void {
    if (!this.audioContext.audioContext) return

    const { masterVolume, musicVolume, sfxVolume, musicEnabled, sfxEnabled } = this.state.preferences

    if (this.audioContext.masterGainNode) {
      this.audioContext.masterGainNode.gain.value = masterVolume
    }

    if (this.audioContext.musicGainNode) {
      this.audioContext.musicGainNode.gain.value = musicEnabled ? musicVolume : 0
    }

    if (this.audioContext.sfxGainNode) {
      this.audioContext.sfxGainNode.gain.value = sfxEnabled ? sfxVolume : 0
    }
  }

  private async preloadTracks(): Promise<void> {
    const preloadPromises = PRELOAD_TRACKS.map(track => this.loadTrack(track))
    
    try {
      await Promise.allSettled(preloadPromises)
      console.log(`🎵 Preloaded ${PRELOAD_TRACKS.length} audio tracks`)
    } catch (error) {
      console.warn('Some tracks failed to preload:', error)
    }
  }

  private async loadTrack(track: AudioTrack): Promise<HTMLAudioElement> {
    if (this.state.loadedTracks.has(track.id)) {
      return this.state.loadedTracks.get(track.id)!
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.crossOrigin = 'anonymous'

      const urls = Array.isArray(track.url) ? track.url : [track.url]
      let currentUrlIndex = 0

      const tryNextUrl = () => {
        if (currentUrlIndex >= urls.length) {
          console.log(`🎵 Using synthesizer fallback for track: ${track.id}`)
          
          // Instead of rejecting, mark as synthesizer track
          const synthAudio = new Audio()
          synthAudio.dataset.useSynthesizer = 'true'
          synthAudio.dataset.trackId = track.id
          
          this.state.loadedTracks.set(track.id, synthAudio)
          resolve(synthAudio)
          return
        }

        const currentUrl = urls[currentUrlIndex]
        
        const onLoad = () => {
          // Check if audio file has actual content
          if (audio.duration === 0) {
            console.log(`🎵 Empty audio file detected for ${track.id}, using synthesizer`)
            currentUrlIndex++
            tryNextUrl()
            return
          }
          
          this.state.loadedTracks.set(track.id, audio)
          audio.removeEventListener('canplaythrough', onLoad)
          audio.removeEventListener('error', onError)
          console.log(`✅ Loaded audio: ${track.name} (${currentUrl.split('/').pop()})`)
          resolve(audio)
        }

        const onError = () => {
          audio.removeEventListener('canplaythrough', onLoad)
          audio.removeEventListener('error', onError)
          console.log(`🎵 Trying fallback for ${currentUrl.split('/').pop()}...`)
          currentUrlIndex++
          tryNextUrl()
        }

        audio.addEventListener('canplaythrough', onLoad)
        audio.addEventListener('error', onError)
        audio.src = currentUrl
      }

      tryNextUrl()
    })
  }

  // Synthesizer fallback mapping
  private playTrackWithSynthesizer(trackId: string): void {
    if (!audioSynthesizer) return

    // Map track IDs to synthesizer methods
    const synthMap: Record<string, () => void> = {
      // UI Sounds
      'ui_click_primary': () => audioSynthesizer?.playClickSound(true),
      'ui_click_secondary': () => audioSynthesizer?.playClickSound(false),
      'ui_hover': () => audioSynthesizer?.playHoverSound(),
      'ui_navigation': () => audioSynthesizer?.playClickSound(false),
      
      // System Sounds
      'system_boot': () => audioSynthesizer?.playBootSound(),
      'system_error': () => audioSynthesizer?.playErrorSound(),
      'system_notification': () => audioSynthesizer?.playNotificationSound(),
      'system_chatbot': () => audioSynthesizer?.playNotificationSound(),
      
      // Gaming Sounds
      'gaming_powerup': () => audioSynthesizer?.playXPSound(),
      'gaming_level_up': () => audioSynthesizer?.playLevelUpSound(),
      'gaming_xp_gain': () => audioSynthesizer?.playXPSound(),
      'gaming_konami': () => audioSynthesizer?.playBootSound(),
      
      // Achievement Sounds
      'achievement_unlock_common': () => audioSynthesizer?.playAchievementSound('common'),
      'achievement_unlock_rare': () => audioSynthesizer?.playAchievementSound('rare'),
      'achievement_unlock_epic': () => audioSynthesizer?.playAchievementSound('epic'),
      'achievement_unlock_legendary': () => audioSynthesizer?.playAchievementSound('legendary'),
    }

    const synthMethod = synthMap[trackId]
    if (synthMethod) {
      synthMethod()
    } else {
      // Default fallback sound
      audioSynthesizer.playClickSound(false)
    }
  }

  // Public API Methods
  public async playMusic(trackId: string, fadeIn: boolean = true): Promise<void> {
    if (!this.state.isUserInteracted) {
      console.warn('Cannot play music before user interaction')
      return
    }

    const track = AUDIO_TRACKS[trackId]
    if (!track || track.category !== 'music') {
      console.warn(`Music track not found: ${trackId}`)
      return
    }

    // Stop current music
    if (this.state.currentMusic) {
      await this.stopMusic(true)
    }

    try {
      const audio = await this.loadTrack(track)
      
      // Check if this should use synthesizer fallback
      if (audio.dataset.useSynthesizer === 'true') {
        console.log(`🎺 Using synthesizer for music: ${track.name}`)
        
        // Use synthesizer for ambient background
        if (audioSynthesizer && trackId.includes('ambient')) {
          audioSynthesizer.startAmbientLoop()
        }
        
        // Create a mock playing track for consistency
        const playingTrack: PlayingTrack = {
          id: trackId,
          audioElement: audio,
          source: undefined,
          gainNode: undefined,
          startTime: Date.now(),
          category: 'music'
        }

        this.state.playingTracks.set(trackId, playingTrack)
        this.state.currentMusic = trackId
        this.emit('music_started', { trackId })
        return
      }

      // Setup audio element
      audio.loop = track.loop ?? false
      audio.volume = fadeIn ? 0 : (track.volume ?? 0.5)

      // Create audio source and gain node for Web Audio API
      let source: MediaElementAudioSourceNode | undefined
      let gainNode: GainNode | undefined

      if (this.audioContext.audioContext && this.audioContext.musicGainNode) {
        try {
          source = this.audioContext.audioContext.createMediaElementSource(audio)
          gainNode = this.audioContext.audioContext.createGain()
          
          source.connect(gainNode)
          gainNode.connect(this.audioContext.musicGainNode)
          
          gainNode.gain.value = track.volume ?? 0.5
        } catch (error) {
          // Fallback to regular HTML5 audio if Web Audio fails
          console.warn('Web Audio API failed, using HTML5 audio:', error)
        }
      }

      // Start playing
      await audio.play()

      // Store playing track
      const playingTrack: PlayingTrack = {
        id: trackId,
        audioElement: audio,
        source,
        gainNode,
        startTime: Date.now(),
        category: 'music'
      }

      this.state.playingTracks.set(trackId, playingTrack)
      this.state.currentMusic = trackId

      // Fade in if requested
      if (fadeIn) {
        this.fadeIn(audio, track.volume ?? 0.5, 1000)
      }

      this.emit('music_started', { trackId })
      console.log(`🎵 Playing music: ${track.name}`)

    } catch (error) {
      console.error(`Failed to play music ${trackId}:`, error)
    }
  }

  public async playSFX(trackId: string): Promise<void> {
    if (!this.state.preferences.sfxEnabled || !this.state.isUserInteracted) {
      return
    }

    const track = AUDIO_TRACKS[trackId]
    if (!track || track.category !== 'sfx') {
      console.warn(`SFX track not found: ${trackId}`)
      return
    }

    try {
      const audio = await this.loadTrack(track)
      
      // Check if this should use synthesizer fallback
      if (audio.dataset.useSynthesizer === 'true') {
        console.log(`🎺 Using synthesizer for SFX: ${track.name}`)
        
        if (audioSynthesizer) {
          // Map track IDs to synthesizer methods
          this.playTrackWithSynthesizer(trackId)
        }
        
        this.emit('sfx_played', { trackId })
        return
      }

      // Clone audio for multiple simultaneous plays
      const audioClone = audio.cloneNode() as HTMLAudioElement
      audioClone.volume = (track.volume ?? 0.5) * this.state.preferences.sfxVolume * this.state.preferences.masterVolume

      // Create unique ID for this play instance
      const instanceId = `${trackId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Setup Web Audio if available
      let source: MediaElementAudioSourceNode | undefined
      let gainNode: GainNode | undefined

      if (this.audioContext.audioContext && this.audioContext.sfxGainNode) {
        try {
          source = this.audioContext.audioContext.createMediaElementSource(audioClone)
          gainNode = this.audioContext.audioContext.createGain()
          
          source.connect(gainNode)
          gainNode.connect(this.audioContext.sfxGainNode)
          
          gainNode.gain.value = track.volume ?? 0.5
        } catch (error) {
          // Fallback to regular HTML5 audio
          console.warn('Web Audio API failed for SFX, using HTML5 audio:', error)
        }
      }

      // Auto-cleanup when finished
      const cleanup = () => {
        this.state.playingTracks.delete(instanceId)
        audioClone.removeEventListener('ended', cleanup)
        audioClone.removeEventListener('error', cleanup)
      }

      audioClone.addEventListener('ended', cleanup)
      audioClone.addEventListener('error', cleanup)

      // Store playing track
      const playingTrack: PlayingTrack = {
        id: instanceId,
        audioElement: audioClone,
        source,
        gainNode,
        startTime: Date.now(),
        category: 'sfx'
      }

      this.state.playingTracks.set(instanceId, playingTrack)

      // Play
      await audioClone.play()

      this.emit('sfx_played', { trackId })

    } catch (error) {
      console.error(`Failed to play SFX ${trackId}:`, error)
    }
  }

  public async stopMusic(fadeOut: boolean = true): Promise<void> {
    if (!this.state.currentMusic) return

    const playingTrack = this.state.playingTracks.get(this.state.currentMusic)
    if (!playingTrack) return

    if (fadeOut) {
      await this.fadeOut(playingTrack.audioElement, 500)
    }

    playingTrack.audioElement.pause()
    playingTrack.audioElement.currentTime = 0
    
    this.state.playingTracks.delete(this.state.currentMusic)
    
    const stoppedTrack = this.state.currentMusic
    this.state.currentMusic = null

    this.emit('music_stopped', { trackId: stoppedTrack })
  }

  public pauseAllMusic(): void {
    this.state.playingTracks.forEach(track => {
      if (track.category === 'music') {
        track.audioElement.pause()
      }
    })
  }

  public resumeMusic(): void {
    this.state.playingTracks.forEach(track => {
      if (track.category === 'music') {
        track.audioElement.play().catch(error => {
          console.warn('Failed to resume music:', error)
        })
      }
    })
  }

  private fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number): void {
    const steps = 50
    const stepDuration = duration / steps
    const volumeStep = targetVolume / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      audio.volume = Math.min(volumeStep * currentStep, targetVolume)
      
      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)

    this.fadeIntervals.set(audio.src, interval as unknown as number)
  }

  private fadeOut(audio: HTMLAudioElement, duration: number): Promise<void> {
    return new Promise(resolve => {
      const startVolume = audio.volume
      const steps = 50
      const stepDuration = duration / steps
      const volumeStep = startVolume / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0)
        
        if (currentStep >= steps || audio.volume <= 0) {
          clearInterval(interval)
          resolve()
        }
      }, stepDuration)

      this.fadeIntervals.set(audio.src, interval as unknown as number)
    })
  }

  // Volume and Preferences
  public setMasterVolume(volume: number): void {
    this.state.preferences.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumeNodes()
    this.savePreferences()
    this.emit('volume_changed', { type: 'master', volume })
  }

  public setMusicVolume(volume: number): void {
    this.state.preferences.musicVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumeNodes()
    this.savePreferences()
    this.emit('volume_changed', { type: 'music', volume })
  }

  public setSFXVolume(volume: number): void {
    this.state.preferences.sfxVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumeNodes()
    this.savePreferences()
    this.emit('volume_changed', { type: 'sfx', volume })
  }

  public toggleMusic(): void {
    this.state.preferences.musicEnabled = !this.state.preferences.musicEnabled
    this.updateVolumeNodes()
    this.savePreferences()
    this.emit('preferences_updated', { musicEnabled: this.state.preferences.musicEnabled })
  }

  public toggleSFX(): void {
    this.state.preferences.sfxEnabled = !this.state.preferences.sfxEnabled
    this.updateVolumeNodes()
    this.savePreferences()
    this.emit('preferences_updated', { sfxEnabled: this.state.preferences.sfxEnabled })
  }

  // Event System
  public on(event: AudioEventType, callback: (data?: unknown) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)

    return () => {
      this.eventListeners.get(event)?.delete(callback)
    }
  }

  private emit(event: AudioEventType, data?: unknown): void {
    this.eventListeners.get(event)?.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Audio event listener error for ${event}:`, error)
      }
    })
  }

  // Getters
  public getPreferences(): AudioPreferences {
    return { ...this.state.preferences }
  }

  public isInitialized(): boolean {
    return this.state.isInitialized
  }

  public getCurrentMusic(): string | null {
    return this.state.currentMusic
  }

  public getPlayingTracks(): PlayingTrack[] {
    return Array.from(this.state.playingTracks.values())
  }
}

// Singleton instance
export const audioManager = typeof window !== 'undefined' ? new AudioManager() : null