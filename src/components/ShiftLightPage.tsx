import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Play, FloppyDisk, ArrowClockwise, BluetoothConnected, BluetoothSlash } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import type { StatusResponse, ConfigFormData } from '@/lib/types'
import LEDPreview from './LEDPreview'
import VehicleInfo from './VehicleInfo'
import DevModePanel from './DevModePanel'

export default function ShiftLightPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [config, setConfig] = useState<ConfigFormData>({
    mode: 'casual',
    brightness: 128,
    autoscale: true,
    fixedMaxRpm: 7000,
    greenEndPct: 40,
    yellowEndPct: 75,
    blinkStartPct: 90,
    greenColor: '#00FF00',
    yellowColor: '#FFFF00',
    redColor: '#FF0000',
    greenLabel: 'Low',
    yellowLabel: 'Mid',
    redLabel: 'Shift',
    logoIgnOn: true,
    logoEngStart: true,
    logoIgnOff: true,
    autoReconnect: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getStatus()
        setStatus(data)
        if (data.autoReconnect !== undefined) {
          setConfig(prev => ({ ...prev, autoReconnect: data.autoReconnect }))
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api.saveConfig(config)
      toast.success('Configuration saved to ESP32')
    } catch (error) {
      toast.error('Failed to save configuration')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    try {
      await api.testConfig(config)
      toast.success('Test pattern started')
    } catch (error) {
      toast.error('Failed to start test')
      console.error(error)
    } finally {
      setTimeout(() => setIsTesting(false), 3000)
    }
  }

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {status && (
            <Badge variant={status.connected ? 'default' : 'secondary'} className="gap-1.5">
              {status.connected ? (
                <>
                  <BluetoothConnected weight="fill" size={16} />
                  Connected
                </>
              ) : (
                <>
                  <BluetoothSlash weight="fill" size={16} />
                  Disconnected
                </>
              )}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <ArrowClockwise weight="bold" size={18} />
            Reset
          </Button>
          <Button variant="outline" onClick={handleTest} disabled={isTesting}>
            <Play weight="fill" size={18} />
            Test
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <FloppyDisk weight="fill" size={18} />
            Save
          </Button>
        </div>
      </div>

      <VehicleInfo status={status} />

      <Card>
        <CardHeader>
          <CardTitle>Display Mode & Brightness</CardTitle>
          <CardDescription>Configure the shift light behavior and LED brightness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="mode">Mode</Label>
            <Select value={config.mode} onValueChange={(value) => setConfig({ ...config, mode: value })}>
              <SelectTrigger id="mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="f1">F1-Style</SelectItem>
                <SelectItem value="sensitive">Überempfindlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness">Brightness</Label>
              <span className="text-sm font-mono text-muted-foreground">{config.brightness}</span>
            </div>
            <Slider
              id="brightness"
              min={0}
              max={255}
              step={1}
              value={[config.brightness]}
              onValueChange={([value]) => setConfig({ ...config, brightness: value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RPM Range Configuration</CardTitle>
          <CardDescription>Set maximum RPM and threshold percentages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="autoscale" className="flex-1">Auto-Scale Max RPM</Label>
            <Switch
              id="autoscale"
              checked={config.autoscale}
              onCheckedChange={(checked) => setConfig({ ...config, autoscale: checked })}
            />
          </div>

          {!config.autoscale && (
            <div className="space-y-3">
              <Label htmlFor="fixedMaxRpm">Fixed Max RPM</Label>
              <Input
                id="fixedMaxRpm"
                type="number"
                min={1000}
                max={15000}
                value={config.fixedMaxRpm}
                onChange={(e) => setConfig({ ...config, fixedMaxRpm: parseInt(e.target.value) || 7000 })}
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="greenEndPct">Green End %</Label>
              <span className="text-sm font-mono text-muted-foreground">{config.greenEndPct}%</span>
            </div>
            <Slider
              id="greenEndPct"
              min={0}
              max={100}
              step={1}
              value={[config.greenEndPct]}
              onValueChange={([value]) => setConfig({ ...config, greenEndPct: value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="yellowEndPct">Yellow End %</Label>
              <span className="text-sm font-mono text-muted-foreground">{config.yellowEndPct}%</span>
            </div>
            <Slider
              id="yellowEndPct"
              min={0}
              max={100}
              step={1}
              value={[config.yellowEndPct]}
              onValueChange={([value]) => setConfig({ ...config, yellowEndPct: value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="blinkStartPct">Blink Start %</Label>
              <span className="text-sm font-mono text-muted-foreground">{config.blinkStartPct}%</span>
            </div>
            <Slider
              id="blinkStartPct"
              min={0}
              max={100}
              step={1}
              value={[config.blinkStartPct]}
              onValueChange={([value]) => setConfig({ ...config, blinkStartPct: value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zone Colors</CardTitle>
          <CardDescription>Configure colors for each RPM zone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-3">
              <Label htmlFor="greenColor">Low RPM Color</Label>
              <div className="flex gap-2">
                <Input
                  id="greenColor"
                  type="color"
                  value={config.greenColor}
                  onChange={(e) => setConfig({ ...config, greenColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={config.greenColor}
                  onChange={(e) => setConfig({ ...config, greenColor: e.target.value })}
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="yellowColor">Mid RPM Color</Label>
              <div className="flex gap-2">
                <Input
                  id="yellowColor"
                  type="color"
                  value={config.yellowColor}
                  onChange={(e) => setConfig({ ...config, yellowColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={config.yellowColor}
                  onChange={(e) => setConfig({ ...config, yellowColor: e.target.value })}
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="redColor">Shift Warning Color</Label>
              <div className="flex gap-2">
                <Input
                  id="redColor"
                  type="color"
                  value={config.redColor}
                  onChange={(e) => setConfig({ ...config, redColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={config.redColor}
                  onChange={(e) => setConfig({ ...config, redColor: e.target.value })}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <LEDPreview config={config} />

      <Card>
        <CardHeader>
          <CardTitle>Coming Home / Leaving Animations</CardTitle>
          <CardDescription>Enable logo animations for ignition events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="logoIgnOn">M-Logo bei Zündung an</Label>
            <Switch
              id="logoIgnOn"
              checked={config.logoIgnOn}
              onCheckedChange={(checked) => setConfig({ ...config, logoIgnOn: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="logoEngStart">M-Logo bei Motorstart</Label>
            <Switch
              id="logoEngStart"
              checked={config.logoEngStart}
              onCheckedChange={(checked) => setConfig({ ...config, logoEngStart: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="logoIgnOff">Leaving-Animation bei Zündung aus</Label>
            <Switch
              id="logoIgnOff"
              checked={config.logoIgnOff}
              onCheckedChange={(checked) => setConfig({ ...config, logoIgnOff: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {status?.devMode && (
        <DevModePanel 
          status={status} 
          autoReconnect={config.autoReconnect || false}
          onAutoReconnectChange={(checked) => setConfig({ ...config, autoReconnect: checked })}
        />
      )}
    </div>
  )
}