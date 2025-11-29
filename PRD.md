# RPM Counter ESP32 Web Interface - Product Requirements

A modern, automotive-inspired web interface prototype for an ESP32-based shift light system with OBD-II integration, designed to demonstrate the functionality before conversion to standalone HTML/CSS/JS files.

**Project Status:** ✅ Core Implementation Complete (v1.0)  
**Last Updated:** 2024  
**Current Phase:** Feature Complete - Ready for ESP32 Integration

**Experience Qualities**:
1. **Automotive** - Professional dark interface with technical precision inspired by racing instrumentation
2. **Tactile** - All controls feel responsive and immediate with clear visual feedback for embedded device interaction
3. **Diagnostic** - Transparent system status with real-time monitoring and debug capabilities for development

**Complexity Level**: Light Application (multiple features with basic state)
- This is a configuration and monitoring interface for embedded hardware with real-time status updates, multiple configuration panels, and developer diagnostic tools

## Essential Features

### ✅ ShiftLight Configuration Panel (IMPLEMENTED)
- **Functionality**: Configure LED behavior including mode, brightness, color zones, and RPM thresholds
- **Purpose**: Allow users to customize their shift light display to match driving style and vehicle characteristics
- **Trigger**: Primary page load, accessed via main navigation
- **Progression**: View current settings → Adjust sliders/pickers → Preview LED simulation → Test pattern → Save to ESP32
- **Success criteria**: ✓ All form values persist to ESP32 via POST /save, ✓ live preview reflects current settings, ✓ validation prevents invalid threshold combinations
- **Implementation Notes:**
  - Three LED modes: Casual, F1-Style, Überempfindlich
  - Brightness slider (0-255) with live display
  - Auto-scale toggle or fixed max RPM input
  - Three threshold percentage sliders with real-time validation
  - Color pickers for green/yellow/red zones with custom labels
  - Live LED preview bar with gradient visualization
  - Test pattern button triggers /test endpoint
  - Save button posts FormData to /save endpoint

### ✅ Vehicle Information Display (IMPLEMENTED)
- **Functionality**: Display VIN, model, diagnostic codes, and synchronization status from OBD-II
- **Purpose**: Confirm correct vehicle pairing and provide diagnostic transparency
- **Trigger**: Automatic polling from /status endpoint every 2.5 seconds
- **Progression**: Display cached info → Show sync status → Allow manual refresh → Update with new data
- **Success criteria**: ✓ Real-time updates visible, ✓ sync progress indicated, ✓ errors clearly communicated
- **Implementation Notes:**
  - Compact card on ShiftLight page showing VIN, model, diagnostic codes
  - Color-coded sync status badges (green=synced, yellow=syncing, red=error)
  - Auto-refresh from /status polling
  - Manual refresh available in Settings → Vehicle Sync section
  - Graceful handling of missing data with placeholder states

### ✅ WiFi Management (IMPLEMENTED)
- **Functionality**: Scan, connect, and configure WiFi in AP/STA modes
- **Purpose**: Enable ESP32 network connectivity without serial console
- **Trigger**: Settings page, WiFi configuration section
- **Progression**: View current status → Scan networks → Select SSID → Enter password → Confirm connection → Show IP assignment
- **Success criteria**: ✓ Network list displays with signal strength, ✓ connection status updates in real-time, ✓ mode switching works reliably
- **Implementation Notes:**
  - WiFi mode selector: AP Only, STA Only, STA with AP Fallback
  - Network scanner with RSSI signal strength bars (Excellent/Good/Fair/Weak)
  - Current connection card showing SSID, IP, signal strength
  - Connect/disconnect buttons with loading states
  - Dialog for password entry when connecting
  - Endpoints: /wifi/status, /wifi/scan, /wifi/connect, /wifi/disconnect

### ✅ Bluetooth LE Device Pairing (IMPLEMENTED)
- **Functionality**: Scan for and pair with OBD-II BLE adapters
- **Purpose**: Establish connection to vehicle's OBD-II port wirelessly
- **Trigger**: Settings page, Bluetooth section or main page dev mode
- **Progression**: Scan devices → Display available adapters → Select target → Connect with retry logic → Show connection status
- **Success criteria**: ✓ Paired device persists, ✓ connection status updates, ✓ auto-reconnect configurable
- **Implementation Notes:**
  - BLE scanner with device name and MAC address display
  - Connection status card showing paired device and signal strength
  - Auto-reconnect toggle (persists via /save endpoint)
  - Manual connect/disconnect buttons
  - Loading states during scanning and connection attempts
  - Status badge colors: connected (green), connecting (yellow), disconnected (red)
  - Endpoints: /ble/status, /ble/scan, /ble/connect-device, /connect, /disconnect
  - Dev mode panel on ShiftLight page for quick BLE controls

### ✅ Developer Console (IMPLEMENTED)
- **Functionality**: Send raw OBD commands, view responses, monitor display hardware, trigger test patterns
- **Purpose**: Enable debugging and advanced configuration for development
- **Trigger**: Developer mode toggle in settings
- **Progression**: Enable dev mode → Access debug panels → Send commands → View formatted responses → Test display patterns
- **Success criteria**: ✓ Commands execute successfully, ✓ responses formatted clearly, ✓ display tests trigger correctly
- **Implementation Notes:**
  - Developer mode toggle in Settings page (persists via /settings endpoint)
  - When enabled, shows dev mode panel on ShiftLight page
  - **BLE Quick Controls:** Connect/disconnect buttons, auto-reconnect toggle
  - **Display Debug Section:** Hardware status display, test pattern triggers (rainbow, solid colors, blink)
  - **OBD Console (Settings page):** Raw command input, response log viewer, auto-log toggle
  - Console shows TX (sent commands) and RX (responses) with monospace formatting
  - Auto-scroll to latest log entries
  - Custom scrollbar styling matching theme colors
  - Endpoints: /dev/obd-send, /dev/display-status, /dev/display-pattern, /dev/display-logo

## Edge Case Handling

**Implemented:**
- ✓ **Network Timeout**: Show loading states with timeout fallback, display connection errors prominently
- ✓ **Invalid Configuration**: Validate threshold percentages client-side, prevent impossible color zone overlaps
- ✓ **Missing Vehicle Data**: Display placeholder states when VIN/model unavailable, clear messaging for sync failures
- ✓ **BLE Connection Loss**: Auto-reconnect indication, manual reconnect button, connection status always visible
- ✓ **Dev Mode Disabled**: Hide advanced panels cleanly, no broken UI elements when features unavailable

**Additional Considerations:**
- Form validation prevents saving when thresholds overlap (greenEnd < yellowEnd < blinkStart)
- API calls include error handling with user-friendly toast notifications
- Loading states prevent duplicate requests
- Polling gracefully continues even when endpoints return errors
- Mobile responsive layout handles all screen sizes (320px to 4K)

## Design Direction
The interface should evoke the precision and technical sophistication of motorsport instrumentation - a dark, focused cockpit environment with electric blue accents that feel energetic and technical. The design should be minimal and functional, prioritizing clarity and quick access to critical controls over decorative elements.

## Color Selection
Custom palette with automotive racing inspiration using electric blue as the primary accent against deep blacks.

- **Primary Color**: Electric Blue (oklch(0.65 0.22 240)) - Technical, precise, energetic - used for active controls, status indicators, and interactive elements
- **Secondary Colors**: 
  - Deep Charcoal (oklch(0.18 0.01 240)) for cards and elevated surfaces
  - Near Black (oklch(0.12 0 0)) for main background creating depth
- **Accent Color**: Cyan Highlight (oklch(0.75 0.15 200)) - Bright attention-grabbing color for CTAs, active states, and success indicators
- **Foreground/Background Pairings**:
  - Background (Near Black oklch(0.12 0 0)): Light Gray text (oklch(0.92 0 0)) - Ratio 14.1:1 ✓
  - Card (Deep Charcoal oklch(0.18 0.01 240)): Light Gray text (oklch(0.92 0 0)) - Ratio 10.2:1 ✓
  - Primary (Electric Blue oklch(0.65 0.22 240)): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
  - Accent (Cyan oklch(0.75 0.15 200)): Black text (oklch(0.12 0 0)) - Ratio 10.5:1 ✓
  - Destructive (Red oklch(0.60 0.22 25)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Muted (Dark Gray oklch(0.25 0.01 240)): Medium Gray text (oklch(0.65 0 0)) - Ratio 4.6:1 ✓

## Font Selection
Clean, technical sans-serif typography that emphasizes precision and readability in monitoring contexts, using system fonts for zero-latency loading.

- **Typographic Hierarchy**:
  - H1 (Page Titles): SF Pro Display/Segoe UI Bold/32px/tight tracking - Command headers
  - H2 (Section Headers): SF Pro Display/Segoe UI Semibold/24px/normal tracking - Feature groups
  - H3 (Card Titles): SF Pro/Segoe UI Medium/18px/normal tracking - Configuration blocks
  - Body (Controls & Status): SF Pro/Segoe UI Regular/16px/relaxed leading - Primary content
  - Caption (Labels & Metadata): SF Pro/Segoe UI Regular/14px/tight leading - Secondary info
  - Mono (Technical Data): SF Mono/Consolas/14px/fixed spacing - VIN, MAC addresses, OBD codes

## Animations
Subtle, purposeful motion that communicates state changes and provides feedback without feeling frivolous - animations should reinforce the technical nature of the interface.

- **Purposeful Meaning**: Quick snappy transitions (150-200ms) for controls, smooth status updates for real-time data, pulsing indicators for active connections
- **Hierarchy of Movement**: 
  - Critical: Connection status, sync progress, error states - immediate attention
  - Interactive: Button presses, toggle switches, slider adjustments - tactile feedback
  - Ambient: Live data polling, background sync - subtle non-distracting updates

## Component Selection
- **Components**: 
  - Slider for numeric ranges (brightness, threshold percentages) with live value display
  - Switch for binary toggles (dev mode, auto-reconnect, logo enables)
  - Card for content grouping (configuration panels, status displays)
  - Badge for status indicators (connected/disconnected, WiFi signal strength)
  - Dialog for secondary flows (WiFi password entry, OBD device selection)
  - Tabs for main navigation (ShiftLight Setup / Settings)
  - Progress for sync operations (vehicle data refresh, BLE scanning)
  - Input with color picker integration for RGB zone configuration
  - Table for network/device lists with action buttons
  - Textarea/Console-style for OBD command output with monospace formatting
- **Customizations**: 
  - LED preview bar - custom SVG visualization showing color zones and blink threshold
  - Signal strength indicator - custom RSSI bars for WiFi scanning
  - Connection status "traffic light" - custom tri-state indicator for BLE
  - OBD console - custom log output with TX/RX prefixing and syntax highlighting
- **States**: 
  - Buttons: Default (electric blue), Hover (brighter blue), Active (pressed inset), Disabled (muted gray), Loading (spinner overlay)
  - Sliders: Dragging shows enlarged thumb, value tooltip, color preview for RGB sliders
  - Switches: Smooth slide animation with track color change, haptic-style feedback
  - Inputs: Focus ring in accent color, validation states (error red border), success checkmark
- **Icon Selection**: 
  - Phosphor icons: Bluetooth/BluetoothConnected for BLE status
  - Gauge for RPM/shift light features
  - Wifi/WifiHigh for network status
  - Gear for settings
  - Play/Pause for test/stop
  - MagnifyingGlass for scanning
  - FloppyDisk for save actions
  - ArrowClockwise for refresh/rescan
  - Warning for errors and thresholds
- **Spacing**: 
  - Cards: p-6 (24px padding)
  - Sections within cards: gap-4 (16px between groups)
  - Form elements: gap-3 (12px between label and input)
  - Grid layouts: gap-6 on desktop, gap-4 on mobile
  - Page margins: max-w-7xl centered with px-4 mobile, px-6 desktop
- **Mobile**: 
  - ✓ Single column card layout on <768px
  - ✓ Full-width buttons with min-h-12 touch targets
  - ✓ Collapsible sections for dev mode panels
  - ✓ Dialogs for WiFi/BLE selection on all screen sizes
  - ✓ Sticky navigation tabs at top
  - ✓ Larger sliders and toggles for finger interaction
  - ✓ Custom scrollbars with theme colors (primary thumb on secondary track)

## Future Enhancements

### 🔄 In Progress
- [ ] Export configuration to JSON file (ExportButton component placeholder exists)
- [ ] Import configuration from JSON file

### 📅 Planned Features
- [ ] **Configuration Presets**: Save/load multiple custom profiles for different driving scenarios
- [ ] **Firmware Update**: Over-the-air (OTA) firmware updates via web interface
- [ ] **Advanced Diagnostics**: Real-time charts for RPM, vehicle speed, throttle position
- [ ] **System Logs**: Export debug logs and error history for troubleshooting
- [ ] **BLE Device History**: Remember previously paired devices for quick reconnection
- [ ] **OBD Command Templates**: Predefined commands for common diagnostics
- [ ] **Theme Customization**: User-selectable color schemes (keep automotive feel)
- [ ] **Multi-language Support**: Internationalization for global users

### Technical Debt / Improvements
- [ ] Optimize polling strategy (reduce frequency when no changes detected)
- [ ] Add WebSocket support for real-time updates (replace polling)
- [ ] Implement service worker for offline functionality
- [ ] Add unit tests for critical form validation logic
- [ ] Create E2E tests for ESP32 integration scenarios
- [ ] Optimize bundle size for faster ESP32 SPIFFS loading

## ESP32 Integration Checklist

When implementing this design in your ESP32 Arduino project:

- [ ] Implement all required endpoints (see README.md for full list)
- [ ] Return proper JSON responses matching TypeScript interfaces in `src/lib/types.ts`
- [ ] Handle CORS headers if accessing from different origin during development
- [ ] Implement FormData parsing for POST /save endpoint
- [ ] Add SPIFFS file system support for serving HTML/CSS/JS
- [ ] Configure AsyncWebServer or ESPAsyncWebServer
- [ ] Test WiFi AP mode for initial setup
- [ ] Implement BLE scanning and pairing logic
- [ ] Add OBD-II PID request/response handling
- [ ] Create LED strip controller with WS2812B support
- [ ] Implement EEPROM/Preferences storage for configuration persistence
- [ ] Add error handling and logging for all endpoints
- [ ] Test on actual hardware with real OBD-II adapter
- [ ] Optimize memory usage (ESP32 has limited RAM)
- [ ] Consider SPIFFS vs LittleFS for file system (LittleFS recommended)
