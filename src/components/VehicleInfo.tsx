import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@phosphor-icons/react'
import type { StatusResponse } from '@/lib/types'

interface VehicleInfoProps {
  status: StatusResponse | null
}

export default function VehicleInfo({ status }: VehicleInfoProps) {
  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="animate-spin" size={16} />
            Loading vehicle data...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
        <CardDescription>Data from OBD-II connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Model</div>
            <div className="font-medium">{status.vehicleModel || 'Unknown'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">VIN</div>
            <div className="font-mono text-sm">{status.vehicleVin || 'N/A'}</div>
          </div>
        </div>

        {status.vehicleDiag && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Diagnostic Info</div>
            <div className="text-sm">{status.vehicleDiag}</div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {status.vehicleInfoRequestRunning && (
            <Badge variant="secondary" className="gap-1.5">
              <Spinner className="animate-spin" size={14} />
              Syncing...
            </Badge>
          )}
          {status.vehicleInfoReady && (
            <Badge variant="default">
              Data Ready
            </Badge>
          )}
          {status.vehicleInfoAge > 0 && (
            <span className="text-xs text-muted-foreground">
              Last updated {Math.floor(status.vehicleInfoAge / 60)}m ago
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{status.rpm}</div>
            <div className="text-xs text-muted-foreground">RPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{status.speed}</div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{status.gear}</div>
            <div className="text-xs text-muted-foreground">Gear</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}