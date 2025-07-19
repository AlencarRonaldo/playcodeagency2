import { Achievement } from './types'

// Achievement Definitions - Gaming Focused
export const ACHIEVEMENTS: Record<string, Achievement> = {
  // Exploration Achievements
  first_contact: {
    id: 'first_contact',
    name: 'First Contact',
    description: 'Bem-vindo ao universo PlayCode! Sua jornada começou.',
    category: 'exploration',
    rarity: 'common',
    icon: '🌟',
    xp: 100,
    condition: {
      type: 'event',
      target: 'page_view'
    },
    unlocked: false
  },

  power_scout: {
    id: 'power_scout',
    name: 'Power Scout',
    description: 'Visualizou 5 power-ups diferentes. Conhecimento é poder!',
    category: 'exploration',
    rarity: 'common',
    icon: '🔍',
    xp: 150,
    condition: {
      type: 'counter',
      target: 'power_up_viewed',
      value: 5
    },
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },

  full_exploration: {
    id: 'full_exploration',
    name: 'Digital Explorer',
    description: 'Visitou todas as seções do site. Verdadeiro explorador!',
    category: 'exploration',
    rarity: 'rare',
    icon: '🗺️',
    xp: 300,
    condition: {
      type: 'sequence',
      target: ['home', 'servicos', 'planos', 'portfolio', 'sobre', 'contato']
    },
    unlocked: false,
    progress: 0,
    maxProgress: 6
  },

  // Interaction Achievements
  click_master: {
    id: 'click_master',
    name: 'Click Master',
    description: 'Realizou 50 cliques. Suas habilidades estão evoluindo!',
    category: 'interaction',
    rarity: 'common',
    icon: '🖱️',
    xp: 200,
    condition: {
      type: 'counter',
      target: 'click',
      value: 50
    },
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },

  power_collector: {
    id: 'power_collector',
    name: 'Power Collector',
    description: 'Selecionou 10 power-ups. Montando sua stack perfeita!',
    category: 'interaction',
    rarity: 'rare',
    icon: '⚡',
    xp: 400,
    condition: {
      type: 'counter',
      target: 'power_up_selected',
      value: 10
    },
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },

  chatbot_friend: {
    id: 'chatbot_friend',
    name: 'AI Companion',
    description: 'Teve 10 conversas com o PlayBot. Friendship is magic!',
    category: 'interaction',
    rarity: 'rare',
    icon: '🤖',
    xp: 350,
    condition: {
      type: 'counter',
      target: 'chatbot_message',
      value: 10
    },
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },

  // Mastery Achievements
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Navegação ultrarrápida detectada! Você é veloz como um raio.',
    category: 'mastery',
    rarity: 'epic',
    icon: '💨',
    xp: 500,
    condition: {
      type: 'event',
      target: 'fast_navigation'
    },
    unlocked: false
  },

  achievement_hunter: {
    id: 'achievement_hunter',
    name: 'Achievement Hunter',
    description: 'Desbloqueou 5 achievements. Você é um verdadeiro caçador!',
    category: 'mastery',
    rarity: 'epic',
    icon: '🏆',
    xp: 600,
    condition: {
      type: 'counter',
      target: 'achievement_unlocked',
      value: 5
    },
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },

  level_up_legend: {
    id: 'level_up_legend',
    name: 'Level Up Legend',
    description: 'Alcançou o level 10! Sua evolução é impressionante.',
    category: 'mastery',
    rarity: 'legendary',
    icon: '👑',
    xp: 1000,
    condition: {
      type: 'event',
      target: 'level_reached',
      value: 10
    },
    unlocked: false
  },

  // Secret Achievements
  konami_master: {
    id: 'konami_master',
    name: 'Konami Master',
    description: 'Descobriu o código secreto! 30 lives unlocked.',
    category: 'secret',
    rarity: 'legendary',
    icon: '🕹️',
    xp: 1500,
    condition: {
      type: 'sequence',
      target: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
    },
    unlocked: false,
    hidden: true
  },

  easter_egg_hunter: {
    id: 'easter_egg_hunter',
    name: 'Easter Egg Hunter',
    description: 'Encontrou um easter egg secreto! Você tem olhos de eagle.',
    category: 'secret',
    rarity: 'epic',
    icon: '🥚',
    xp: 750,
    condition: {
      type: 'event',
      target: 'easter_egg_found'
    },
    unlocked: false,
    hidden: true
  },

  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visitou o site entre 00:00 e 06:00. Verdadeiro gamer nocturno!',
    category: 'secret',
    rarity: 'rare',
    icon: '🦉',
    xp: 300,
    condition: {
      type: 'time',
      target: 'night_visit'
    },
    unlocked: false
  },

  // Social Achievements
  mission_starter: {
    id: 'mission_starter',
    name: 'Mission Starter',
    description: 'Enviou o formulário de contato. Sua missão começou!',
    category: 'social',
    rarity: 'rare',
    icon: '🚀',
    xp: 500,
    condition: {
      type: 'event',
      target: 'contact_form_submitted'
    },
    unlocked: false
  },

  social_sharer: {
    id: 'social_sharer',
    name: 'Social Sharer',
    description: 'Compartilhou o site nas redes sociais. Spreading the word!',
    category: 'social',
    rarity: 'rare',
    icon: '📱',
    xp: 400,
    condition: {
      type: 'event',
      target: 'social_share'
    },
    unlocked: false
  },

  // Time-based Achievements
  dedicated_visitor: {
    id: 'dedicated_visitor',
    name: 'Dedicated Visitor',
    description: 'Passou 10 minutos explorando o site. Dedication level: MAX!',
    category: 'exploration',
    rarity: 'rare',
    icon: '⏰',
    xp: 350,
    condition: {
      type: 'time',
      target: 'time_on_site',
      value: 600000 // 10 minutes in milliseconds
    },
    unlocked: false
  },

  comeback_hero: {
    id: 'comeback_hero',
    name: 'Comeback Hero',
    description: 'Retornou ao site 5 vezes. Welcome back, hero!',
    category: 'exploration',
    rarity: 'epic',
    icon: '🔄',
    xp: 600,
    condition: {
      type: 'counter',
      target: 'visit_count',
      value: 5
    },
    unlocked: false,
    progress: 0,
    maxProgress: 5
  }
}

// Achievement Categories Config
export const ACHIEVEMENT_CATEGORIES = {
  exploration: {
    name: 'Exploração',
    color: '#00FFFF',
    icon: '🗺️'
  },
  interaction: {
    name: 'Interação',
    color: '#FF00FF',
    icon: '🎮'
  },
  mastery: {
    name: 'Maestria',
    color: '#FFEA00',
    icon: '⭐'
  },
  secret: {
    name: 'Secreto',
    color: '#8B5CF6',
    icon: '🔐'
  },
  social: {
    name: 'Social',
    color: '#39FF14',
    icon: '👥'
  }
}

// Rarity Config
export const RARITY_CONFIG = {
  common: {
    name: 'Comum',
    color: '#FFFFFF',
    glow: 'rgba(255, 255, 255, 0.3)',
    multiplier: 1
  },
  rare: {
    name: 'Raro',
    color: '#00D4FF',
    glow: 'rgba(0, 212, 255, 0.4)',
    multiplier: 1.5
  },
  epic: {
    name: 'Épico',
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.5)',
    multiplier: 2
  },
  legendary: {
    name: 'Lendário',
    color: '#FFEA00',
    glow: 'rgba(255, 234, 0, 0.6)',
    multiplier: 3
  }
}