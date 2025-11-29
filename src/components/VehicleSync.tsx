import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowClockwise, Spinner, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { StatusResponse } from '@/lib/types'

interface VehicleSyncProps {
  status: StatusResponse | null
}

export default function VehicleSync({ status }: VehicleSyncProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await api.refreshVehicleInfo()
      toast.success('Vehicle sync initiated')
    } catch (error) {
      toast.error('Failed to start sync')
      console.error(error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 3000)
    }
  }

  const getSyncStatus = () => {
    if (!status) return { icon: null, label: 'Unknown', variant: 'secondary' as const }
    if (status.vehicleInfoRequestRunning) {
      return {
        icon: <Spinner className="animate-spin" size={16} />,
        label: 'Syncing...',
        variant: 'secondary' as const,
      }
    }
    if (status.vehicleInfoReady) {
      return {
        icon: <CheckCircle weight="fill" size={16} />,
        label: 'Ready',
        variant: 'default' as const,
      }
    }
    return {
      icon: <WarningCircle weight="fill" size={16} />,
      label: 'Not Synced',
      variant: 'destructive' as const,
    }
  }

  const syncStatus = getSyncStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Vehicle</CardTitle>
        <CardDescription>Vehicle information from OBD-II</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Badge variant={syncStatus.variant} className="gap-1.5">
            {syncStatus.icon}
            {syncStatus.label}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || status?.vehicleInfoRequestRunning}
          >
            <ArrowClockwise weight="bold" size={16} />
            Refresh
          </Button>
        </div>

        {status && (
          <div className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Model</div>
                <div className="font-medium">
                  {status.vehicleModel || <span className="text-muted-foreground">Unknown</span>}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">VIN</div>
                <div className="font-mono text-sm">
                  {status.vehicleVin || <span className="text-muted-foreground">N/A</span>}
                </div>
              </div>
            </div>

            {status.vehicleDiag && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Diagnostic Info</div>
                <div className="text-sm p-3 rounded-lg bg-secondary font-mono">
                  {status.vehicleDiag}
                </div>
              </div>
            )}

            {status.vehicleInfoAge > 0 && (
              <div className="text-xs text-muted-foreground">
                Last updated {Math.floor(status.vehicleInfoAge / 60)} minutes ago
              </div>
            )}
          </div>
        )}

        {!status && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="animate-spin" size={16} />
            Loading vehicle data...
          </div>
        )}
      </CardContent>
    </Card>
  )
}