import { useKV } from '@github/spark/hooks'
import { useCallback } from 'react'
import type { BLESavedDevice, BLEConnectionHistoryEntry, BLEDevice } from '@/lib/types'

const BLE_HISTORY_KEY = 'ble-device-history'
const MAX_HISTORY_ENTRIES = 50

export function useBLEHistory() {
  const [savedDevices, setSavedDevices] = useKV<BLESavedDevice[]>(BLE_HISTORY_KEY, [])

  const addConnectionAttempt = useCallback((device: BLEDevice, success: boolean, duration?: number, disconnectReason?: string) => {
    setSavedDevices((current) => {
      const devices = current || []
      const existingIndex = devices.findIndex(d => d.address === device.address)
      
      const historyEntry: BLEConnectionHistoryEntry = {
        address: device.address,
        name: device.name,
        timestamp: Date.now(),
        success,
        duration,
        disconnectReason
      }

      if (existingIndex >= 0) {
        const existing = devices[existingIndex]
        const updatedHistory = [historyEntry, ...existing.history].slice(0, MAX_HISTORY_ENTRIES)
        
        const successfulConnections = existing.successfulConnections + (success ? 1 : 0)
        const failedConnections = existing.failedConnections + (success ? 0 : 1)
        const totalConnections = existing.totalConnections + 1
        
        const successfulDurations = updatedHistory
          .filter(h => h.success && h.duration)
          .map(h => h.duration!)
        const averageConnectionDuration = successfulDurations.length > 0
          ? successfulDurations.reduce((a, b) => a + b, 0) / successfulDurations.length
          : undefined

        const updated: BLESavedDevice = {
          ...existing,
          name: device.name,
          lastConnected: success ? Date.now() : existing.lastConnected,
          totalConnections,
          successfulConnections,
          failedConnections,
          averageConnectionDuration,
          history: updatedHistory
        }

        const newDevices = [...devices]
        newDevices[existingIndex] = updated
        return newDevices
      } else {
        const newDevice: BLESavedDevice = {
          address: device.address,
          name: device.name,
          lastConnected: success ? Date.now() : undefined,
          totalConnections: 1,
          successfulConnections: success ? 1 : 0,
          failedConnections: success ? 0 : 1,
          averageConnectionDuration: duration,
          history: [historyEntry],
          isFavorite: false
        }
        return [newDevice, ...devices]
      }
    })
  }, [setSavedDevices])

  const toggleFavorite = useCallback((address: string) => {
    setSavedDevices((current) => {
      const devices = current || []
      return devices.map(d => 
        d.address === address 
          ? { ...d, isFavorite: !d.isFavorite }
          : d
      )
    })
  }, [setSavedDevices])

  const removeDevice = useCallback((address: string) => {
    setSavedDevices((current) => {
      const devices = current || []
      return devices.filter(d => d.address !== address)
    })
  }, [setSavedDevices])

  const clearHistory = useCallback((address: string) => {
    setSavedDevices((current) => {
      const devices = current || []
      return devices.map(d => 
        d.address === address 
          ? { ...d, history: [] }
          : d
      )
    })
  }, [setSavedDevices])

  const getDevice = useCallback((address: string): BLESavedDevice | undefined => {
    return savedDevices?.find(d => d.address === address)
  }, [savedDevices])

  const getSortedDevices = useCallback((): BLESavedDevice[] => {
    const devices = savedDevices || []
    return [...devices].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      
      const aTime = a.lastConnected || 0
      const bTime = b.lastConnected || 0
      return bTime - aTime
    })
  }, [savedDevices])

  return {
    savedDevices: savedDevices || [],
    addConnectionAttempt,
    toggleFavorite,
    removeDevice,
    clearHistory,
    getDevice,
    getSortedDevices
  }
}

