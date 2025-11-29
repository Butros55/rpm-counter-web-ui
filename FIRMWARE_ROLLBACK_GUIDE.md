# Firmware Rollback Implementation Guide

## Overview

This guide explains how to implement firmware rollback capability on your ESP32 device. The rollback system protects against failed firmware updates by automatically backing up the current firmware and providing both automatic and manual rollback options.

## Key Features

1. **Automatic Backup**: Previous firmware is saved before each update
2. **Validation Period**: New firmware must be explicitly marked as stable
3. **Auto-Rollback**: Automatic rollback after repeated boot failures
4. **Manual Rollback**: User-initiated rollback via web interface
5. **Boot Counter**: Tracks boot attempts to detect unstable firmware
6. **Status Monitoring**: Real-time firmware status and version tracking

## Web Interface Features

### Current Firmware Display
- Shows current firmware version and build number
- Displays firmware status: Stable, Validating, or Failed
- Shows boot count to track stability
- Color-coded status badges for quick recognition

### Rollback Controls
- **Rollback Button**: One-click rollback to previous firmware
- **Mark as Stable**: Confirms new firmware is working correctly
- **Automatic Prompts**: Suggests rollback if firmware is in validating state

### Status Badges
- 🟢 **Stable**: Firmware confirmed working, no rollback timer active
- 🟡 **Validating**: New firmware needs confirmation, auto-rollback enabled
- 🔴 **Failed**: Firmware marked as failed, rollback recommended

## ESP32 Implementation

### Required Partition Scheme

Your ESP32 must use a partition table that supports OTA updates with two app partitions:

```
# partitions.csv
# Name,   Type, SubType, Offset,  Size, Flags
nvs,      data, nvs,     0x9000,  0x5000,
otadata,  data, ota,     0xe000,  0x2000,
app0,     app,  ota_0,   0x10000, 0x140000,
app1,     app,  ota_1,   0x150000,0x140000,
spiffs,   data, spiffs,  0x290000,0x70000,
```

### Required Endpoints

#### 1. GET /firmware/info

Returns current firmware information and rollback status.

**Response JSON:**
```json
{
  "currentVersion": "1.2.0",
  "currentBuild": "20240315-abc123",
  "previousVersion": "1.1.0",
  "previousBuild": "20240301-def456",
  "rollbackAvailable": true,
  "updateStatus": "validating",
  "bootCount": 2,
  "lastUpdateTime": "2024-03-15T10:30:00Z"
}
```

**Fields:**
- `currentVersion`: Current firmware version string
- `currentBuild`: Build identifier or date
- `previousVersion`: Version of the backup firmware (if available)
- `previousBuild`: Build identifier of backup firmware
- `rollbackAvailable`: Boolean indicating if rollback is possible
- `updateStatus`: One of "stable", "validating", or "failed"
- `bootCount`: Number of boots since last update
- `lastUpdateTime`: ISO8601 timestamp of last update

#### 2. POST /firmware/rollback

Triggers rollback to the previous firmware partition.

**Response:**
- 200 OK: Rollback initiated, device will reboot
- 400 Bad Request: No rollback available
- 500 Internal Server Error: Rollback failed

#### 3. POST /firmware/mark-valid

Marks the current firmware as stable and disables auto-rollback.

**Response:**
- 200 OK: Firmware marked as valid
- 500 Internal Server Error: Failed to mark as valid

### Arduino/ESP32 Implementation

```cpp
#include <WiFi.h>
#include <AsyncWebServer.h>
#include <Update.h>
#include <esp_ota_ops.h>
#include <Preferences.h>

AsyncWebServer server(80);
Preferences preferences;

// Firmware version - update this with each build
#define FIRMWARE_VERSION "1.2.0"
#define FIRMWARE_BUILD __DATE__ " " __TIME__

// Maximum boot attempts before auto-rollback
#define MAX_BOOT_ATTEMPTS 3

// Boot counter and validation tracking
struct FirmwareState {
  uint32_t bootCount;
  bool isValidated;
  char currentVersion[32];
  char currentBuild[64];
  char previousVersion[32];
  char previousBuild[64];
  time_t updateTime;
};

FirmwareState fwState;

void initFirmwareTracking() {
  preferences.begin("firmware", false);
  
  // Load firmware state
  fwState.bootCount = preferences.getUInt("bootCount", 0);
  fwState.isValidated = preferences.getBool("validated", false);
  preferences.getString("curVersion", fwState.currentVersion, sizeof(fwState.currentVersion));
  preferences.getString("curBuild", fwState.currentBuild, sizeof(fwState.currentBuild));
  preferences.getString("prevVersion", fwState.previousVersion, sizeof(fwState.previousVersion));
  preferences.getString("prevBuild", fwState.previousBuild, sizeof(fwState.previousBuild));
  fwState.updateTime = preferences.getULong("updateTime", 0);
  
  // Check if this is a new firmware version
  if (strcmp(fwState.currentVersion, FIRMWARE_VERSION) != 0) {
    // New firmware detected - save old version as previous
    strncpy(fwState.previousVersion, fwState.currentVersion, sizeof(fwState.previousVersion));
    strncpy(fwState.previousBuild, fwState.currentBuild, sizeof(fwState.previousBuild));
    strncpy(fwState.currentVersion, FIRMWARE_VERSION, sizeof(fwState.currentVersion));
    strncpy(fwState.currentBuild, FIRMWARE_BUILD, sizeof(fwState.currentBuild));
    
    fwState.bootCount = 0;
    fwState.isValidated = false;
    fwState.updateTime = time(nullptr);
    
    saveFirmwareState();
  }
  
  // Increment boot counter
  fwState.bootCount++;
  preferences.putUInt("bootCount", fwState.bootCount);
  
  // Check for excessive boot failures
  if (!fwState.isValidated && fwState.bootCount >= MAX_BOOT_ATTEMPTS) {
    Serial.println("Boot failure detected - rolling back");
    performRollback();
  }
  
  preferences.end();
}

void saveFirmwareState() {
  preferences.begin("firmware", false);
  preferences.putString("curVersion", fwState.currentVersion);
  preferences.putString("curBuild", fwState.currentBuild);
  preferences.putString("prevVersion", fwState.previousVersion);
  preferences.putString("prevBuild", fwState.previousBuild);
  preferences.putULong("updateTime", fwState.updateTime);
  preferences.putBool("validated", fwState.isValidated);
  preferences.end();
}

void performRollback() {
  const esp_partition_t* current = esp_ota_get_running_partition();
  const esp_partition_t* next = esp_ota_get_next_update_target();
  
  if (next != nullptr) {
    esp_err_t err = esp_ota_set_boot_partition(next);
    if (err == ESP_OK) {
      Serial.println("Rollback successful - rebooting");
      delay(1000);
      ESP.restart();
    } else {
      Serial.println("Rollback failed");
    }
  }
}

void setupFirmwareEndpoints() {
  // GET /firmware/info
  server.on("/firmware/info", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<512> doc;
    
    doc["currentVersion"] = fwState.currentVersion;
    doc["currentBuild"] = fwState.currentBuild;
    doc["previousVersion"] = fwState.previousVersion;
    doc["previousBuild"] = fwState.previousBuild;
    doc["rollbackAvailable"] = strlen(fwState.previousVersion) > 0;
    
    if (fwState.isValidated) {
      doc["updateStatus"] = "stable";
    } else if (fwState.bootCount >= MAX_BOOT_ATTEMPTS) {
      doc["updateStatus"] = "failed";
    } else {
      doc["updateStatus"] = "validating";
    }
    
    doc["bootCount"] = fwState.bootCount;
    doc["lastUpdateTime"] = fwState.updateTime;
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });
  
  // POST /firmware/rollback
  server.on("/firmware/rollback", HTTP_POST, [](AsyncWebServerRequest *request) {
    if (strlen(fwState.previousVersion) == 0) {
      request->send(400, "text/plain", "No previous firmware available");
      return;
    }
    
    request->send(200, "text/plain", "Rollback initiated");
    
    delay(100);
    performRollback();
  });
  
  // POST /firmware/mark-valid
  server.on("/firmware/mark-valid", HTTP_POST, [](AsyncWebServerRequest *request) {
    fwState.isValidated = true;
    preferences.begin("firmware", false);
    preferences.putBool("validated", true);
    preferences.end();
    
    request->send(200, "text/plain", "Firmware marked as valid");
  });
}

void setupOTA() {
  server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request) {
    bool shouldReboot = !Update.hasError();
    
    if (shouldReboot) {
      // Save current firmware info as previous before rebooting
      preferences.begin("firmware", false);
      preferences.putString("prevVersion", FIRMWARE_VERSION);
      preferences.putString("prevBuild", FIRMWARE_BUILD);
      preferences.end();
    }
    
    AsyncWebServerResponse *response = request->beginResponse(
      shouldReboot ? 200 : 500,
      "text/plain",
      shouldReboot ? "OK" : "FAIL"
    );
    response->addHeader("Connection", "close");
    request->send(response);
    
    if (shouldReboot) {
      delay(100);
      ESP.restart();
    }
  }, [](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final) {
    if (!index) {
      Serial.printf("Update Start: %s\n", filename.c_str());
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
        Update.printError(Serial);
      }
    }
    
    if (Update.write(data, len) != len) {
      Update.printError(Serial);
    }
    
    if (final) {
      if (Update.end(true)) {
        Serial.printf("Update Success: %uB\n", index + len);
      } else {
        Update.printError(Serial);
      }
    }
  });
}

void setup() {
  Serial.begin(115200);
  
  // Initialize firmware tracking first
  initFirmwareTracking();
  
  // Setup WiFi, web server, etc.
  // ...
  
  setupOTA();
  setupFirmwareEndpoints();
  
  server.begin();
  
  Serial.printf("Firmware: %s (%s)\n", FIRMWARE_VERSION, FIRMWARE_BUILD);
  Serial.printf("Boot count: %d\n", fwState.bootCount);
  Serial.printf("Validated: %s\n", fwState.isValidated ? "yes" : "no");
}

void loop() {
  // Your main loop code
}
```

## User Workflow

### First Update
1. User uploads new firmware via web interface
2. System backs up current firmware info to NVS
3. New firmware is written to alternate partition
4. ESP32 reboots into new firmware
5. Boot counter starts at 1, status shows "Validating"
6. User tests functionality
7. User clicks "Mark as Stable" to confirm firmware works
8. Status changes to "Stable", auto-rollback disabled

### Automatic Rollback (Failed Update)
1. User uploads new firmware
2. New firmware has a critical bug causing boot loops
3. After 3 failed boot attempts, ESP32 automatically rolls back
4. System boots into previous stable firmware
5. Web interface shows "Failed" status
6. User can try update again with fixed firmware

### Manual Rollback
1. User uploads new firmware
2. New firmware works but has unwanted behavior
3. User clicks "Rollback" button in web interface
4. ESP32 immediately switches to previous firmware
5. System reboots into old firmware
6. User can upload a different version

## Testing Recommendations

### Test Case 1: Successful Update
1. Upload valid firmware
2. Verify boot counter increases
3. Click "Mark as Stable"
4. Verify status changes to "Stable"

### Test Case 2: Manual Rollback
1. Upload new firmware
2. Without marking as stable, click "Rollback"
3. Verify system returns to previous version

### Test Case 3: Auto-Rollback (Simulated)
1. Create test firmware that crashes after 2 successful boots
2. Upload test firmware
3. Wait for 3 boot attempts
4. Verify automatic rollback occurs

### Test Case 4: No Rollback Available
1. Fresh device with no previous firmware
2. Verify "Rollback" button is disabled
3. Upload firmware and mark as stable
4. Upload new firmware
5. Verify "Rollback" button now appears

## Security Considerations

1. **Authentication**: Add authentication to firmware update endpoints in production
2. **Signature Verification**: Consider implementing firmware signature verification
3. **Secure Boot**: Enable ESP32 secure boot for maximum security
4. **HTTPS**: Use HTTPS for firmware uploads in production environments

## Troubleshooting

### Rollback button not appearing
- Check that GET /firmware/info returns `rollbackAvailable: true`
- Verify previous firmware info is stored in NVS
- Ensure at least one firmware update has occurred

### Auto-rollback not working
- Verify `initFirmwareTracking()` is called in `setup()`
- Check boot counter is incrementing (view in Serial Monitor)
- Confirm MAX_BOOT_ATTEMPTS is set correctly (default: 3)

### Rollback fails
- Check that OTA partition scheme has two app partitions
- Verify partition table is flashed correctly
- Check Serial Monitor for error messages

### Status always shows "Validating"
- Ensure user clicks "Mark as Stable" after successful update
- Check that POST /firmware/mark-valid endpoint is working
- Verify preferences storage is functioning

## Export Integration

The firmware update component with rollback capability is automatically included in both export formats:

### Vanilla HTML/CSS/JS Export
- Full rollback UI exported to settings.html
- JavaScript handles all firmware endpoints
- Includes status polling and user controls

### React Native Export
- Rollback functionality documented in REACT_NATIVE_EXPORT_GUIDE.md
- Native module integration for firmware operations
- Platform-specific handling for iOS/Android

## Additional Resources

- [ESP-IDF OTA Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ota.html)
- [Partition Tables](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)
- [ESP32 Update Library](https://github.com/espressif/arduino-esp32/tree/master/libraries/Update)
