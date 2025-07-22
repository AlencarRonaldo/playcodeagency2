'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Gaming Style */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary animate-pulse">
              404
            </h1>
            <div className="text-2xl text-gray-400 mt-2">
              <span className="text-accent">LEVEL</span> NOT FOUND
            </div>
          </div>

          <p className="text-gray-400 mb-8 text-lg">
            Looks like you've ventured into uncharted territory. This page doesn't exist in our game world.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🏠</span>
              Return to Main Menu
            </Link>
            
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              <span className="mr-2">🎮</span>
              View Our Portfolio
            </Link>
          </div>

          {/* Gaming console style decoration */}
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-100" />
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-200" />
          </div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  )
}