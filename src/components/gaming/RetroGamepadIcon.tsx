'use client'

import { motion } from 'framer-motion'

interface RetroGamepadIconProps {
  size?: number
  className?: string
  animate?: boolean
}

export default function RetroGamepadIcon({ 
  size = 24, 
  className = '',
  animate = true 
}: RetroGamepadIconProps) {
  const gamepadAnimation = animate ? {
    scale: [1, 1.05, 1],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  } : {}

  const buttonPulse = animate ? {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      delay: 0.5
    }
  } : {}

  const dpadGlow = animate ? {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  } : {}

  return (
    <motion.div 
      className={`inline-block ${className}`}
      animate={gamepadAnimation}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Gamepad Body - Retro NES/SNES inspired */}
        <motion.path
          d="M6 12C6 10.3431 7.34315 9 9 9H31C32.6569 9 34 10.3431 34 12V20C34 21.6569 32.6569 23 31 23H9C7.34315 23 6 21.6569 6 20V12Z"
          fill="currentColor"
          fillOpacity="0.95"
          stroke="currentColor"
          strokeWidth="0.5"
        />

        {/* Body gradient for depth */}
        <motion.path
          d="M6 12C6 10.3431 7.34315 9 9 9H31C32.6569 9 34 10.3431 34 12V20C34 21.6569 32.6569 23 31 23H9C7.34315 23 6 21.6569 6 20V12Z"
          fill="url(#bodyGradient)"
          fillOpacity="0.3"
        />

        {/* Define gradients */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="buttonGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Left D-Pad - Classic Plus Style */}
        <motion.g animate={dpadGlow}>
          {/* D-pad base */}
          <rect x="10" y="13.5" width="5" height="5" rx="0.5" fill="currentColor" fillOpacity="0.15" />
          
          {/* Horizontal bar */}
          <rect x="9" y="15" width="7" height="2" rx="1" fill="#00FFFF" />
          
          {/* Vertical bar */}
          <rect x="11.5" y="12.5" width="2" height="7" rx="1" fill="#00FFFF" />
          
          {/* D-pad center */}
          <circle cx="12.5" cy="16" r="0.8" fill="#00FFFF" fillOpacity="0.7" />
        </motion.g>

        {/* Right Action Buttons - SNES Style Layout */}
        <motion.g animate={buttonPulse}>
          {/* Button backgrounds */}
          <circle cx="26" cy="16" r="2.2" fill="currentColor" fillOpacity="0.1" />
          <circle cx="28.5" cy="13.5" r="2.2" fill="currentColor" fillOpacity="0.1" />
          <circle cx="23.5" cy="13.5" r="2.2" fill="currentColor" fillOpacity="0.1" />
          <circle cx="26" cy="11" r="2.2" fill="currentColor" fillOpacity="0.1" />
          
          {/* Button A (bottom) - Red */}
          <circle cx="26" cy="16" r="1.8" fill="#FF4757" />
          <circle cx="26" cy="15.7" r="1.5" fill="#FF6B7A" />
          <text x="26" y="16.5" fontSize="2.5" textAnchor="middle" fill="white" fontWeight="bold">A</text>
          
          {/* Button B (right) - Yellow */}
          <circle cx="28.5" cy="13.5" r="1.8" fill="#FFA502" />
          <circle cx="28.5" cy="13.2" r="1.5" fill="#FFB84D" />
          <text x="28.5" y="14" fontSize="2.5" textAnchor="middle" fill="white" fontWeight="bold">B</text>
          
          {/* Button X (left) - Blue */}
          <circle cx="23.5" cy="13.5" r="1.8" fill="#3742FA" />
          <circle cx="23.5" cy="13.2" r="1.5" fill="#5352ED" />
          <text x="23.5" y="14" fontSize="2.5" textAnchor="middle" fill="white" fontWeight="bold">X</text>
          
          {/* Button Y (top) - Green */}
          <circle cx="26" cy="11" r="1.8" fill="#2ED573" />
          <circle cx="26" cy="10.7" r="1.5" fill="#7BED8B" />
          <text x="26" y="11.5" fontSize="2.5" textAnchor="middle" fill="white" fontWeight="bold">Y</text>
        </motion.g>

        {/* Select/Start Buttons */}
        <motion.g
          animate={animate ? {
            opacity: [0.6, 1, 0.6],
            transition: { duration: 2.5, repeat: Infinity, delay: 1 }
          } : {}}
        >
          <rect x="16" y="10.5" width="2.5" height="1.2" rx="0.6" fill="currentColor" fillOpacity="0.8" />
          <rect x="21.5" y="10.5" width="2.5" height="1.2" rx="0.6" fill="currentColor" fillOpacity="0.8" />
          <text x="17.25" y="11.3" fontSize="1.5" textAnchor="middle" fill="white" opacity="0.7">SEL</text>
          <text x="22.75" y="11.3" fontSize="1.5" textAnchor="middle" fill="white" opacity="0.7">ST</text>
        </motion.g>

        {/* Retro Details */}
        <motion.g 
          animate={animate ? {
            opacity: [0.2, 0.5, 0.2],
            transition: { duration: 4, repeat: Infinity }
          } : {}}
        >
          {/* Screws */}
          <circle cx="8.5" cy="10.5" r="0.6" fill="currentColor" fillOpacity="0.3" />
          <circle cx="31.5" cy="10.5" r="0.6" fill="currentColor" fillOpacity="0.3" />
          <circle cx="8.5" cy="21.5" r="0.6" fill="currentColor" fillOpacity="0.3" />
          <circle cx="31.5" cy="21.5" r="0.6" fill="currentColor" fillOpacity="0.3" />
          
          {/* Screw holes */}
          <circle cx="8.5" cy="10.5" r="0.3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="31.5" cy="10.5" r="0.3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="8.5" cy="21.5" r="0.3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="31.5" cy="21.5" r="0.3" fill="currentColor" fillOpacity="0.6" />
        </motion.g>

        {/* Nintendo-style logo area */}
        <motion.g
          animate={animate ? {
            opacity: [0.3, 0.7, 0.3],
            transition: { duration: 3, repeat: Infinity, delay: 2 }
          } : {}}
        >
          <rect x="17" y="19" width="6" height="2" rx="1" fill="currentColor" fillOpacity="0.1" />
          <text x="20" y="20.3" fontSize="1.8" textAnchor="middle" fill="currentColor" opacity="0.4" fontWeight="bold">PLAY</text>
        </motion.g>

        {/* Power LED */}
        <motion.circle
          cx="32.5"
          cy="14"
          r="0.8"
          fill="#39FF14"
          animate={animate ? {
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
            transition: { duration: 1, repeat: Infinity }
          } : {}}
        />

        {/* Outer glow effect */}
        {animate && (
          <motion.path
            d="M6 12C6 10.3431 7.34315 9 9 9H31C32.6569 9 34 10.3431 34 12V20C34 21.6569 32.6569 23 31 23H9C7.34315 23 6 21.6569 6 20V12Z"
            fill="none"
            stroke="#00FFFF"
            strokeWidth="0.5"
            strokeOpacity="0.0"
            animate={{
              strokeOpacity: [0.0, 0.4, 0.0],
              transition: { duration: 3, repeat: Infinity, delay: 0.5 }
            }}
          />
        )}
      </svg>
    </motion.div>
  )
}