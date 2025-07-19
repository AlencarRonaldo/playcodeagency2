'use client'

import { useEffect, useState } from 'react'
import { useAchievements } from '@/lib/hooks/useAchievements'
import AchievementNotification from './AchievementNotification'
import { AchievementNotification as AchievementNotificationType } from '@/lib/achievements/types'

interface AchievementProviderProps {
  children: React.ReactNode
}

export default function AchievementProvider({ children }: AchievementProviderProps) {
  const { notifications, getNextNotification } = useAchievements()
  const [activeNotifications, setActiveNotifications] = useState<AchievementNotificationType[]>([])

  // Handle new notifications
  useEffect(() => {
    const newNotification = getNextNotification()
    if (newNotification) {
      setActiveNotifications(prev => [...prev, newNotification])
    }
  }, [notifications, getNextNotification])

  const handleCloseNotification = (notificationId: string) => {
    setActiveNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  return (
    <>
      {children}
      
      {/* Achievement Notifications */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        {activeNotifications.map((notification, index) => (
          <div key={notification.id} style={{ zIndex: 50 + index }}>
            <AchievementNotification
              achievement={notification.achievement}
              onClose={() => handleCloseNotification(notification.id)}
              autoClose={true}
              duration={5000}
            />
          </div>
        ))}
      </div>
    </>
  )
}