import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Gaming Console Palette
        'playstation-blue': '#0070D1',
        'xbox-green': '#107C10',
        'nintendo-red': '#E60012',
        'gaming-purple': '#8B5CF6',
        'neon-cyan': '#00FFFF',
        'magenta-power': '#FF00FF',
        'controller-black': '#1A1A1A',
        'led-white': '#FFFFFF',
        
        // Gaming Accent Colors
        'neon-pink': '#FF1493',
        'cyber-orange': '#FF6B35',
        'electric-blue': '#00D4FF',
        'laser-green': '#39FF14',
        'plasma-yellow': '#FFEA00',
        'voltage-purple': '#9D4EDD',
        
        // Dark Gaming Backgrounds
        'deep-space': '#0A0A0F',
        'console-dark': '#1E1E2E',
        'hud-overlay': '#2A2A3A',
        'terminal-green': '#00FF41',
        
        // Gaming Gradients
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'exo': ['Exo 2', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        // Gaming Animations
        'glow': 'glow 2s ease-in-out infinite alternate',
        'circuit': 'circuit 3s linear infinite',
        'powerup': 'powerup 0.6s ease-out',
        'level-up': 'level-up 1s ease-out',
        'achievement': 'achievement 2s ease-out',
        'matrix-rain': 'matrix-rain 3s linear infinite',
        'console-boot': 'console-boot 2s ease-out',
        'hud-scan': 'hud-scan 1.5s ease-in-out infinite',
        'energy-pulse': 'energy-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.1s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            transform: 'scale(1.02)'
          },
        },
        circuit: {
          '0%': { 
            backgroundPosition: '0% 0%',
            opacity: '0.7'
          },
          '50%': { 
            backgroundPosition: '100% 100%',
            opacity: '1'
          },
          '100%': { 
            backgroundPosition: '0% 0%',
            opacity: '0.7'
          },
        },
        powerup: {
          '0%': { 
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)'
          },
          '50%': { 
            transform: 'scale(1.2) rotate(180deg)',
            filter: 'brightness(1.5)'
          },
          '100%': { 
            transform: 'scale(1) rotate(360deg)',
            filter: 'brightness(1)'
          },
        },
        'level-up': {
          '0%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1'
          },
          '50%': { 
            transform: 'translateY(-20px) scale(1.1)',
            opacity: '0.8'
          },
          '100%': { 
            transform: 'translateY(-40px) scale(1)',
            opacity: '0'
          },
        },
        achievement: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '10%': { 
            transform: 'translateX(0)',
            opacity: '1'
          },
          '90%': { 
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
        },
        'matrix-rain': {
          '0%': { 
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '10%': { 
            opacity: '1'
          },
          '90%': { 
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh)',
            opacity: '0'
          },
        },
        'console-boot': {
          '0%': { 
            width: '0%',
            opacity: '0'
          },
          '50%': { 
            opacity: '1'
          },
          '100%': { 
            width: '100%',
            opacity: '1'
          },
        },
        'hud-scan': {
          '0%, 100%': { 
            transform: 'translateY(0)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            opacity: '1'
          },
        },
        'energy-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor',
            opacity: '0.8'
          },
          '50%': { 
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor',
            opacity: '1'
          },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            opacity: '1',
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
          },
          '20%, 24%, 55%': {
            opacity: '0.4',
            textShadow: 'none'
          }
        },
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #0070D1, #8B5CF6, #00FFFF)',
        'gradient-power': 'linear-gradient(135deg, #107C10, #E60012, #FF00FF)',
        'gradient-circuit': 'linear-gradient(135deg, #1A1A1A, #0070D1, #8B5CF6)',
        'gradient-neon': 'linear-gradient(45deg, #00FFFF, #FF00FF, #FFEA00)',
        'gradient-console': 'linear-gradient(180deg, #0A0A0F, #1E1E2E, #2A2A3A)',
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'gaming': '0 8px 32px rgba(139, 92, 246, 0.3)',
        'console': '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 255, 0.2)',
      },
      backdropBlur: {
        'gaming': '20px',
      },
    },
  },
  plugins: [],
}

export default config