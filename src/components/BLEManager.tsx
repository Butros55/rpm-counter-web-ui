import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BluetoothConnected, BluetoothSlash, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useBLEHistory } from '@/hooks/use-ble-history'
import type { BLEStatusResponse, BLEDevice } from '@/lib/types'

export default function BLEManager() {
  const [bleStatus, setBleStatus] = useState<BLEStatusResponse | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showDeviceDialog, setShowDeviceDialog] = useState(false)
  const { addConnectionAttempt } = useBLEHistory()
  
  const connectionStartTime = useRef<number | null>(null)
  const previousConnectionStatus = useRef<boolean>(false)
  const currentDeviceRef = useRef<BLEDevice | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getBLEStatus()
        setBleStatus(data)
        
        if (data.currentDevice) {
          currentDeviceRef.current = data.currentDevice
          
          if (data.connected && !previousConnectionStatus.current) {
            connectionStartTime.current = Date.now()
            addConnectionAttempt(data.currentDevice, true)
          }
          
          if (!data.connected && previousConnectionStatus.current && connectionStartTime.current) {
            const duration = Date.now() - connectionStartTime.current
            if (currentDeviceRef.current) {
              addConnectionAttempt(currentDeviceRef.current, false, duration, 'Disconnected')
            }
            connectionStartTime.current = null
          }
          
          previousConnectionStatus.current = data.connected
        }
      } catch (error) {
        console.error('Failed to fetch BLE status:', error)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [addConnectionAttempt])

  const handleScan = async () => {
    setIsScanning(true)
    try {
      await api.scanBLE()
      toast.success('BLE scan started')
      setShowDeviceDialog(true)
    } catch (error) {
      toast.error('Failed to start scan')
    } finally {
      setTimeout(() => setIsScanning(false), 5000)
    }
  }

  const handleConnectDevice = async (device: BLEDevice) => {
    try {
      await api.connectBLEDevice(device.address, device.name)
      toast.success(`Connecting to ${device.name}`)
      setShowDeviceDialog(false)
      connectionStartTime.current = Date.now()
      currentDeviceRef.current = device
    } catch (error) {
      toast.error('Failed to connect to device')
      addConnectionAttempt(device, false, undefined, 'Connection failed')
    }
  }

  const getConnectionStatus = (): { label: string; color: 'default' | 'secondary' | 'destructive' } => {
    if (!bleStatus) return { label: 'Unknown', color: 'secondary' }
    if (bleStatus.connected) return { label: 'Connected', color: 'default' }
    if (bleStatus.scanning) return { label: 'Scanning', color: 'secondary' }
    return { label: 'Disconnected', color: 'destructive' }
  }

  const status = getConnectionStatus()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bluetooth Connection</CardTitle>
          <CardDescription>Manage OBD-II BLE adapter connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {bleStatus?.connected ? (
                  <BluetoothConnected className="text-primary" size={20} />
                ) : (
                  <BluetoothSlash className="text-muted-foreground" size={20} />
                )}
                <Badge variant={status.color}>{status.label}</Badge>
              </div>
              {bleStatus?.currentDevice && (
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{bleStatus.currentDevice.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {bleStatus.currentDevice.address}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleScan}
              disabled={isScanning}
            >
              <MagnifyingGlass weight="bold" size={16} />
              Scan Devices
            </Button>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">Connection Status</div>
              <div className="flex gap-2">
                {[
                  { active: bleStatus?.connected, label: 'Connected' },
                  { active: bleStatus?.scanning, label: 'Scanning' },
                  { active: !bleStatus?.connected && !bleStatus?.scanning, label: 'Idle' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      item.active ? 'bg-primary' : 'bg-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeviceDialog} onOpenChange={setShowDeviceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Available BLE Devices</DialogTitle>
            <DialogDescription>
              Select an OBD-II adapter to connect
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bleStatus && bleStatus.devices.length > 0 ? (
              bleStatus.devices.map((device, index) => (
                <button
                  key={index}
                  onClick={() => handleConnectDevice(device)}
                  className="w-full p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
                >
                  <div className="font-medium">{device.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    {device.address}
                  </div>
                  {device.rssi !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Signal: {device.rssi} dBm
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {bleStatus?.scanning ? 'Scanning for devices...' : 'No devices found'}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}