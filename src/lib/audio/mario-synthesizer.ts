'use client'

// Super Mario Bros Theme Synthesizer
// Generates the classic Mario theme using Web Audio API

interface Note {
  frequency: number
  duration: number
  rest?: boolean
}

// Musical note frequencies (Hz)
const NOTES = {
  'C4': 261.63,
  'Cs4': 277.18,
  'D4': 293.66,
  'Ds4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'Fs4': 369.99,
  'G4': 392.00,
  'Gs4': 415.30,
  'A4': 440.00,
  'As4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
  'Cs5': 554.37,
  'D5': 587.33,
  'Ds5': 622.25,
  'E5': 659.25,
  'F5': 698.46,
  'Fs5': 739.99,
  'G5': 783.99,
  'Gs5': 830.61,
  'A5': 880.00,
  'As5': 932.33,
  'B5': 987.77,
  'C6': 1046.50
}

// Super Mario Bros main theme melody (simplified version)
const MARIO_MELODY: Note[] = [
  { frequency: NOTES.E5, duration: 0.2 },
  { frequency: NOTES.E5, duration: 0.2 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.E5, duration: 0.2 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.C5, duration: 0.2 },
  { frequency: NOTES.E5, duration: 0.2 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.G5, duration: 0.4 },
  { frequency: 0, duration: 0.4, rest: true },
  { frequency: NOTES.G4, duration: 0.4 },
  { frequency: 0, duration: 0.4, rest: true },
  
  { frequency: NOTES.C5, duration: 0.3 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.G4, duration: 0.2 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.E4, duration: 0.3 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.A4, duration: 0.2 },
  { frequency: 0, duration: 0.1, rest: true },
  { frequency: NOTES.B4, duration: 0.2 },
  { frequency: 0, duration: 0.1, rest: true },
  { frequency: NOTES.As4, duration: 0.1 },
  { frequency: NOTES.A4, duration: 0.2 },
  
  { frequency: NOTES.G4, duration: 0.15 },
  { frequency: NOTES.E5, duration: 0.15 },
  { frequency: NOTES.G5, duration: 0.15 },
  { frequency: NOTES.A5, duration: 0.2 },
  { frequency: 0, duration: 0.1, rest: true },
  { frequency: NOTES.F5, duration: 0.1 },
  { frequency: NOTES.G5, duration: 0.2 },
  { frequency: 0, duration: 0.2, rest: true },
  { frequency: NOTES.E5, duration: 0.2 },
  { frequency: 0, duration: 0.1, rest: true },
  { frequency: NOTES.C5, duration: 0.1 },
  { frequency: NOTES.D5, duration: 0.1 },
  { frequency: NOTES.B4, duration: 0.3 }
]

class MarioSynthesizer {
  private audioContext: AudioContext | null = null
  private isPlaying = false
  private currentTimeout: NodeJS.Timeout | null = null
  private activeOscillators: OscillatorNode[] = []

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  async playNote(frequency: number, duration: number, isRest = false) {
    if (!this.audioContext || isRest || frequency === 0) {
      return new Promise(resolve => setTimeout(resolve, duration * 1000))
    }

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = 'square' // 8-bit sound style

    // Track active oscillators
    this.activeOscillators.push(oscillator)

    // Envelope for more authentic sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)

    // Remove from active list when done
    oscillator.onended = () => {
      const index = this.activeOscillators.indexOf(oscillator)
      if (index > -1) {
        this.activeOscillators.splice(index, 1)
      }
    }

    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }

  async playMarioTheme() {
    console.log('🎵 MarioSynthesizer: playMarioTheme called')
    
    // Stop any current playback first
    this.stop()
    
    try {
      await this.initialize()
      this.isPlaying = true
      console.log('🎵 MarioSynthesizer: Starting playback, isPlaying =', this.isPlaying)

      const playSequence = async () => {
        console.log('🎵 MarioSynthesizer: Playing sequence, isPlaying =', this.isPlaying)
        for (const note of MARIO_MELODY) {
          if (!this.isPlaying) {
            console.log('🎵 MarioSynthesizer: Stopped during sequence')
            break
          }
          await this.playNote(note.frequency, note.duration, note.rest)
        }
        
        // Loop the melody
        if (this.isPlaying) {
          console.log('🎵 MarioSynthesizer: Scheduling next loop')
          this.currentTimeout = setTimeout(playSequence, 500)
        }
      }

      playSequence()
    } catch (error) {
      console.error('🎵 MarioSynthesizer: Error in playMarioTheme:', error)
      this.isPlaying = false
    }
  }

  stop() {
    console.log('🎮 Mario Synthesizer: Stopping playback...')
    this.isPlaying = false
    
    // Clear any pending timeouts
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
      this.currentTimeout = null
    }
    
    // Stop all active oscillators immediately
    this.activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop()
        oscillator.disconnect()
      } catch (error) {
        // Oscillator may already be stopped
      }
    })
    this.activeOscillators = []
    
    console.log('🎮 Mario Synthesizer: Stopped successfully')
  }

  pause() {
    this.isPlaying = false
  }

  resume() {
    if (!this.isPlaying) {
      this.playMarioTheme()
    }
  }

  getIsPlaying() {
    return this.isPlaying
  }
}

export const marioSynthesizer = new MarioSynthesizer()