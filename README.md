# RPM Counter - ESP32 Shift Light Web Interface

A modern React-based web interface for configuring and monitoring an ESP32-powered automotive shift light system with OBD-II integration. This prototype demonstrates the full functionality before conversion to standalone HTML/CSS/JS files for embedded ESP32 deployment.

## 🚀 Quick Start in VS Code

### 1. Development Server

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### 2. View in Browser

- **VS Code**: Look for the "Ports" tab in the bottom panel
- **Codespace**: Click the notification to open in browser, or use the "Ports" tab
- **Local**: Navigate to `http://localhost:5173`

### 3. Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 📋 Implementation Status

### ✅ Implemented Features

**ShiftLight Configuration Page:**
- [x] LED mode selection (Casual, F1-Style, Überempfindlich)
- [x] Brightness slider with live value display
- [x] Auto-scale toggle vs fixed max RPM
- [x] Three RPM threshold sliders (green end, yellow end, blink start)
- [x] Color pickers for each RPM zone (green, yellow, red)
- [x] Custom zone labels
- [x] Live LED preview bar showing color zones and blink threshold
- [x] Vehicle info display (VIN, model, diagnostic codes, sync status)
- [x] Coming Home/Leaving animation toggles
- [x] Developer mode panel with BLE controls and display debugging
- [x] Save/Reset/Test pattern buttons
- [x] Auto-reconnect BLE toggle

**Settings Page:**
- [x] Developer mode toggle with persistence
- [x] WiFi management (scan networks, connect, disconnect)
- [x] WiFi mode selection (AP, STA, STA with AP fallback)
- [x] Network list with RSSI signal strength indicators
- [x] Current connection status display
- [x] Vehicle sync with manual refresh
- [x] BLE device scanning and pairing
- [x] BLE connection status monitoring
- [x] OBD console with raw command input
- [x] OBD response log viewer with auto-scroll
- [x] Auto-log toggle for live OBD monitoring

**API Integration:**
- [x] `/status` - Real-time status polling (2.5s interval)
- [x] `/save` - Configuration persistence
- [x] `/test` - LED test pattern trigger
- [x] `/connect`, `/disconnect` - BLE connection control
- [x] `/ble/status`, `/ble/scan`, `/ble/connect-device` - BLE management
- [x] `/wifi/status`, `/wifi/scan`, `/wifi/connect`, `/wifi/disconnect` - WiFi management
- [x] `/settings/vehicle-refresh` - Vehicle data sync
- [x] `/dev/obd-send` - OBD command execution
- [x] `/dev/display-status` - Display hardware status
- [x] `/dev/display-pattern` - Test pattern display
- [x] `/dev/display-logo` - Logo animation trigger

**UI/UX:**
- [x] Automotive dark theme with electric blue accents
- [x] Mobile-first responsive design
- [x] Real-time status updates and polling
- [x] Toast notifications for user feedback
- [x] Loading states and error handling
- [x] Smooth animations and transitions
- [x] Custom themed scrollbars

### 🔄 In Progress

- [ ] Export configuration to JSON file
- [ ] Import configuration from JSON file
- [ ] Advanced OBD command templates
- [ ] Connection history and saved BLE devices

### 📅 Planned Features

- [ ] Configuration presets (save/load custom profiles)
- [ ] Firmware update via web interface
- [ ] Advanced diagnostic charts
- [ ] System logs export

## 🔧 Converting to ESP32 Arduino Project

This React prototype serves as a complete reference implementation. To integrate it into your ESP32 Arduino project:

### Option 1: Export Static Files (Recommended)

1. **Build the production version:**
   ```bash
   npm run build
   ```

2. **Locate the built files:**
   ```
   dist/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   └── index-[hash].css
   ```

3. **Convert to inline HTML (for ESP32):**
   - The build output needs to be inlined into a single HTML file for ESP32 SPIFFS
   - See `ESP32_CONVERSION_GUIDE.md` for detailed instructions

### Option 2: Manual Conversion

1. **Review the component structure:**
   - `src/App.tsx` - Main navigation and tab structure
   - `src/components/ShiftLightPage.tsx` - Main configuration page
   - `src/components/SettingsPage.tsx` - Settings and advanced features
   - `src/lib/api.ts` - All ESP32 API endpoints (vanilla JS compatible)

2. **Extract the color theme:**
   - Copy the CSS variables from `src/index.css` (lines 10-40)
   - These OKLCH colors define the automotive dark theme

3. **Convert React components to HTML:**
   - Replace `className` with `class`
   - Replace JSX expressions `{value}` with JavaScript DOM manipulation
   - Convert `useState` hooks to global variables
   - Convert `useEffect` to `setInterval` for polling

4. **API integration is ready:**
   - `src/lib/api.ts` uses standard fetch API (no React dependencies)
   - Copy these functions directly to your vanilla JS

5. **Reference the conversion guide:**
   - See `ESP32_CONVERSION_GUIDE.md` for step-by-step examples

### Directory Structure for ESP32

```
your-arduino-project/
├── data/                    # SPIFFS filesystem
│   ├── index.html          # Main UI (converted from this React app)
│   ├── style.css           # Extracted CSS theme
│   └── app.js              # Vanilla JS logic
├── RpmCounter.ino          # Main Arduino sketch
├── WebServer.cpp           # ESP32 web server endpoints
├── BLEManager.cpp          # Bluetooth LE logic
├── OBDInterface.cpp        # OBD-II communication
└── DisplayController.cpp   # LED strip control
```

### ESP32 Web Server Endpoints Required

Your Arduino sketch must implement these endpoints (see `src/lib/api.ts` for expected responses):

```cpp
// Status endpoint - polled every 2.5 seconds
server.on("/status", HTTP_GET, handleStatus);

// Configuration
server.on("/save", HTTP_POST, handleSaveConfig);
server.on("/settings", HTTP_POST, handleSaveSettings);

// Testing
server.on("/test", HTTP_POST, handleTestPattern);

// BLE Control
server.on("/connect", HTTP_POST, handleBLEConnect);
server.on("/disconnect", HTTP_POST, handleBLEDisconnect);
server.on("/ble/status", HTTP_GET, handleBLEStatus);
server.on("/ble/scan", HTTP_POST, handleBLEScan);
server.on("/ble/connect-device", HTTP_POST, handleBLEConnectDevice);

// WiFi Control
server.on("/wifi/status", HTTP_GET, handleWiFiStatus);
server.on("/wifi/scan", HTTP_POST, handleWiFiScan);
server.on("/wifi/connect", HTTP_POST, handleWiFiConnect);
server.on("/wifi/disconnect", HTTP_POST, handleWiFiDisconnect);

// Vehicle Data
server.on("/settings/vehicle-refresh", HTTP_POST, handleVehicleRefresh);

// Developer/Debug
server.on("/dev/obd-send", HTTP_POST, handleOBDSend);
server.on("/dev/display-status", HTTP_GET, handleDisplayStatus);
server.on("/dev/display-pattern", HTTP_POST, handleDisplayPattern);
server.on("/dev/display-logo", HTTP_POST, handleDisplayLogo);
```

## 🎨 Design System

**Theme:** Automotive dark with electric blue accents  
**Primary Color:** Electric Blue `oklch(0.65 0.22 240)`  
**Accent Color:** Cyan `oklch(0.75 0.15 200)`  
**Background:** Near Black `oklch(0.12 0 0)`  

**Typography:**
- System fonts for zero-latency loading
- Monospace for technical data (VIN, MAC addresses, OBD codes)
- Clear size hierarchy for quick scanning

**Components:**
- shadcn/ui v4 components
- Phosphor icons for consistent iconography
- Framer Motion for smooth animations
- Sonner for toast notifications

## 📁 Project Structure

```
/workspaces/spark-template/
├── src/
│   ├── App.tsx                    # Main app with tab navigation
│   ├── components/
│   │   ├── ShiftLightPage.tsx     # Main configuration page
│   │   ├── SettingsPage.tsx       # Settings and advanced features
│   │   ├── LEDPreview.tsx         # Live LED zone visualization
│   │   ├── VehicleInfo.tsx        # VIN/model/diagnostic display
│   │   ├── DevModePanel.tsx       # Developer debugging tools
│   │   ├── WiFiManager.tsx        # WiFi scan/connect UI
│   │   ├── BLEManager.tsx         # BLE device pairing UI
│   │   ├── VehicleSync.tsx        # OBD data sync UI
│   │   ├── OBDConsole.tsx         # Raw OBD command console
│   │   └── ExportButton.tsx       # Config export functionality
│   ├── lib/
│   │   ├── api.ts                 # ESP32 API client (vanilla JS compatible)
│   │   ├── types.ts               # TypeScript interfaces
│   │   └── utils.ts               # Utility functions
│   ├── index.css                  # Theme and color definitions
│   └── main.tsx                   # React entry point
├── index.html                     # HTML entry point
├── PRD.md                         # Product requirements document
├── ESP32_CONVERSION_GUIDE.md      # Detailed conversion instructions
└── README.md                      # This file
```

## 🔍 Key Files for ESP32 Integration

1. **`src/lib/api.ts`** - All API endpoints with request/response formats
2. **`src/lib/types.ts`** - Data structure interfaces
3. **`src/index.css`** - Complete color theme (lines 10-40)
4. **`ESP32_CONVERSION_GUIDE.md`** - Step-by-step conversion guide

## 🐛 Development Tips

- **API Simulation:** All API calls currently simulate ESP32 responses (see `src/lib/api.ts`)
- **Real Hardware:** Update `BASE_URL` in `api.ts` to your ESP32's IP address
- **Debugging:** Enable Developer Mode in Settings page for debug panels
- **Mobile Testing:** Responsive design works on all screen sizes
- **Theme Customization:** Edit CSS variables in `src/index.css` root block

## 📚 Documentation

- **PRD.md** - Complete product requirements and design specifications
- **ESP32_CONVERSION_GUIDE.md** - Detailed React → Vanilla JS conversion guide
- **Component Docs:** Each component file has inline documentation

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
