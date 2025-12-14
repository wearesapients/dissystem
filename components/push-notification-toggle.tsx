'use client'

/**
 * Push Notification Toggle Component
 * Allows users to enable/disable push notifications
 */

import { useState, useEffect, useCallback } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported'

export function PushNotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [permission, setPermission] = useState<PermissionState>('prompt')

  // Check initial state
  useEffect(() => {
    checkPushSupport()
  }, [])

  const checkPushSupport = useCallback(async () => {
    // Check if push is supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPermission('unsupported')
      setIsLoading(false)
      return
    }

    // Check current permission
    const currentPermission = Notification.permission as PermissionState
    setPermission(currentPermission)

    if (currentPermission === 'denied') {
      setIsLoading(false)
      return
    }

    // Check if already subscribed
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error('[Push] Error checking subscription:', error)
    }
    
    setIsLoading(false)
  }, [])

  const subscribe = async () => {
    setIsLoading(true)

    try {
      // Register service worker if not already
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      // Request notification permission
      const permissionResult = await Notification.requestPermission()
      setPermission(permissionResult as PermissionState)

      if (permissionResult !== 'granted') {
        setIsLoading(false)
        return
      }

      // Get VAPID public key
      const vapidResponse = await fetch('/api/push/vapid-key')
      if (!vapidResponse.ok) {
        throw new Error('Push notifications not configured')
      }
      const { publicKey } = await vapidResponse.json()

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      })

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() })
      })

      if (response.ok) {
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('[Push] Subscribe error:', error)
    }

    setIsLoading(false)
  }

  const unsubscribe = async () => {
    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe from push
        await subscription.unsubscribe()

        // Remove from server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        })
      }

      setIsSubscribed(false)
    } catch (error) {
      console.error('[Push] Unsubscribe error:', error)
    }

    setIsLoading(false)
  }

  // Don't render if unsupported
  if (permission === 'unsupported') {
    return null
  }

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading || permission === 'denied'}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        isSubscribed
          ? 'bg-[#A89C6A]/20 text-[#A89C6A] hover:bg-[#A89C6A]/30'
          : permission === 'denied'
          ? 'bg-white/5 text-white/30 cursor-not-allowed'
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
      title={
        permission === 'denied'
          ? 'Уведомления заблокированы в настройках браузера'
          : isSubscribed
          ? 'Отключить уведомления'
          : 'Включить уведомления'
      }
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isSubscribed ? (
        <Bell size={18} />
      ) : (
        <BellOff size={18} />
      )}
      <span className="text-sm hidden sm:inline">
        {isLoading
          ? 'Загрузка...'
          : permission === 'denied'
          ? 'Заблокировано'
          : isSubscribed
          ? 'Уведомления вкл.'
          : 'Уведомления'}
      </span>
    </button>
  )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
