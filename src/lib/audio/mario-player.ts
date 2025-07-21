'use client'

// Mario Music Player using real audio files
class MarioMusicPlayer {
  private audio: HTMLAudioElement | null = null
  private isPlaying = false
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      // Create audio element with Mario theme
      this.audio = new Audio()
      
      // Try to use a free 8-bit tune (copyright-free)
      // Note: You'll need to add a real Mario music file to public/sounds/music/
      this.audio.src = '/sounds/music/mario-theme.mp3'
      
      // Configure audio properties
      this.audio.loop = true
      this.audio.volume = 0.3
      this.audio.preload = 'auto'

      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        if (!this.audio) return reject(new Error('Audio element not created'))
        
        this.audio.addEventListener('canplaythrough', resolve, { once: true })
        this.audio.addEventListener('error', reject, { once: true })
        
        // Fallback timeout
        setTimeout(() => {
          console.log('🎵 Audio loading timeout, proceeding anyway')
          resolve(undefined)
        }, 3000)
      })

      this.isInitialized = true
      console.log('🎵 Mario music player initialized successfully')
    } catch (error) {
      console.log('🎵 Mario music player initialization failed:', error)
      // Fallback to Web Audio API synthesis if needed
      this.createFallbackAudio()
    }
  }

  private createFallbackAudio() {
    console.log('🎵 Creating fallback audio with Web Audio API')
    
    // Create a simple Mario-like tune using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const createTone = (frequency: number, duration: number, startTime: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, startTime)
      oscillator.type = 'square'
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    // Simplified Mario melody
    const melody = [
      { freq: 659.25, dur: 0.2 }, // E5
      { freq: 659.25, dur: 0.2 }, // E5
      { freq: 659.25, dur: 0.2 }, // E5
      { freq: 523.25, dur: 0.2 }, // C5
      { freq: 659.25, dur: 0.2 }, // E5
      { freq: 783.99, dur: 0.4 }, // G5
      { freq: 392.00, dur: 0.4 }  // G4
    ]

    this.playFallbackMelody = () => {
      if (!this.isPlaying) return
      
      let currentTime = audioContext.currentTime
      melody.forEach(note => {
        createTone(note.freq, note.dur, currentTime)
        currentTime += note.dur
      })
      
      // Loop after melody ends
      setTimeout(() => {
        if (this.isPlaying) {
          this.playFallbackMelody()
        }
      }, currentTime * 1000 - audioContext.currentTime * 1000 + 500)
    }

    this.isInitialized = true
  }

  private playFallbackMelody: (() => void) | null = null

  async play() {
    await this.initialize()
    
    if (this.isPlaying) return

    this.isPlaying = true
    console.log('🎵 Starting Mario music playback')

    try {
      if (this.audio) {
        await this.audio.play()
        console.log('🎵 Audio element playing successfully')
      } else if (this.playFallbackMelody) {
        this.playFallbackMelody()
        console.log('🎵 Fallback synthesis playing')
      }
    } catch (error) {
      console.log('🎵 Error playing audio:', error)
      this.isPlaying = false
    }
  }

  stop() {
    console.log('🎵 Stopping Mario music')
    this.isPlaying = false

    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
  }

  pause() {
    this.isPlaying = false
    if (this.audio) {
      this.audio.pause()
    }
  }

  resume() {
    if (!this.isPlaying && this.audio) {
      this.isPlaying = true
      this.audio.play().catch(console.error)
    }
  }

  getIsPlaying() {
    return this.isPlaying
  }

  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume))
    }
  }
}

export const marioMusicPlayer = new MarioMusicPlayer()