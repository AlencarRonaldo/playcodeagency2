import { AudioTrack } from './types'

// Audio Track Definitions
export const AUDIO_TRACKS: Record<string, AudioTrack> = {
  // Background Music - Multi-format support
  cyberpunk_ambient: {
    id: 'cyberpunk_ambient',
    name: 'Cyberpunk Ambient',
    url: ['/sounds/music/cyberpunk-ambient.ogg', '/sounds/music/cyberpunk-ambient.mp3'],
    loop: true,
    volume: 0.4,
    category: 'music',
    preload: true
  },

  cyberpunk_intense: {
    id: 'cyberpunk_intense', 
    name: 'Cyberpunk Intense',
    url: ['/sounds/music/cyberpunk-intense.ogg', '/sounds/music/cyberpunk-intense.mp3'],
    loop: true,
    volume: 0.5,
    category: 'music',
    preload: false
  },

  cyberpunk_chill: {
    id: 'cyberpunk_chill',
    name: 'Cyberpunk Chill',
    url: ['/sounds/music/cyberpunk-chill.ogg', '/sounds/music/cyberpunk-chill.mp3'], 
    loop: true,
    volume: 0.3,
    category: 'music',
    preload: false
  },

  mario_theme: {
    id: 'mario_theme',
    name: 'Super Mario Bros Theme',
    url: ['/sounds/music/mario-theme.mp3', '/sounds/music/mario-theme.ogg'],
    loop: true,
    volume: 0.4,
    category: 'music',
    preload: true
  },

  // UI Sound Effects - Gaming optimized
  click_primary: {
    id: 'click_primary',
    name: 'Cyberpunk Click Primary',
    url: ['/sounds/sfx/ui/click-primary.ogg', '/sounds/sfx/ui/click-primary.mp3'],
    volume: 0.6,
    category: 'sfx',
    preload: true
  },

  click_secondary: {
    id: 'click_secondary',
    name: 'Digital Click Secondary', 
    url: ['/sounds/sfx/ui/click-secondary.ogg', '/sounds/sfx/ui/click-secondary.mp3'],
    volume: 0.4,
    category: 'sfx',
    preload: true
  },

  hover_soft: {
    id: 'hover_soft',
    name: 'Holographic Hover',
    url: ['/sounds/sfx/ui/hover-soft.ogg', '/sounds/sfx/ui/hover-soft.mp3'],
    volume: 0.3,
    category: 'sfx',
    preload: true
  },

  navigation: {
    id: 'navigation',
    name: 'Interface Navigation',
    url: ['/sounds/sfx/ui/navigation.ogg', '/sounds/sfx/ui/navigation.mp3'],
    volume: 0.5,
    category: 'sfx',
    preload: true
  },

  // Achievement Sound Effects - Cyberpunk themed
  unlock_common: {
    id: 'unlock_common',
    name: 'Data Fragment Unlocked',
    url: ['/sounds/sfx/achievements/unlock-common.ogg', '/sounds/sfx/achievements/unlock-common.mp3'],
    volume: 0.7,
    category: 'sfx',
    preload: true
  },

  unlock_rare: {
    id: 'unlock_rare',
    name: 'Neural Link Established',
    url: ['/sounds/sfx/achievements/unlock-rare.ogg', '/sounds/sfx/achievements/unlock-rare.mp3'],
    volume: 0.8,
    category: 'sfx',
    preload: true
  },

  unlock_epic: {
    id: 'unlock_epic',
    name: 'Cybernet Breach',
    url: ['/sounds/sfx/achievements/unlock-epic.ogg', '/sounds/sfx/achievements/unlock-epic.mp3'],
    volume: 0.9,
    category: 'sfx',
    preload: true
  },

  unlock_legendary: {
    id: 'unlock_legendary',
    name: 'Matrix Override',
    url: ['/sounds/sfx/achievements/unlock-legendary.ogg', '/sounds/sfx/achievements/unlock-legendary.mp3'],
    volume: 1.0,
    category: 'sfx',
    preload: true
  },

  // Gaming Sound Effects - Cyberpunk gaming
  powerup_select: {
    id: 'powerup_select',
    name: 'Neural Implant Activated',
    url: ['/sounds/sfx/gaming/powerup-select.ogg', '/sounds/sfx/gaming/powerup-select.mp3'],
    volume: 0.6,
    category: 'sfx',
    preload: true
  },

  level_up: {
    id: 'level_up',
    name: 'System Upgrade Complete',
    url: ['/sounds/sfx/gaming/level-up.ogg', '/sounds/sfx/gaming/level-up.mp3'],
    volume: 0.8,
    category: 'sfx',
    preload: true
  },

  xp_gain: {
    id: 'xp_gain',
    name: 'Data Absorption',
    url: ['/sounds/sfx/gaming/xp-gain.ogg', '/sounds/sfx/gaming/xp-gain.mp3'],
    volume: 0.5,
    category: 'sfx',
    preload: true
  },

  konami_sequence: {
    id: 'konami_sequence',
    name: 'Cheat Code Activated',
    url: ['/sounds/sfx/gaming/konami-sequence.ogg', '/sounds/sfx/gaming/konami-sequence.mp3'],
    volume: 0.9,
    category: 'sfx',
    preload: false
  },

  // System Sound Effects - Cyberpunk system
  boot_complete: {
    id: 'boot_complete',
    name: 'Neural Network Online',
    url: ['/sounds/sfx/system/boot-complete.ogg', '/sounds/sfx/system/boot-complete.mp3'],
    volume: 0.7,
    category: 'sfx',
    preload: true
  },

  error: {
    id: 'error',
    name: 'System Malfunction',
    url: ['/sounds/sfx/system/error.ogg', '/sounds/sfx/system/error.mp3'],
    volume: 0.6,
    category: 'sfx',
    preload: true
  },

  notification: {
    id: 'notification',
    name: 'Incoming Data',
    url: ['/sounds/sfx/system/notification.ogg', '/sounds/sfx/system/notification.mp3'],
    volume: 0.5,
    category: 'sfx',
    preload: true
  },

  chatbot_beep: {
    id: 'chatbot_beep',
    name: 'AI Communication',
    url: ['/sounds/sfx/system/chatbot-beep.ogg', '/sounds/sfx/system/chatbot-beep.mp3'],
    volume: 0.4,
    category: 'sfx',
    preload: true
  }
}

// Audio Context Mapping
export const CONTEXT_MUSIC = {
  hero: 'mario_theme',
  powerups: 'mario_theme', 
  contact: 'mario_theme',
  chatbot: 'mario_theme',
  achievements: 'mario_theme',
  default: 'mario_theme'
} as const

// Achievement Sound Mapping
export const ACHIEVEMENT_SOUNDS = {
  common: 'unlock_common',
  rare: 'unlock_rare',
  epic: 'unlock_epic',
  legendary: 'unlock_legendary'
} as const

// UI Element Sound Mapping
export const UI_SOUNDS = {
  button_primary: 'click_primary',
  button_secondary: 'click_secondary', 
  power_up_select: 'powerup_select',
  navigation: 'navigation',
  hover: 'hover_soft',
  notification: 'notification',
  error: 'error',
  level_up: 'level_up',
  xp_gain: 'xp_gain',
  boot_complete: 'boot_complete',
  chatbot: 'chatbot_beep',
  konami: 'konami_sequence'
} as const

// Preload Priority (for performance)
export const PRELOAD_TRACKS = Object.values(AUDIO_TRACKS)
  .filter(track => track.preload)
  .sort((a, b) => {
    // Priority: SFX > Music, Common usage > Rare
    if (a.category !== b.category) {
      return a.category === 'sfx' ? -1 : 1
    }
    return 0
  })