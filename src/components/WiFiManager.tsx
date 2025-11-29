import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, WifiHigh, WifiSlash, LinkBreak } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { WiFiStatusResponse, WiFiNetwork } from '@/lib/types'

export default function WiFiManager() {
  const [wifiStatus, setWifiStatus] = useState<WiFiStatusResponse | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null)
  const [password, setPassword] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getWiFiStatus()
        setWifiStatus(data)
      } catch (error) {
        console.error('Failed to fetch WiFi status:', error)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleScan = async () => {
    setIsScanning(true)
    try {
      await api.scanWiFi()
      toast.success('WiFi scan started')
    } catch (error) {
      toast.error('Failed to start scan')
    } finally {
      setTimeout(() => setIsScanning(false), 3000)
    }
  }

  const handleNetworkSelect = (network: WiFiNetwork) => {
    setSelectedNetwork(network)
    setPassword('')
    setShowPasswordDialog(true)
  }

  const handleConnect = async () => {
    if (!selectedNetwork || !wifiStatus) return

    try {
      await api.connectWiFi(selectedNetwork.ssid, password, wifiStatus.mode)
      toast.success(`Connecting to ${selectedNetwork.ssid}`)
      setShowPasswordDialog(false)
      setPassword('')
    } catch (error) {
      toast.error('Failed to connect')
    }
  }

  const handleDisconnect = async () => {
    try {
      await api.disconnectWiFi()
      toast.success('Disconnected from WiFi')
    } catch (error) {
      toast.error('Failed to disconnect')
    }
  }

  const getSignalBars = (rssi: number): number => {
    if (rssi >= -50) return 4
    if (rssi >= -60) return 3
    if (rssi >= -70) return 2
    return 1
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>WiFi Configuration</CardTitle>
          <CardDescription>Manage network connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {wifiStatus?.staConnected ? (
                    <WifiHigh className="text-primary" size={20} />
                  ) : (
                    <WifiSlash className="text-muted-foreground" size={20} />
                  )}
                  <span className="font-medium">
                    {wifiStatus?.staConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                {wifiStatus?.currentSsid && (
                  <p className="text-sm text-muted-foreground">
                    Network: {wifiStatus.currentSsid}
                  </p>
                )}
                {wifiStatus?.staIp && (
                  <p className="text-sm text-muted-foreground font-mono">
                    IP: {wifiStatus.staIp}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={!wifiStatus?.staConnected}
                >
                  <LinkBreak weight="bold" size={16} />
                  Disconnect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  <MagnifyingGlass weight="bold" size={16} />
                  Scan
                </Button>
              </div>
            </div>

            {wifiStatus?.mode && (
              <div className="space-y-3">
                <Label>WiFi Mode</Label>
                <Select value={wifiStatus.mode} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AP_ONLY">Access Point Only</SelectItem>
                    <SelectItem value="STA_ONLY">Station Only</SelectItem>
                    <SelectItem value="STA_WITH_AP_FALLBACK">Station with AP Fallback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {wifiStatus?.apActive && (
              <div className="p-3 rounded-lg bg-secondary/50 space-y-1">
                <div className="text-sm font-medium">Access Point Active</div>
                <div className="text-sm text-muted-foreground">
                  Clients: {wifiStatus.apClients} | IP: {wifiStatus.apIp}
                </div>
              </div>
            )}

            {wifiStatus?.staLastError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-sm text-destructive">{wifiStatus.staLastError}</div>
              </div>
            )}
          </div>

          {wifiStatus && wifiStatus.scanResults.length > 0 && (
            <div className="space-y-3">
              <Label>Available Networks</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {wifiStatus.scanResults.map((network, index) => (
                  <button
                    key={index}
                    onClick={() => handleNetworkSelect(network)}
                    className="w-full p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WifiHigh size={20} />
                        <span className="font-medium">{network.ssid}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-sm ${
                                i < getSignalBars(network.rssi)
                                  ? 'bg-primary'
                                  : 'bg-muted-foreground/20'
                              }`}
                              style={{ height: `${(i + 1) * 4}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {network.rssi} dBm
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wifiStatus?.staConnecting && (
            <Badge variant="secondary">Connecting...</Badge>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to WiFi</DialogTitle>
            <DialogDescription>
              Enter password for {selectedNetwork?.ssid}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConnect()
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}