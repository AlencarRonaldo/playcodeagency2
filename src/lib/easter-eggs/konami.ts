'use client'

// Konami Code Easter Egg System
export class KonamiCode {
  private static instance: KonamiCode
  private sequence: string[] = []
  private konamiSequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ]
  private listeners: Set<() => void> = new Set()
  private isActive = false
  private timeoutId: NodeJS.Timeout | null = null

  private constructor() {
    this.initializeListeners()
  }

  public static getInstance(): KonamiCode {
    if (!KonamiCode.instance) {
      KonamiCode.instance = new KonamiCode()
    }
    return KonamiCode.instance
  }

  private initializeListeners(): void {
    if (typeof window === 'undefined') return

    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Reset timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    // Add current key to sequence
    this.sequence.push(event.code)

    // Keep only the last N keys (sequence length)
    if (this.sequence.length > this.konamiSequence.length) {
      this.sequence.shift()
    }

    // Check if sequence matches
    if (this.checkSequence()) {
      this.triggerKonami()
      this.sequence = [] // Reset sequence
    }

    // Reset sequence after 3 seconds of inactivity
    this.timeoutId = setTimeout(() => {
      this.sequence = []
    }, 3000) as NodeJS.Timeout
  }

  private checkSequence(): boolean {
    if (this.sequence.length !== this.konamiSequence.length) {
      return false
    }

    return this.sequence.every((key, index) => key === this.konamiSequence[index])
  }

  private triggerKonami(): void {
    if (this.isActive) return // Prevent multiple triggers

    this.isActive = true
    console.log('🎮 KONAMI CODE ACTIVATED!')
    
    // Notify all listeners
    this.listeners.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Konami callback error:', error)
      }
    })

    // Reset active state after animation
    setTimeout(() => {
      this.isActive = false
    }, 5000)
  }

  public onActivated(callback: () => void): () => void {
    this.listeners.add(callback)
    
    return () => {
      this.listeners.delete(callback)
    }
  }

  public isCurrentlyActive(): boolean {
    return this.isActive
  }

  public destroy(): void {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    }
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    
    this.listeners.clear()
  }
}

// Singleton instance
export const konamiCode = typeof window !== 'undefined' ? KonamiCode.getInstance() : null