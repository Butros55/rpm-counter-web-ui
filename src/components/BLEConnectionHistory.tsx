import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Star, 
  Trash, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChartLine,
  BluetoothConnected
} from '@phosphor-icons/react'
import { useBLEHistory } from '@/hooks/use-ble-history'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { BLESavedDevice } from '@/lib/types'

interface BLEConnectionHistoryProps {
  onDeviceSelect?: (address: string, name: string) => void
}

export default function BLEConnectionHistory({ onDeviceSelect }: BLEConnectionHistoryProps) {
  const { getSortedDevices, toggleFavorite, removeDevice, clearHistory } = useBLEHistory()
  
  const devices = getSortedDevices()

  const handleConnect = async (device: BLESavedDevice) => {
    try {
      await api.connectBLEDevice(device.address, device.name)
      toast.success(`Connecting to ${device.name}`)
      onDeviceSelect?.(device.address, device.name)
    } catch (error) {
      toast.error('Failed to connect')
    }
  }

  const handleToggleFavorite = (address: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(address)
  }

  const handleRemove = (address: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeDevice(address)
    toast.success(`Removed ${name} from history`)
  }

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const getSuccessRate = (device: BLESavedDevice): number => {
    if (device.totalConnections === 0) return 0
    return Math.round((device.successfulConnections / device.totalConnections) * 100)
  }

  if (devices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connection History</CardTitle>
          <CardDescription>No saved BLE devices yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BluetoothConnected size={48} className="mx-auto mb-3 opacity-50" />
            <p>Connect to a device to start tracking history</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection History</CardTitle>
        <CardDescription>
          Saved devices and connection statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.address}
            className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer"
            onClick={() => handleConnect(device)}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{device.name}</h4>
                  {device.isFavorite && (
                    <Star size={14} weight="fill" className="text-accent flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {device.address}
                </p>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleToggleFavorite(device.address, e)}
                  className="h-8 w-8 p-0"
                >
                  {device.isFavorite ? (
                    <Star size={16} weight="fill" className="text-accent" />
                  ) : (
                    <Star size={16} />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleRemove(device.address, device.name, e)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle size={14} />
                  <span>Success Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">
                    {getSuccessRate(device)}%
                  </div>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${getSuccessRate(device)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ChartLine size={14} />
                  <span>Total Attempts</span>
                </div>
                <div className="text-sm font-semibold">
                  {device.totalConnections}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap text-xs">
              {device.lastConnected && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={12} />
                  <span>
                    Last: {formatDistanceToNow(device.lastConnected, { addSuffix: true })}
                  </span>
                </div>
              )}
              
              {device.averageConnectionDuration && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={12} />
                  <span>
                    Avg: {formatDuration(device.averageConnectionDuration)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline" className="text-xs">
                  <CheckCircle size={12} className="mr-1" />
                  {device.successfulConnections}
                </Badge>
                {device.failedConnections > 0 && (
                  <Badge variant="outline" className="text-xs text-destructive">
                    <XCircle size={12} className="mr-1" />
                    {device.failedConnections}
                  </Badge>
                )}
              </div>
            </div>

            {device.history.length > 0 && (
              <>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Recent Activity
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearHistory(device.address)
                        toast.success('History cleared')
                      }}
                      className="h-6 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                    {device.history.slice(0, 5).map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 text-xs p-2 rounded bg-secondary/30"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {entry.success ? (
                            <CheckCircle size={14} className="text-primary flex-shrink-0" />
                          ) : (
                            <XCircle size={14} className="text-destructive flex-shrink-0" />
                          )}
                          <span className="text-muted-foreground truncate">
                            {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        {entry.duration && (
                          <span className="text-muted-foreground flex-shrink-0">
                            {formatDuration(entry.duration)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
