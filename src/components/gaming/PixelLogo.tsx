'use client'

import { motion } from 'framer-motion'

interface PixelLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
}

const PixelLogo: React.FC<PixelLogoProps> = ({ 
  size = 'md', 
  animated = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const containerSizeClasses = {
    sm: 'gap-1',
    md: 'gap-2', 
    lg: 'gap-3',
    xl: 'gap-4'
  }

  // Fonte pixelada personalizada usando CSS
  const pixelFontStyle = {
    fontFamily: '"Courier New", monospace',
    fontWeight: 700,
    letterSpacing: '0.02em'
  }

  const pixelVariants = {
    normal: {
      scale: 1,
      textShadow: `
        1px 1px 0px rgba(0,0,0,0.5),
        0 0 5px rgba(0,212,255,0.25)
      `,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      textShadow: `
        2px 0px 0px currentColor,
        -2px 0px 0px currentColor,
        0px 2px 0px currentColor,
        0px -2px 0px currentColor,
        2px 2px 0px currentColor,
        -2px -2px 0px currentColor,
        2px -2px 0px currentColor,
        -2px 2px 0px currentColor,
        4px 4px 0px rgba(0,0,0,0.8),
        0 0 15px currentColor
      `,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const pixelVariantsMagenta = {
    normal: {
      scale: 1,
      textShadow: `
        1px 1px 0px rgba(0,0,0,0.5),
        0 0 5px rgba(255,20,147,0.25)
      `,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      textShadow: `
        2px 0px 0px currentColor,
        -2px 0px 0px currentColor,
        0px 2px 0px currentColor,
        0px -2px 0px currentColor,
        2px 2px 0px currentColor,
        -2px -2px 0px currentColor,
        2px -2px 0px currentColor,
        -2px 2px 0px currentColor,
        4px 4px 0px rgba(0,0,0,0.8),
        0 0 15px currentColor
      `,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* PlayCode */}
      <motion.div
        variants={animated ? pixelVariants : undefined}
        initial="normal"
        whileHover={animated ? "hover" : undefined}
        className={`${sizeClasses[size]} select-none text-left relative cursor-pointer`}
        style={{
          ...pixelFontStyle,
          color: '#00D4FF', // neon-cyan
          filter: 'drop-shadow(0 0 3px #00D4FF)'
        }}
      >
        PLAYCODE
      </motion.div>

      {/* Agency */}
      <motion.div
        variants={animated ? pixelVariantsMagenta : undefined}
        initial="normal"
        whileHover={animated ? "hover" : undefined}
        className={`${sizeClasses[size]} select-none text-left -mt-1 relative cursor-pointer`}
        style={{
          ...pixelFontStyle,
          color: '#FF1493', // magenta-power
          filter: 'drop-shadow(0 0 3px #FF1493)'
        }}
      >
        AGENCY
      </motion.div>

    </div>
  )
}

export default PixelLogo