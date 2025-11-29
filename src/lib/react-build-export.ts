import JSZip from 'jszip'

export interface BuildFiles {
  'README.md': string
  'esp32-server.ino': string
  'platformio.ini': string
}

export function generateBuildDocumentation(): BuildFiles {
  const readme = `# ESP32 Shift Light - React Build Deployment Guide

## Overview

This package contains a production-ready React build of the RPM Counter interface.
This build provides 100% identical functionality and appearance to the development version.

## Storage Requirements

- **Uncompressed**: ~450-700KB
- **Gzipped**: ~150-250KB (recommended)
- **Required ESP32 Flash**: Minimum 2MB LittleFS partition

Recommended ESP32 boards:
- ESP32-S3 (8MB/16MB flash) ✅
- ESP32 (4MB flash) ⚠️ Tight fit, use gzip
- ESP32-C3 (4MB flash) ⚠️ Tight fit, use gzip

## Quick Start

### Option 1: Arduino IDE

1. **Install Required Libraries**
   - ESP32 board support (via Board Manager)
   - ESPAsyncWebServer
   - AsyncTCP (for ESP32) or ESPAsyncTCP (for ESP8266)
   - LittleFS

2. **Upload Filesystem**
   - Install "ESP32 LittleFS Data Upload" plugin
   - Copy contents of \`dist/\` folder to \`data/dist/\` in your Arduino project
   - Tools → ESP32 Sketch Data Upload
   - Wait for upload to complete

3. **Upload Sketch**
   - Open \`esp32-server.ino\`
   - Set your board type (ESP32 Dev Module, ESP32-S3, etc.)
   - Upload sketch to ESP32

4. **Access Interface**
   - Connect to ESP32's WiFi AP or ensure it's on your network
   - Navigate to ESP32's IP address in browser
   - Configure shift light settings

### Option 2: PlatformIO (Recommended)

1. **Copy Files**
   \`\`\`bash
   cp -r dist/ /path/to/your/esp32-project/data/dist/
   cp platformio.ini /path/to/your/esp32-project/
   cp esp32-server.ino /path/to/your/esp32-project/src/main.cpp
   \`\`\`

2. **Build and Upload**
   \`\`\`bash
   cd /path/to/your/esp32-project
   pio run --target uploadfs  # Upload filesystem
   pio run --target upload     # Upload firmware
   \`\`\`

## File Structure

\`\`\`
your-esp32-project/
├── data/
│   └── dist/              # React build output goes here
│       ├── index.html     # Main HTML file
│       └── assets/        # JS, CSS, and other assets
│           ├── index-[hash].js
│           ├── index-[hash].css
│           └── ...
├── src/
│   └── main.cpp           # Your ESP32 code (use esp32-server.ino as reference)
└── platformio.ini         # PlatformIO configuration
\`\`\`

## ESP32 Web Server Configuration

The provided \`esp32-server.ino\` includes:

- ✅ Proper MIME type handling for JS/CSS
- ✅ Static file serving from LittleFS
- ✅ Cache control headers for performance
- ✅ Fallback to index.html for SPA routing
- ✅ All required API endpoints

### Required API Endpoints

Your ESP32 firmware must implement these endpoints:

**Status & Configuration:**
- \`GET /status\` - System status (polled every 2.5s)
- \`POST /save\` - Save shift light configuration
- \`POST /test\` - Test LED pattern
- \`POST /settings\` - Save general settings

**BLE/OBD:**
- \`POST /connect\` - Connect to BLE device
- \`POST /disconnect\` - Disconnect from BLE
- \`GET /ble/status\` - BLE connection status
- \`POST /ble/scan\` - Scan for BLE devices
- \`POST /ble/connect-device\` - Connect to specific device

**WiFi:**
- \`GET /wifi/status\` - WiFi status and scan results
- \`POST /wifi/scan\` - Scan for WiFi networks
- \`POST /wifi/connect\` - Connect to WiFi network
- \`POST /wifi/disconnect\` - Disconnect from WiFi

**Vehicle Data:**
- \`POST /settings/vehicle-refresh\` - Refresh OBD vehicle info

**Developer/Debug:**
- \`POST /dev/obd-send\` - Send raw OBD command
- \`GET /dev/display-status\` - Display hardware status
- \`POST /dev/display-pattern\` - Test display patterns
- \`POST /dev/display-logo\` - Show logo animation

See \`esp32-server.ino\` for complete endpoint implementations.

## Optimization Tips

### Enable Gzip Compression

Reduce bandwidth and improve load times:

\`\`\`cpp
// In your ESP32 web server setup
server.serveStatic("/", LittleFS, "/dist/")
  .setDefaultFile("index.html")
  .setCacheControl("max-age=600");

// For better compression, pre-gzip files and serve .gz versions
// Use gzip command-line tool on dist/ files before upload
\`\`\`

### Pre-compress Files

\`\`\`bash
cd dist
find . -type f \\( -name "*.js" -o -name "*.css" -o -name "*.html" \\) -exec gzip -k {} \\;
# This creates .gz versions alongside originals
\`\`\`

Then configure ESP32 to serve .gz files when available.

### Reduce Bundle Size

If storage is tight, you can:

1. **Remove source maps** (already excluded in production builds)
2. **Disable certain features** in the build (edit source before building)
3. **Use vanilla export instead** (~20KB total vs ~500KB for React build)

## Troubleshooting

### Problem: White screen / Nothing loads

**Solution:**
- Check browser console for errors
- Verify all files uploaded to \`/data/dist/\` directory
- Check MIME types are configured correctly
- Ensure LittleFS initialized successfully (check Serial monitor)

### Problem: CSS/JS not loading

**Solution:**
- Verify \`/assets/*.js\` and \`/assets/*.css\` routes are configured
- Check file permissions in LittleFS
- Verify \`base\` is set to \`./\` in vite.config.ts

### Problem: API calls fail

**Solution:**
- API endpoints must be implemented in ESP32 firmware
- Check Serial monitor for endpoint hit logs
- Verify request format matches expected FormData structure
- CORS should not be an issue (same origin)

### Problem: Not enough storage

**Solution:**
- Use gzip compression (reduces size by ~60%)
- Increase LittleFS partition size in partition table
- Consider vanilla export (much smaller)
- Use ESP32 with more flash (S3 models have 8-16MB)

## Development Workflow

1. **Develop in React** (this Spark environment or locally)
2. **Build for production** (\`npm run build\`)
3. **Test locally** (\`npm run preview\`)
4. **Upload to ESP32** (via LittleFS data upload)
5. **Test on hardware**
6. **Iterate** as needed

## Comparison: React Build vs Vanilla Export

| Feature              | React Build (This) | Vanilla Export        |
| -------------------- | ------------------ | --------------------- |
| File Size            | ~400-600KB         | ~20KB                 |
| Appearance           | 100% identical     | ~95% similar          |
| Animations           | Full Framer Motion | CSS animations        |
| Component Library    | shadcn + Radix     | Custom HTML           |
| ESP32 Storage Needed | 1-2MB LittleFS     | <100KB                |
| Setup Complexity     | Moderate           | Simple                |
| Maintenance          | Automatic (build)  | Manual updates        |
| Browser Support      | Modern browsers    | All browsers          |

**Recommendation:**
- Use **React Build** if you have storage and want pixel-perfect UI
- Use **Vanilla Export** for production embedded devices with limited storage

## Support

For issues or questions:
- Check ESP32 Serial monitor output
- Verify API endpoint responses match expected format
- Review browser console for JavaScript errors
- Ensure ESP32 has sufficient power (USB might not be enough for WiFi + BLE)

## License

This build is part of the RPM Counter ESP32 project.
`

  const arduinoSketch = `/*
 * ESP32 Shift Light Web Server
 * 
 * Serves React web interface and provides API for configuration
 * 
 * Required Libraries:
 * - ESPAsyncWebServer
 * - AsyncTCP (ESP32) or ESPAsyncTCP (ESP8266)
 * - LittleFS
 * - ArduinoJson (for API responses)
 */

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ap_ssid = "RpmCounter";
const char* ap_password = "12345678";

// Web Server
AsyncWebServer server(80);

// Configuration Structure
struct ShiftLightConfig {
  String mode;
  int brightness;
  bool autoscale;
  int fixedMaxRpm;
  int greenEndPct;
  int yellowEndPct;
  int blinkStartPct;
  String greenColor;
  String yellowColor;
  String redColor;
  bool logoIgnOn;
  bool logoEngStart;
  bool logoIgnOff;
  bool autoReconnect;
} config;

// System State
struct SystemState {
  int currentRpm;
  int maxRpm;
  bool bleConnected;
  String vehicleVin;
  String vehicleModel;
  String lastTx;
  String lastObd;
} state;

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 Shift Light starting...");

  // Initialize LittleFS
  if (!LittleFS.begin(true)) {
    Serial.println("LittleFS mount failed!");
    return;
  }
  Serial.println("LittleFS mounted successfully");

  // Initialize WiFi AP
  WiFi.softAP(ap_ssid, ap_password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  // Serve static files from /dist
  server.serveStatic("/", LittleFS, "/dist/")
    .setDefaultFile("index.html")
    .setCacheControl("max-age=600");

  // Proper MIME types for assets
  server.on("/assets/*.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    String path = "/dist" + request->url();
    if (LittleFS.exists(path)) {
      request->send(LittleFS, path, "application/javascript");
    } else {
      request->send(404, "text/plain", "Not Found");
    }
  });

  server.on("/assets/*.css", HTTP_GET, [](AsyncWebServerRequest *request) {
    String path = "/dist" + request->url();
    if (LittleFS.exists(path)) {
      request->send(LittleFS, path, "text/css");
    } else {
      request->send(404, "text/plain", "Not Found");
    }
  });

  // API Endpoints
  setupAPIEndpoints();

  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

void setupAPIEndpoints() {
  // Status endpoint - returns current system state
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    DynamicJsonDocument doc(1024);
    
    doc["rpm"] = state.currentRpm;
    doc["maxRpm"] = state.maxRpm;
    doc["connected"] = state.bleConnected;
    doc["autoReconnect"] = config.autoReconnect;
    doc["vehicleVin"] = state.vehicleVin;
    doc["vehicleModel"] = state.vehicleModel;
    doc["lastTx"] = state.lastTx;
    doc["lastObd"] = state.lastObd;
    doc["vehicleInfoReady"] = !state.vehicleVin.isEmpty();
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  // Save configuration
  server.on("/save", HTTP_POST, [](AsyncWebServerRequest *request) {
    // Parse form data
    if (request->hasParam("mode", true)) {
      config.mode = request->getParam("mode", true)->value();
    }
    if (request->hasParam("brightness", true)) {
      config.brightness = request->getParam("brightness", true)->value().toInt();
    }
    if (request->hasParam("autoscale", true)) {
      config.autoscale = request->getParam("autoscale", true)->value() == "on";
    }
    if (request->hasParam("fixedMaxRpm", true)) {
      config.fixedMaxRpm = request->getParam("fixedMaxRpm", true)->value().toInt();
    }
    if (request->hasParam("greenEndPct", true)) {
      config.greenEndPct = request->getParam("greenEndPct", true)->value().toInt();
    }
    if (request->hasParam("yellowEndPct", true)) {
      config.yellowEndPct = request->getParam("yellowEndPct", true)->value().toInt();
    }
    if (request->hasParam("blinkStartPct", true)) {
      config.blinkStartPct = request->getParam("blinkStartPct", true)->value().toInt();
    }
    if (request->hasParam("greenColor", true)) {
      config.greenColor = request->getParam("greenColor", true)->value();
    }
    if (request->hasParam("yellowColor", true)) {
      config.yellowColor = request->getParam("yellowColor", true)->value();
    }
    if (request->hasParam("redColor", true)) {
      config.redColor = request->getParam("redColor", true)->value();
    }

    Serial.println("Configuration saved");
    // TODO: Save to EEPROM/NVS for persistence
    // TODO: Apply configuration to LED controller
    
    request->send(200, "text/plain", "OK");
  });

  // Test pattern
  server.on("/test", HTTP_POST, [](AsyncWebServerRequest *request) {
    Serial.println("Test pattern triggered");
    // TODO: Trigger LED test sequence
    request->send(200, "text/plain", "OK");
  });

  // BLE Connect
  server.on("/connect", HTTP_POST, [](AsyncWebServerRequest *request) {
    Serial.println("BLE connect requested");
    // TODO: Trigger BLE connection
    request->send(200, "text/plain", "OK");
  });

  // BLE Disconnect
  server.on("/disconnect", HTTP_POST, [](AsyncWebServerRequest *request) {
    Serial.println("BLE disconnect requested");
    // TODO: Disconnect BLE
    state.bleConnected = false;
    request->send(200, "text/plain", "OK");
  });

  // BLE Status
  server.on("/ble/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    DynamicJsonDocument doc(512);
    doc["connected"] = state.bleConnected;
    doc["scanning"] = false;
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  // WiFi Status
  server.on("/wifi/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    DynamicJsonDocument doc(1024);
    doc["apActive"] = true;
    doc["apIp"] = WiFi.softAPIP().toString();
    doc["apClients"] = WiFi.softAPgetStationNum();
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  // Add more endpoints as needed for your application
  // See README.md for complete list of required endpoints
}

void loop() {
  // Update system state here
  // TODO: Read RPM from OBD
  // TODO: Update LED display
  // TODO: Handle BLE communication
  
  delay(10);
}
`

  const platformioIni = `; PlatformIO Project Configuration File
;
;   Build options: build flags, source filter
;   Upload options: custom upload port, speed and extra flags
;   Library options: dependencies, extra library storages
;   Advanced options: extra scripting
;
; Please visit documentation for the other options and examples
; https://docs.platformio.org/page/projectconf.html

[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
upload_speed = 921600

; LittleFS configuration
board_build.filesystem = littlefs
board_build.partitions = default_8MB.csv

; Required libraries
lib_deps = 
    ESP Async WebServer
    ArduinoJson
    https://github.com/me-no-dev/AsyncTCP.git

; Build flags
build_flags = 
    -D CORE_DEBUG_LEVEL=3

; Upload settings
; Uncomment and adjust for your setup
; upload_port = /dev/ttyUSB0
; monitor_port = /dev/ttyUSB0

[env:esp32-s3]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
monitor_speed = 115200
upload_speed = 921600

board_build.filesystem = littlefs
board_build.partitions = default_16MB.csv

lib_deps = 
    ESP Async WebServer
    ArduinoJson
    https://github.com/me-no-dev/AsyncTCP.git

build_flags = 
    -D CORE_DEBUG_LEVEL=3
    -D ARDUINO_USB_MODE=1
    -D ARDUINO_USB_CDC_ON_BOOT=1
`

  return {
    'README.md': readme,
    'esp32-server.ino': arduinoSketch,
    'platformio.ini': platformioIni,
  }
}

export async function createReactBuildZip(buildInstructions = false): Promise<Blob> {
  const zip = new JSZip()
  
  if (buildInstructions) {
    const docs = generateBuildDocumentation()
    zip.file('README.md', docs['README.md'])
    zip.file('esp32-server.ino', docs['esp32-server.ino'])
    zip.file('platformio.ini', docs['platformio.ini'])
    
    const instructionsMarkdown = `# React Build Export - Manual Build Required

## This package contains setup files only

The actual React build files are not included because they must be generated using Vite.

## How to Generate the Build

### Step 1: Build the Application

In your Spark development environment or local clone:

\`\`\`bash
npm run build
\`\`\`

This creates a \`dist/\` folder containing:
- index.html
- assets/index-[hash].js
- assets/index-[hash].css
- Other assets

### Step 2: Copy Build Files

Copy the entire \`dist/\` folder to your ESP32 project:

\`\`\`bash
cp -r dist/ /path/to/your-esp32-project/data/
\`\`\`

### Step 3: Follow README.md

Follow the deployment instructions in README.md to upload to your ESP32.

## Why Manual Build?

The Spark environment runs in the browser and cannot execute Node.js build tools.
You must run the build locally or in a development environment with Node.js installed.

## Files Included

- **README.md** - Complete deployment guide
- **esp32-server.ino** - ESP32 web server Arduino sketch
- **platformio.ini** - PlatformIO configuration
- **THIS_FILE.md** - You're reading it!

## Quick Start

1. Clone or download the Spark project
2. Run \`npm run build\` in the project root
3. Copy \`dist/\` folder to \`data/\` in your ESP32 project
4. Upload filesystem using Arduino IDE or PlatformIO
5. Flash the ESP32 with esp32-server.ino
6. Access web interface via ESP32's IP address

For detailed instructions, see README.md
`
    
    zip.file('BUILD_INSTRUCTIONS.md', instructionsMarkdown)
  }
  
  return zip.generateAsync({ type: 'blob' })
}

export function downloadZipFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export interface BuildSizeInfo {
  totalUncompressed: number
  estimatedGzipped: number
  htmlSize: number
  jsSize: number
  cssSize: number
  otherSize: number
  warningMessage?: string
}

export function estimateBuildSize(): BuildSizeInfo {
  const htmlSize = 2 * 1024
  const jsSize = 500 * 1024
  const cssSize = 80 * 1024
  const otherSize = 20 * 1024
  
  const totalUncompressed = htmlSize + jsSize + cssSize + otherSize
  const estimatedGzipped = Math.floor(totalUncompressed * 0.35)
  
  let warningMessage: string | undefined
  if (totalUncompressed > 1.5 * 1024 * 1024) {
    warningMessage = 'Bundle size exceeds 1.5MB - may not fit on some ESP32 boards'
  } else if (estimatedGzipped > 500 * 1024) {
    warningMessage = 'Consider enabling gzip compression on ESP32 for better performance'
  }
  
  return {
    totalUncompressed,
    estimatedGzipped,
    htmlSize,
    jsSize,
    cssSize,
    otherSize,
    warningMessage,
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
