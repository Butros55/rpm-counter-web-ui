import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { CaretDown, Link as LinkIcon, LinkBreak } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { StatusResponse, DisplayStatusResponse } from '@/lib/types'

interface DevModePanelProps {
  status: StatusResponse
  autoReconnect: boolean
  onAutoReconnectChange: (checked: boolean) => void
}

export default function DevModePanel({ status, autoReconnect, onAutoReconnectChange }: DevModePanelProps) {
  const [displayStatus, setDisplayStatus] = useState<DisplayStatusResponse | null>(null)
  const [isBLEOpen, setIsBLEOpen] = useState(false)
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)
  const [isDebugOpen, setIsDebugOpen] = useState(false)

  useEffect(() => {
    const fetchDisplayStatus = async () => {
      try {
        const data = await api.getDisplayStatus()
        setDisplayStatus(data)
      } catch (error) {
        console.error('Failed to fetch display status:', error)
      }
    }
    
    fetchDisplayStatus()
    const interval = setInterval(fetchDisplayStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleConnect = async () => {
    try {
      await api.connect()
      toast.success('Connection initiated')
    } catch (error) {
      toast.error('Failed to connect')
    }
  }

  const handleDisconnect = async () => {
    try {
      await api.disconnect()
      toast.success('Disconnected')
    } catch (error) {
      toast.error('Failed to disconnect')
    }
  }

  const handleDisplayPattern = async (pattern: 'bars' | 'grid' | 'ui') => {
    try {
      await api.displayPattern(pattern)
      toast.success(`${pattern} pattern displayed`)
    } catch (error) {
      toast.error('Failed to display pattern')
    }
  }

  const handleDisplayLogo = async () => {
    try {
      await api.displayLogo()
      toast.success('BMW logo displayed')
    } catch (error) {
      toast.error('Failed to display logo')
    }
  }

  return (
    <Card className="border-accent/30">
      <CardHeader>
        <CardTitle className="text-accent">Developer Mode</CardTitle>
        <CardDescription>Advanced debugging and testing features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Collapsible open={isBLEOpen} onOpenChange={setIsBLEOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            <span className="font-medium">BLE Status & Control</span>
            <CaretDown
              className={`transition-transform ${isBLEOpen ? 'rotate-180' : ''}`}
              size={20}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant={status.connected ? 'default' : 'secondary'} className="gap-1.5">
                {status.connected ? (
                  <>
                    <LinkIcon weight="bold" size={14} />
                    Connected
                  </>
                ) : (
                  <>
                    <LinkBreak weight="bold" size={14} />
                    Disconnected
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto-Reconnect</Label>
              <Switch checked={autoReconnect} onCheckedChange={onAutoReconnectChange} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnect}
                disabled={status.connected}
              >
                <LinkIcon weight="bold" size={16} />
                Connect
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={!status.connected}
              >
                <LinkBreak weight="bold" size={16} />
                Disconnect
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isDisplayOpen} onOpenChange={setIsDisplayOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            <span className="font-medium">Display Debug</span>
            <CaretDown
              className={`transition-transform ${isDisplayOpen ? 'rotate-180' : ''}`}
              size={20}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            {displayStatus && (
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Display Ready</span>
                  <Badge variant={displayStatus.ready ? 'default' : 'secondary'}>
                    {displayStatus.ready ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Touch Ready</span>
                  <Badge variant={displayStatus.touchReady ? 'default' : 'secondary'}>
                    {displayStatus.touchReady ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span className="font-mono">{displayStatus.width}×{displayStatus.height}</span>
                </div>
                {displayStatus.lastError && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Error</span>
                    <span className="text-destructive text-xs">{displayStatus.lastError}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Test Patterns</Label>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => handleDisplayPattern('bars')}>
                  Color Bars
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDisplayPattern('grid')}>
                  Grid/Brightness
                </Button>
                <Button variant="outline" size="sm" onClick={handleDisplayLogo}>
                  BMW Logo
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isDebugOpen} onOpenChange={setIsDebugOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            <span className="font-medium">Debug Log</span>
            <CaretDown
              className={`transition-transform ${isDebugOpen ? 'rotate-180' : ''}`}
              size={20}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-3">
            <div className="bg-black/40 rounded-lg p-3 font-mono text-xs space-y-1">
              {status.lastTx && (
                <div className="text-accent">
                  <span className="text-muted-foreground">TX:</span> {status.lastTx}
                </div>
              )}
              {status.lastObd && (
                <div className="text-primary">
                  <span className="text-muted-foreground">RX:</span> {status.lastObd}
                </div>
              )}
              {!status.lastTx && !status.lastObd && (
                <div className="text-muted-foreground">No recent activity</div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}