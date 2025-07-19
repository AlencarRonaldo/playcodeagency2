'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievements } from '@/lib/hooks/useAchievements'
import { ACHIEVEMENT_CATEGORIES, RARITY_CONFIG } from '@/lib/achievements/definitions'
import AchievementCard from './AchievementCard'
import { AchievementCategory, AchievementRarity } from '@/lib/achievements/types'

export default function AchievementDashboard() {
  const { userProgress, achievements, unlockedAchievements } = useAchievements()
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all')
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false)
  const [showHidden, setShowHidden] = useState(false)

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      // Category filter
      if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
        return false
      }

      // Rarity filter
      if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) {
        return false
      }

      // Unlocked filter
      if (showOnlyUnlocked) {
        const isUnlocked = unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
        if (!isUnlocked) return false
      }

      // Hidden filter
      if (achievement.hidden && !showHidden) {
        const isUnlocked = unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
        if (!isUnlocked) return false
      }

      return true
    })
  }, [achievements, unlockedAchievements, selectedCategory, selectedRarity, showOnlyUnlocked, showHidden])

  // Stats
  const stats = useMemo(() => {
    const total = achievements.length
    const unlocked = unlockedAchievements.length
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0
    
    const byCategory = Object.keys(ACHIEVEMENT_CATEGORIES).reduce((acc, category) => {
      const categoryAchievements = achievements.filter(a => a.category === category)
      const categoryUnlocked = unlockedAchievements.filter(a => a.category === category)
      acc[category as AchievementCategory] = {
        total: categoryAchievements.length,
        unlocked: categoryUnlocked.length,
        percentage: categoryAchievements.length > 0 
          ? Math.round((categoryUnlocked.length / categoryAchievements.length) * 100) 
          : 0
      }
      return acc
    }, {} as Record<AchievementCategory, { total: number; unlocked: number; percentage: number }>)

    const byRarity = Object.keys(RARITY_CONFIG).reduce((acc, rarity) => {
      const rarityAchievements = achievements.filter(a => a.rarity === rarity)
      const rarityUnlocked = unlockedAchievements.filter(a => a.rarity === rarity)
      acc[rarity as AchievementRarity] = {
        total: rarityAchievements.length,
        unlocked: rarityUnlocked.length,
        percentage: rarityAchievements.length > 0 
          ? Math.round((rarityUnlocked.length / rarityAchievements.length) * 100) 
          : 0
      }
      return acc
    }, {} as Record<AchievementRarity, { total: number; unlocked: number; percentage: number }>)

    return { total, unlocked, percentage, byCategory, byRarity }
  }, [achievements, unlockedAchievements])

  if (!userProgress) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="gaming-card p-8 text-center">
          <div className="text-4xl mb-4">🎮</div>
          <div className="gaming-title text-xl mb-2">Loading Achievements...</div>
          <div className="gaming-mono text-sm text-led-white/60">
            Initializing achievement system
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="gaming-card p-6">
        <div className="text-center mb-6">
          <h2 className="gaming-title text-3xl font-bold mb-2 text-neon-cyan">
            ACHIEVEMENT CENTER
          </h2>
          <p className="gaming-subtitle text-led-white/80">
            Track your progress and unlock epic rewards
          </p>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="hud-element text-center p-4">
            <div className="gaming-display text-3xl font-bold text-laser-green mb-1">
              {stats.unlocked}
            </div>
            <div className="gaming-mono text-xs text-led-white/60">
              ACHIEVEMENTS UNLOCKED
            </div>
          </div>

          <div className="hud-element text-center p-4">
            <div className="gaming-display text-3xl font-bold text-electric-blue mb-1">
              {stats.percentage}%
            </div>
            <div className="gaming-mono text-xs text-led-white/60">
              COMPLETION RATE
            </div>
          </div>

          <div className="hud-element text-center p-4">
            <div className="gaming-display text-3xl font-bold text-gaming-purple mb-1">
              {userProgress.level}
            </div>
            <div className="gaming-mono text-xs text-led-white/60">
              CURRENT LEVEL
            </div>
          </div>

          <div className="hud-element text-center p-4">
            <div className="gaming-display text-3xl font-bold text-plasma-yellow mb-1">
              {userProgress.totalXP.toLocaleString()}
            </div>
            <div className="gaming-mono text-xs text-led-white/60">
              TOTAL XP
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="gaming-mono text-sm text-led-white/80">
              Overall Progress
            </span>
            <span className="gaming-mono text-sm text-neon-cyan">
              {stats.unlocked}/{stats.total}
            </span>
          </div>
          <div className="hud-bar h-3">
            <motion.div
              className="h-full bg-gradient-to-r from-laser-green via-electric-blue to-gaming-purple"
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="gaming-card p-6">
        <h3 className="gaming-title text-xl font-bold mb-4 text-magenta-power">
          FILTERS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="gaming-mono text-sm text-led-white/80 mb-2 block">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AchievementCategory | 'all')}
              className="w-full bg-controller-black border border-neon-cyan/50 rounded px-3 py-2 gaming-mono text-sm text-led-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="all">All Categories</option>
              {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="gaming-mono text-sm text-led-white/80 mb-2 block">
              Rarity
            </label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as AchievementRarity | 'all')}
              className="w-full bg-controller-black border border-neon-cyan/50 rounded px-3 py-2 gaming-mono text-sm text-led-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="all">All Rarities</option>
              {Object.entries(RARITY_CONFIG).map(([key, rarity]) => (
                <option key={key} value={key}>
                  {rarity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Filters */}
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyUnlocked}
                onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 border-neon-cyan rounded flex items-center justify-center ${
                showOnlyUnlocked ? 'bg-neon-cyan' : 'bg-transparent'
              }`}>
                {showOnlyUnlocked && <div className="w-2 h-2 bg-controller-black rounded-sm" />}
              </div>
              <span className="gaming-mono text-sm text-led-white/80">
                Unlocked Only
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 border-magenta-power rounded flex items-center justify-center ${
                showHidden ? 'bg-magenta-power' : 'bg-transparent'
              }`}>
                {showHidden && <div className="w-2 h-2 bg-controller-black rounded-sm" />}
              </div>
              <span className="gaming-mono text-sm text-led-white/80">
                Show Hidden
              </span>
            </label>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="hud-element p-3 text-center">
              <div className="gaming-display text-xl font-bold text-neon-cyan">
                {filteredAchievements.length}
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                RESULTS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div>
        <AnimatePresence mode="wait">
          {filteredAchievements.length > 0 ? (
            <motion.div
              key="achievements-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: 'easeOut'
                  }}
                >
                  <AchievementCard 
                    achievement={achievement}
                    showProgress={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="gaming-card p-8 max-w-md mx-auto">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="gaming-title text-xl font-bold mb-2 text-led-white/80">
                  No Achievements Found
                </h3>
                <p className="gaming-subtitle text-led-white/60">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}