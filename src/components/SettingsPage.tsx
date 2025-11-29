import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FloppyDisk } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import type { StatusResponse } from '@/lib/types'
import WiFiManager from './WiFiManager'
import BLEManager from './BLEManager'
import VehicleSync from './VehicleSync'
import OBDConsole from './OBDConsole'

export default function SettingsPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [devMode, setDevMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getStatus()
        setStatus(data)
        if (data.devMode !== undefined) {
          setDevMode(data.devMode)
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSaveDevMode = async () => {
    setIsSaving(true)
    try {
      await api.saveSettings({
        devMode,
        wifiMode: 'STA_WITH_AP_FALLBACK',
        staSsid: '',
        staPassword: '',
        apSsid: '',
        apPassword: '',
      })
      toast.success('Developer mode saved')
    } catch (error) {
      toast.error('Failed to save settings')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mode</CardTitle>
          <CardDescription>Configure application behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="devMode">Developer Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable advanced debugging features
              </p>
            </div>
            <Switch
              id="devMode"
              checked={devMode}
              onCheckedChange={setDevMode}
            />
          </div>
          <Button onClick={handleSaveDevMode} disabled={isSaving} size="sm">
            <FloppyDisk weight="fill" size={16} />
            Save Mode
          </Button>
        </CardContent>
      </Card>

      <WiFiManager />

      <VehicleSync status={status} />

      <BLEManager />

      {devMode && <OBDConsole status={status} />}
    </div>
  )
}