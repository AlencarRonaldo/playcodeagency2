'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PixelLogoHeroProps {
  className?: string
  enableMatrixEffect?: boolean
}

const PixelLogoHero: React.FC<PixelLogoHeroProps> = ({ 
  className = '',
  enableMatrixEffect = true
}) => {
  const [matrixChars, setMatrixChars] = useState<string[]>([])

  useEffect(() => {
    if (enableMatrixEffect) {
      // Generate random matrix characters
      const chars = Array.from({ length: 50 }, () => 
        String.fromCharCode(0x30A0 + Math.random() * 96)
      )
      setMatrixChars(chars)
    }
  }, [enableMatrixEffect])

  // Letras pixeladas grandes usando CSS art
  const renderPixelLetter = (letter: string, color: string, delay: number = 0) => {
    const pixelStyle = {
      fontFamily: 'monospace',
      fontWeight: 900,
      fontSize: '4rem',
      lineHeight: '1',
      textShadow: `
        2px 0px 0px currentColor,
        -2px 0px 0px currentColor,
        0px 2px 0px currentColor,
        0px -2px 0px currentColor,
        2px 2px 0px currentColor,
        -2px -2px 0px currentColor,
        2px -2px 0px currentColor,
        -2px 2px 0px currentColor,
        3px 3px 0px rgba(0,0,0,0.5)
      `,
      letterSpacing: '0.1em',
      WebkitTextStroke: '1px currentColor'
    }

    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.3, rotateY: 90 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotateY: 0,
        }}
        transition={{ 
          delay: delay * 0.1,
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{
          scale: 1.1,
          textShadow: `
            2px 0px 0px currentColor,
            -2px 0px 0px currentColor,
            0px 2px 0px currentColor,
            0px -2px 0px currentColor,
            4px 4px 0px #ff00ff,
            -4px -4px 0px #00ffff,
            6px 6px 0px rgba(0,0,0,0.3)
          `,
          transition: { duration: 0.3 }
        }}
        className={`inline-block ${color} select-none cursor-default`}
        style={pixelStyle}
      >
        {letter}
      </motion.span>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Matrix Background Effect */}
      {enableMatrixEffect && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {matrixChars.map((char, i) => (
            <motion.span
              key={i}
              className="absolute text-terminal-green text-sm font-mono"
              style={{
                left: `${(i * 2) % 100}%`,
                fontSize: `${8 + Math.random() * 4}px`
              }}
              animate={{
                y: ['-100vh', '100vh'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear'
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      )}

      {/* Main Logo */}
      <div className="relative z-10 text-center">
        {/* PLAYCODE */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {['P', 'L', 'A', 'Y', 'C', 'O', 'D', 'E'].map((letter, index) => 
              renderPixelLetter(letter, 'text-neon-cyan', index)
            )}
          </div>
        </motion.div>

        {/* Pixel Separator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center mb-4"
        >
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-gaming-purple"
                style={{
                  boxShadow: '0 0 4px currentColor'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* AGENCY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {['A', 'G', 'E', 'N', 'C', 'Y'].map((letter, index) => 
              renderPixelLetter(letter, 'text-magenta-power', index + 8)
            )}
          </div>
        </motion.div>

        {/* Animated Cursor */}
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-4 h-16 bg-laser-green"
            style={{
              boxShadow: '0 0 8px currentColor'
            }}
          />
        </motion.div>

        {/* Glitch Effect Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.1, 0],
            x: [0, -2, 2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  )
}

export default PixelLogoHero