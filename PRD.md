# RPM Counter ESP32 Web Interface - Product Requirements

A modern, automotive-inspired web interface prototype for an ESP32-based shift light system with OBD-II integration, designed to demonstrate the functionality before conversion to standalone HTML/CSS/JS files.

**Project Status:** ✅ Core Implementation Complete (v1.1)  
**Last Updated:** 2024  
**Current Phase:** Feature Complete - Ready for ESP32 Integration + Firmware Rollback

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

### ✅ Export Functionality (IMPLEMENTED)
- **Functionality**: Export the web interface as standalone files for ESP32 deployment in two formats
- **Purpose**: Enable deployment to ESP32 hardware with flexibility for different storage constraints
- **Trigger**: "Export for ESP32" button in header, accessible from any page
- **Progression**: Click export → Choose export type (Vanilla/React Build) → Configure options → Download or save to folder
- **Success criteria**: ✓ Files generate correctly, ✓ Vanilla files match 95%+ visual appearance, ✓ React build includes all setup documentation, ✓ Persistent folder selection works
- **Implementation Notes:**
  - **Vanilla Export Option:**
    - Generates 4 files: index.html, settings.html, style.css, app.js
    - Total size ~20KB - perfect for ESP32 with limited storage
    - Pure HTML/CSS/JavaScript with no dependencies or build tools
    - 95% visual match to React version with CSS animations
    - Includes all functionality (forms, status polling, API integration)
    - Optimized for LittleFS/SPIFFS deployment
  - **React Build Export Option:**
    - Generates setup package with documentation and configuration files
    - Includes README.md with deployment guide (~600KB total size estimates)
    - Includes esp32-server.ino Arduino sketch template
    - Includes platformio.ini for PlatformIO users
    - Provides BUILD_INSTRUCTIONS.md for manual build process
    - Shows size comparison table (Vanilla vs React Build)
    - Warns about storage requirements (1-2MB needed)
    - 100% identical to development version when built
  - **UI Features:**
    - Tabbed interface to choose between export types
    - File preview with syntax highlighting (Prism.js)
    - Copy-to-clipboard for individual files
    - Download individual files or all at once
    - Persistent folder selection using File System Access API
    - Defaults to `webserver` folder name
    - Visual comparison table of both export options
    - Size analysis for React build option
    - Deployment instructions included in UI
  - **File System Integration:**
    - Uses `showDirectoryPicker` API when available
    - Saves selected folder name to useKV for persistence
    - Directly exports to selected folder (replaces existing files)
    - Fallback to browser downloads if API not supported
    - Clear UI feedback when folder is set

### ✅ Firmware Update (IMPLEMENTED)
- **Functionality**: Upload and flash new ESP32 firmware directly through the web interface via OTA (Over-The-Air) updates with automatic rollback protection
- **Purpose**: Enable firmware updates without requiring USB cable connection or external tools, with safety mechanisms to prevent bricked devices
- **Trigger**: Settings page, Firmware Update section
- **Progression**: View firmware status → Select firmware file → Validate file type and size → Upload with progress tracking → ESP32 reboots → Validate new firmware → Mark as stable or rollback
- **Success criteria**: ✓ File validation prevents invalid uploads, ✓ Progress bar shows real-time upload status, ✓ Clear warnings prevent interruption, ✓ Rollback available after update, ✓ Auto-rollback on boot failures, ✓ Firmware status tracking works
- **Implementation Notes:**
  - **Firmware Status Display:**
    - Shows current firmware version and build number
    - Displays firmware status badge: Stable (green), Validating (yellow), Failed (red)
    - Shows boot count since last update
    - Displays previous firmware version when rollback is available
    - Real-time polling of /firmware/info endpoint (every 5 seconds)
  - **Upload Functionality:**
    - File selection with .bin/.elf validation
    - Maximum file size: 2MB (configurable for ESP32 partition schemes)
    - Real-time upload progress bar using XMLHttpRequest progress events
    - Warning alerts about not disconnecting power during update
    - Success confirmation when firmware uploaded successfully
    - Notification that previous firmware is backed up for rollback
    - Error handling with detailed error messages
  - **Rollback Controls:**
    - "Rollback" button appears when previous firmware is available
    - Button disabled during upload operations
    - One-click rollback to previous firmware version
    - Confirmation notifications before and after rollback
    - Manual rollback available at any time after update
  - **Firmware Validation:**
    - New firmware starts in "Validating" status after upload
    - User must click "Mark as Stable" to confirm firmware works
    - Automatic rollback after 3 failed boot attempts
    - Clear prompts to validate or rollback after successful boot
  - **ESP32 Integration:**
    - POST /update endpoint for firmware upload (unchanged)
    - GET /firmware/info endpoint returns version, status, boot count
    - POST /firmware/rollback triggers rollback to previous partition
    - POST /firmware/mark-valid marks firmware as stable
    - Automatic ESP32 reboot notification after successful upload
    - Connection loss handling during reboot cycle
  - **Advanced Information (Dev Mode):**
    - File format requirements
    - Partition scheme notes
    - All endpoint details (update, rollback, info, mark-valid)
    - Typical reboot timing
    - Rollback mechanism explanation
    - Auto-rollback trigger conditions
    - Firmware validation requirements
  - Clear file button to reset selection
  - File size display in human-readable format
  - Disabled state during upload prevents duplicate requests
  - Toast notifications for all major events (validation errors, upload progress, success, errors, rollback initiated)
  - Documentation: FIRMWARE_UPDATE_GUIDE.md and FIRMWARE_ROLLBACK_GUIDE.md

## Edge Case Handling

**Implemented:**
- ✓ **Network Timeout**: Show loading states with timeout fallback, display connection errors prominently
- ✓ **Invalid Configuration**: Validate threshold percentages client-side, prevent impossible color zone overlaps
- ✓ **Missing Vehicle Data**: Display placeholder states when VIN/model unavailable, clear messaging for sync failures
- ✓ **BLE Connection Loss**: Auto-reconnect indication, manual reconnect button, connection status always visible
- ✓ **Dev Mode Disabled**: Hide advanced panels cleanly, no broken UI elements when features unavailable
- ✓ **Export File System Access Denied**: Graceful fallback to browser downloads if folder selection fails or is cancelled
- ✓ **Large React Build Size**: Warning displayed if bundle exceeds typical ESP32 storage limits
- ✓ **Failed Firmware Update**: Automatic rollback after 3 boot failures, manual rollback button always available
- ✓ **Firmware Info Unavailable**: Gracefully handles missing /firmware/info endpoint, shows upload UI anyway
- ✓ **Rollback Not Available**: Disables rollback button when no previous firmware exists (first install)

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
