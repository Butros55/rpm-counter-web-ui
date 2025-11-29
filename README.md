# RPM Counter - ESP32 Shift Light Web Interface

A modern React-based web interface for configuring and monitoring an ESP32-powered automotive shift light system with OBD-II integration. This application provides a complete reference implementation with export capabilities for embedded ESP32 deployment.

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

# Build for production (React build)
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 📦 Export Options

This application includes two export options for ESP32 deployment:

### Option 1: Vanilla Export (Recommended) ✨ ENHANCED

**Best for:** Production ESP32 devices with limited storage

- **File Size:** ~25KB total (4 files: index.html, settings.html, style.css, app.js)
- **Storage Required:** <100KB on ESP32
- **Appearance:** ~98% visual match to React version (recently improved!)
- **Setup:** Simple - just upload files to LittleFS/SPIFFS
- **Browser Support:** All browsers, no build tools needed

**Recent Improvements:**
- ✨ Enhanced slider styling with better visual feedback
- ✨ Improved color picker with hover effects
- ✨ Smooth toast notifications with slide-in/out animations
- ✨ Better button shadows and hover states matching shadcn
- ✨ LED preview with blink animation
- ✨ Focus rings on all interactive elements
- ✨ Custom themed scrollbars matching color scheme
- ✨ Responsive improvements for mobile devices
- ✨ Loading skeleton states
- ✨ Better card hover effects with subtle lift

**How to use:**
1. Click "Export for ESP32" button in the app
2. Choose "Vanilla Export" tab
3. Download all files or export directly to your `webserver` folder
4. Upload to ESP32 filesystem
5. Configure ESP32 web server to serve files

### Option 2: React Build (Advanced)

**Best for:** ESP32-S3 or boards with ample storage (8MB+)

- **File Size:** ~500KB uncompressed, ~150-250KB gzipped
- **Storage Required:** 1-2MB LittleFS partition
- **Appearance:** 100% identical to development version
- **Setup:** Moderate - requires build process and proper server configuration
- **Features:** Full Framer Motion animations, shadcn components, complete React functionality

**How to use:**
1. Click "Export for ESP32" button in the app
2. Choose "React Build" tab
3. Download the setup package (includes README, Arduino sketch, PlatformIO config)
4. Run `npm run build` in your development environment
5. Upload `dist/` folder to ESP32 LittleFS
6. Follow setup instructions in downloaded README.md

## 📋 Implementation Status

### ✅ Fully Implemented

**ShiftLight Configuration:**
- [x] LED mode selection (Casual, F1-Style, Überempfindlich)
- [x] Brightness slider with live value display (0-255)
- [x] Auto-scale toggle vs fixed max RPM
- [x] Three RPM threshold sliders (green end, yellow end, blink start)
- [x] Color pickers for each RPM zone with custom labels
- [x] Live LED preview bar with color zones and blink threshold
- [x] Coming Home/Leaving animation toggles (M-Logo animations)
- [x] Save/Reset/Test pattern buttons
- [x] Real-time configuration preview

**Vehicle Information:**
- [x] VIN, model, and diagnostic code display
- [x] Sync status monitoring (syncing/synced/error states)
- [x] Data age tracking
- [x] Auto-refresh from /status polling (2.5s interval)
- [x] Manual refresh option in settings

**WiFi Management:**
- [x] Network scanner with RSSI signal strength indicators
- [x] WiFi mode selection (AP Only, STA Only, STA with AP Fallback)
- [x] Current connection status display
- [x] Connect/disconnect functionality
- [x] Password entry dialog for network connection
- [x] Real-time status updates

**Bluetooth LE:**
- [x] BLE device scanner
- [x] Device pairing with MAC address and name
- [x] Connection status monitoring
- [x] Auto-reconnect toggle (dev mode)
- [x] Manual connect/disconnect controls
- [x] Status badge indicators (connected/connecting/disconnected)
- [x] **Connection history tracking (NEW)**
- [x] **Success rate calculation and visualization**
- [x] **Last connection timestamp with relative time**
- [x] **Average connection duration tracking**
- [x] **Recent activity log (last 5 events per device)**
- [x] **Favorite device marking with star icon**
- [x] **Quick reconnect from saved device list**
- [x] **Clear history and remove device options**
- [x] **Persistent storage across sessions**

**Developer Mode:**
- [x] Toggle in settings (persists via useKV)
- [x] BLE quick controls panel on ShiftLight page
- [x] Display hardware status monitoring
- [x] Display test patterns (rainbow, colors, logo)
- [x] OBD console with raw command execution
- [x] TX/RX log viewer with auto-scroll
- [x] Auto-log toggle for live monitoring
- [x] Custom themed scrollbars

**Firmware Update:**
- [x] OTA (Over-The-Air) firmware upload via web interface
- [x] File validation (.bin/.elf, max 2MB)
- [x] Real-time upload progress tracking
- [x] Warning alerts to prevent power interruption
- [x] Success/error status feedback
- [x] ESP32 reboot notification and reconnection guidance
- [x] **Firmware rollback capability (NEW)**
- [x] **Current firmware version and status display**
- [x] **One-click rollback to previous firmware**
- [x] **Automatic rollback after boot failures**
- [x] **Firmware validation workflow**
- [x] **Boot counter tracking**
- [x] Advanced information panel (dev mode only)
- [x] File size display and validation
- [x] Clear file selection with reset capability

**Export Functionality:**
- [x] Vanilla HTML/CSS/JS export (4 files)
- [x] React build setup package export
- [x] File preview with syntax highlighting
- [x] Copy to clipboard for individual files
- [x] Persistent folder selection (File System Access API)
- [x] Direct export to selected folder (defaults to `webserver`)
- [x] Build size analysis and comparison
- [x] Complete deployment documentation generation

**API Integration:**
- [x] All ESP32 endpoints integrated (status, save, test, connect, disconnect)
- [x] BLE endpoints (status, scan, connect-device)
- [x] WiFi endpoints (status, scan, connect, disconnect)
- [x] Settings endpoints (save, vehicle-refresh)
- [x] Developer endpoints (obd-send, display-status, display-pattern, display-logo)
- [x] Real-time polling with 2.5s interval
- [x] Error handling and user feedback via toasts

**UI/UX:**
- [x] Automotive dark theme with electric blue accents
- [x] Mobile-first responsive design
- [x] Smooth animations (Framer Motion)
- [x] Toast notifications (sonner)
- [x] Loading states for async operations
- [x] Custom themed scrollbars
- [x] Accessible form controls
- [x] Clear visual feedback for all interactions

### 🔄 Future Enhancements

- [ ] Configuration presets (save/load custom profiles)
- [ ] Export/Import configuration as JSON
- [ ] Advanced OBD command templates
- [ ] Connection history and saved BLE devices
- [ ] Advanced diagnostic charts
- [ ] System logs export

## 🔧 Integrating with ESP32 Arduino Project

### Recommended Structure

```
your-esp32-project/
├── webserver/           # Export vanilla files here
│   ├── index.html
│   ├── settings.html
│   ├── style.css
│   └── app.js
├── data/               # Or use this for LittleFS upload
│   └── dist/          # For React build option
├── src/
│   └── main.cpp       # Your ESP32 firmware
├── platformio.ini     # PlatformIO config (if using)
└── README.md
```

### Using Vanilla Export

1. **Export Files:**
   - Open the web app
   - Click "Export for ESP32"
   - Select "Vanilla Export" tab
   - Click "Select Folder" and choose your `webserver` directory
   - Files will be saved directly to that folder

2. **Upload to ESP32:**
   - Use Arduino IDE or PlatformIO
   - Upload files to LittleFS/SPIFFS
   - Ensure ESP32 web server serves from root path

3. **ESP32 Web Server Setup:**
```cpp
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>

AsyncWebServer server(80);

void setup() {
  LittleFS.begin();
  
  // Serve static files
  server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");
  
  // API endpoints
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/save", HTTP_POST, handleSave);
  // ... implement other endpoints
  
  server.begin();
}
```

### Using React Build

See `CLAUDE_PROMPT_REACT_BUILD_EXPORT.md` for detailed instructions on building and deploying the full React version.

## 📁 Project Structure

```
/workspaces/spark-template/
├── src/
│   ├── App.tsx                    # Main app with tab navigation
│   ├── components/
│   │   ├── ShiftLightPage.tsx     # Main configuration page
│   │   ├── SettingsPage.tsx       # Settings and advanced features
│   │   ├── ExportButton.tsx       # Export dialog with both options
│   │   ├── LEDPreview.tsx         # Live LED visualization
│   │   ├── VehicleInfo.tsx        # Vehicle data display
│   │   ├── DevModePanel.tsx       # Developer tools
│   │   ├── WiFiManager.tsx        # WiFi management UI
│   │   ├── BLEManager.tsx         # BLE pairing UI
│   │   ├── VehicleSync.tsx        # OBD sync UI
│   │   ├── FirmwareUpdate.tsx     # OTA firmware update with rollback
│   │   └── OBDConsole.tsx         # Raw OBD command console
│   ├── lib/
│   │   ├── api.ts                 # ESP32 API client (vanilla JS compatible)
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── export-generator.ts    # Vanilla export logic
│   │   ├── react-build-export.ts  # React build export logic
│   │   └── utils.ts               # Utility functions
│   ├── index.css                  # Theme and color definitions
│   └── main.tsx                   # React entry point
├── PRD.md                         # Product requirements
├── README.md                      # This file
├── EXPORT_SOLUTION.md             # Export options comparison
├── VANILLA_EXPORT_IMPROVEMENTS.md # Vanilla export enhancement guide
├── ESP32_CONVERSION_GUIDE.md      # React → Vanilla conversion guide
├── CLAUDE_PROMPT_REACT_BUILD_EXPORT.md # React build prompt
└── package.json                   # Dependencies
```

## 🎨 Design System

**Theme:** Automotive dark with electric blue accents

**Color Palette:**
- Background: `oklch(0.12 0 0)` - Near black
- Foreground: `oklch(0.92 0 0)` - Off white
- Primary: `oklch(0.65 0.22 240)` - Electric blue
- Accent: `oklch(0.75 0.15 200)` - Cyan
- Card: `oklch(0.18 0.01 240)` - Dark blue-gray

**Typography:**
- System fonts for zero-latency loading
- Monospace for technical data (VIN, MAC, OBD codes)
- Clear hierarchy for quick scanning

**Components:**
- shadcn/ui v4 for React version
- Custom HTML/CSS components for vanilla export
- Phosphor icons for consistent iconography
- Framer Motion for animations (React only)
- Sonner for toast notifications

## 🔍 Key Files for ESP32 Integration

1. **`src/lib/api.ts`** - All API endpoints with request/response formats
2. **`src/lib/types.ts`** - Data structure interfaces for API responses
3. **`src/index.css`** - Complete color theme (copy CSS variables for your ESP32 UI)
4. **`src/lib/export-generator.ts`** - Vanilla export implementation
5. **`ESP32_CONVERSION_GUIDE.md`** - Detailed React → Vanilla conversion guide

## 🐛 Development Tips

- **API Simulation:** API calls currently return simulated data (see `src/lib/api.ts`)
- **Real Hardware:** Update base URL in exports to point to your ESP32's IP
- **Debugging:** Enable Developer Mode in Settings for debug panels
- **Mobile Testing:** Responsive design tested on all screen sizes
- **Theme Customization:** Edit CSS variables in `src/index.css`
- **Export Testing:** Use File System Access API for direct folder export

## 📚 Documentation Files

- **PRD.md** - Complete product requirements and design specifications
- **README.md** - This file - project overview and getting started
- **EXPORT_SOLUTION.md** - Detailed comparison of export options
- **VANILLA_EXPORT_IMPROVEMENTS.md** - How to improve vanilla export to match React
- **ESP32_CONVERSION_GUIDE.md** - React to vanilla JS conversion examples
- **FIRMWARE_UPDATE_GUIDE.md** - Complete OTA firmware update implementation guide
- **FIRMWARE_ROLLBACK_GUIDE.md** - ⭐ **NEW:** Firmware rollback implementation with auto-recovery
- **CLAUDE_PROMPT_REACT_BUILD_EXPORT.md** - Guide for implementing React build export

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🙏 Acknowledgments

Built with:
- React 19 & TypeScript
- Vite for build tooling
- Tailwind CSS v4 for styling
- shadcn/ui for component library
- Phosphor Icons for iconography
- Framer Motion for animations
- Sonner for toast notifications
