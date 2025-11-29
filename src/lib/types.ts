export interface StatusResponse {
  rpm: number
  maxRpm: number
  speed: number
  gear: number
  lastTx: string
  lastObd: string
  connected: boolean
  autoReconnect: boolean
  vehicleVin: string
  vehicleModel: string
  vehicleDiag: string
  vehicleInfoRequestRunning: boolean
  vehicleInfoReady: boolean
  vehicleInfoAge: number
  devMode?: boolean
}

export interface ConfigFormData {
  mode: string
  brightness: number
  autoscale: boolean
  fixedMaxRpm: number
  greenEndPct: number
  yellowEndPct: number
  blinkStartPct: number
  greenColor: string
  yellowColor: string
  redColor: string
  greenLabel: string
  yellowLabel: string
  redLabel: string
  logoIgnOn: boolean
  logoEngStart: boolean
  logoIgnOff: boolean
  autoReconnect?: boolean
}

export interface BLEDevice {
  address: string
  name: string
  rssi?: number
}

export interface BLEStatusResponse {
  scanning: boolean
  connected: boolean
  currentDevice?: BLEDevice
  devices: BLEDevice[]
}

export interface WiFiNetwork {
  ssid: string
  rssi: number
}

export interface WiFiStatusResponse {
  mode: 'AP_ONLY' | 'STA_ONLY' | 'STA_WITH_AP_FALLBACK'
  apActive: boolean
  apClients: number
  apIp: string
  staConnected: boolean
  staConnecting: boolean
  staLastError: string
  currentSsid: string
  staIp: string
  scanRunning: boolean
  scanResults: WiFiNetwork[]
}

export interface DisplayStatusResponse {
  ready: boolean
  touchReady: boolean
  lastError: string
  width: number
  height: number
}

export interface OBDResponse {
  lastTx: string
  lastObd: string
}