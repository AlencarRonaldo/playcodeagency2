// Audio Synthesizer - Generate cyberpunk sounds programmatically
// For when audio files are not available

export class AudioSynthesizer {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null

  constructor() {
    this.initializeContext()
  }

  private initializeContext() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioContext = new AudioContextClass()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.3
    } catch (error) {
      console.warn('Could not initialize AudioContext:', error)
    }
  }

  private ensureContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // Generate cyberpunk click sound
  playClickSound(primary: boolean = true) {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    // Cyberpunk click frequencies
    oscillator.frequency.setValueAtTime(primary ? 800 : 400, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(primary ? 200 : 100, this.audioContext.currentTime + 0.1)

    // Quick attack/decay
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

    oscillator.type = 'square'
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // Generate hover sound
  playHoverSound() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    // Soft hover frequency
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.05)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05)

    oscillator.type = 'sine'
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.05)
  }

  // Generate boot complete sound
  playBootSound() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    // Create a sequence of tones
    const frequencies = [440, 554, 659, 880]
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      const startTime = this.audioContext!.currentTime + index * 0.15
      
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05)
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15)

      oscillator.type = 'sawtooth'
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.15)
    })
  }

  // Generate level up sound
  playLevelUpSound() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    // Rising frequency for level up
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.5)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5)

    oscillator.type = 'triangle'
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.5)
  }

  // Generate XP gain sound
  playXPSound() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(659, this.audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.02)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1)

    oscillator.type = 'sine'
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // Generate achievement unlock sound
  playAchievementSound(rarity: 'common' | 'rare' | 'epic' | 'legendary') {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const rarityConfig: Record<string, { freq: number; duration: number; gain: number }> = {
      common: { freq: 440, duration: 0.3, gain: 0.2 },
      rare: { freq: 554, duration: 0.4, gain: 0.25 },
      epic: { freq: 659, duration: 0.5, gain: 0.3 },
      legendary: { freq: 880, duration: 0.7, gain: 0.35 }
    }

    const config = rarityConfig[rarity]
    if (!config) return

    // Create a harmonic achievement sound
    [1, 1.5, 2].forEach((multiplier, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      const freq = config.freq * multiplier
      const startTime = this.audioContext!.currentTime + index * 0.1
      
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(config.gain / (multiplier), startTime + 0.05)
      gainNode.gain.linearRampToValueAtTime(0, startTime + config.duration)

      oscillator.type = index === 0 ? 'triangle' : 'sine'
      oscillator.start(startTime)
      oscillator.stop(startTime + config.duration)
    })
  }

  // Generate notification sound
  playNotificationSound() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2)

    oscillator.type = 'square'
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }

  // Generate error sound
  playErrorSound() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3)

    oscillator.type = 'sawtooth'
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  // Generate ambient cyberpunk background
  startAmbientLoop() {
    if (!this.audioContext || !this.masterGain) return

    this.ensureContext()

    const playAmbientTone = () => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const filter = this.audioContext!.createBiquadFilter()
      
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.masterGain!)

      // Random frequency for ambient variety
      const baseFreq = 60 + Math.random() * 40
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext!.currentTime)
      
      // Low-pass filter for ambient feel
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, this.audioContext!.currentTime)
      
      // Very quiet ambient volume
      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext!.currentTime + 2)
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 8)

      oscillator.type = 'sine'
      oscillator.start(this.audioContext!.currentTime)
      oscillator.stop(this.audioContext!.currentTime + 8)

      // Schedule next ambient tone
      setTimeout(playAmbientTone, 5000 + Math.random() * 5000)
    }

    playAmbientTone()
  }

  // Set master volume
  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioContext!.currentTime)
    }
  }
}

// Singleton instance
export const audioSynthesizer = typeof window !== 'undefined' ? new AudioSynthesizer() : null