import type {
  StatusResponse,
  ConfigFormData,
  BLEStatusResponse,
  WiFiStatusResponse,
  DisplayStatusResponse,
  OBDResponse,
} from './types'

const API_BASE = ''

export const api = {
  async getStatus(): Promise<StatusResponse> {
    const res = await fetch(`${API_BASE}/status`)
    return res.json()
  },

  async saveConfig(data: ConfigFormData): Promise<void> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    await fetch(`${API_BASE}/save`, {
      method: 'POST',
      body: formData,
    })
  },

  async testConfig(data: ConfigFormData): Promise<void> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    await fetch(`${API_BASE}/test`, {
      method: 'POST',
      body: formData,
    })
  },

  async connect(): Promise<void> {
    await fetch(`${API_BASE}/connect`, { method: 'POST' })
  },

  async disconnect(): Promise<void> {
    await fetch(`${API_BASE}/disconnect`, { method: 'POST' })
  },

  async getBLEStatus(): Promise<BLEStatusResponse> {
    const res = await fetch(`${API_BASE}/ble/status`)
    return res.json()
  },

  async scanBLE(): Promise<void> {
    await fetch(`${API_BASE}/ble/scan`, { method: 'POST' })
  },

  async connectBLEDevice(address: string, name: string, attempts = 3): Promise<void> {
    const formData = new FormData()
    formData.append('address', address)
    formData.append('name', name)
    formData.append('attempts', String(attempts))
    await fetch(`${API_BASE}/ble/connect-device`, {
      method: 'POST',
      body: formData,
    })
  },

  async getWiFiStatus(): Promise<WiFiStatusResponse> {
    const res = await fetch(`${API_BASE}/wifi/status`)
    return res.json()
  },

  async scanWiFi(): Promise<void> {
    await fetch(`${API_BASE}/wifi/scan`, { method: 'POST' })
  },

  async connectWiFi(ssid: string, password: string, mode: string): Promise<void> {
    const formData = new FormData()
    formData.append('ssid', ssid)
    formData.append('password', password)
    formData.append('mode', mode)
    await fetch(`${API_BASE}/wifi/connect`, {
      method: 'POST',
      body: formData,
    })
  },

  async disconnectWiFi(): Promise<void> {
    await fetch(`${API_BASE}/wifi/disconnect`, { method: 'POST' })
  },

  async saveWiFi(): Promise<void> {
    await fetch(`${API_BASE}/wifi/save`, { method: 'POST' })
  },

  async saveSettings(data: {
    devMode: boolean
    wifiMode: string
    staSsid: string
    staPassword: string
    apSsid: string
    apPassword: string
  }): Promise<void> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      body: formData,
    })
  },

  async refreshVehicleInfo(): Promise<void> {
    await fetch(`${API_BASE}/settings/vehicle-refresh`, { method: 'POST' })
  },

  async sendOBDCommand(cmd: string): Promise<OBDResponse> {
    const formData = new FormData()
    formData.append('cmd', cmd)
    const res = await fetch(`${API_BASE}/dev/obd-send`, {
      method: 'POST',
      body: formData,
    })
    return res.json()
  },

  async displayLogo(): Promise<void> {
    await fetch(`${API_BASE}/dev/display-logo`, { method: 'POST' })
  },

  async getDisplayStatus(): Promise<DisplayStatusResponse> {
    const res = await fetch(`${API_BASE}/dev/display-status`)
    return res.json()
  },

  async displayPattern(pattern: 'bars' | 'grid' | 'ui'): Promise<void> {
    const formData = new FormData()
    formData.append('pattern', pattern)
    await fetch(`${API_BASE}/dev/display-pattern`, {
      method: 'POST',
      body: formData,
    })
  },
}