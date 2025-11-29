# Firmware Update Implementation Guide

## Overview

The firmware update feature allows users to upload new ESP32 firmware (.bin files) directly through the web interface without requiring a USB connection. This is implemented using ESP32's built-in OTA (Over-The-Air) update capabilities.

## Web Interface

### Location
- **Settings Page** - Firmware Update card (positioned after WiFi Manager, before Bluetooth)
- Visible to all users, with additional technical details shown when Developer Mode is enabled

### Features

1. **File Selection**
   - Accepts `.bin` and `.elf` files
   - Maximum file size: 2MB (configurable based on your partition scheme)
   - Automatic validation prevents invalid uploads

2. **Upload Progress**
   - Real-time progress bar (0-100%)
   - Progress percentage display
   - Prevents user from leaving page during upload

3. **Status Feedback**
   - Warning alert about not disconnecting power
   - Success notification when firmware uploaded
   - Error messages with specific failure reasons
   - Reboot notification and reconnection guidance

4. **Advanced Information** (Dev Mode Only)
   - File format requirements
   - Partition scheme notes
   - Update endpoint details
   - Typical reboot timing

## ESP32 Implementation

### Required Endpoint

**POST /update**

- **Content-Type:** `multipart/form-data`
- **Form Field:** `firmware` (binary file data)
- **Max Upload Size:** 2MB (or your OTA partition size)
- **Response:** 200 OK on success, 4xx/5xx with error message on failure

### Arduino/ESP32 Implementation Example

```cpp
#include <WiFi.h>
#include <AsyncWebServer.h>
#include <Update.h>

AsyncWebServer server(80);

void setupOTA() {
  // Handle firmware update upload
  server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request) {
    // Upload complete handler
    bool shouldReboot = !Update.hasError();
    
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
    // Handle upload chunks
    if (!index) {
      Serial.printf("Update Start: %s\n", filename.c_str());
      
      // Begin update with the available space
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
        Update.printError(Serial);
      }
    }
    
    // Write chunk to OTA partition
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
  
  // WiFi setup...
  
  setupOTA();
  server.begin();
}
```

### PlatformIO Configuration

Ensure your `platformio.ini` has proper partition scheme:

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino

; OTA partition scheme (adjust based on your needs)
board_build.partitions = default.csv

; Or use min_spiffs for more app space
; board_build.partitions = min_spiffs.csv

; Libraries
lib_deps =
    ESP Async WebServer
    AsyncTCP
```

### Custom Partition Scheme (Optional)

Create `partitions.csv` for custom OTA setup:

```csv
# Name,   Type, SubType, Offset,   Size,     Flags
nvs,      data, nvs,     0x9000,   0x5000,
otadata,  data, ota,     0xe000,   0x2000,
app0,     app,  ota_0,   0x10000,  0x1E0000,
app1,     app,  ota_1,   0x1F0000, 0x1E0000,
spiffs,   data, spiffs,  0x3D0000, 0x30000,
```

Reference in `platformio.ini`:
```ini
board_build.partitions = partitions.csv
```

## Security Considerations

### Recommended Security Measures

1. **Authentication**
   ```cpp
   // Add authentication before allowing firmware updates
   if (!request->authenticate("admin", "your-password")) {
     return request->requestAuthentication();
   }
   ```

2. **Firmware Signature Verification**
   ```cpp
   // Verify firmware signature before flashing
   // This requires signing your firmware builds
   ```

3. **Version Checks**
   ```cpp
   // Only allow newer firmware versions
   const char* currentVersion = "1.2.3";
   // Compare with uploaded firmware version
   ```

4. **Access Control**
   ```cpp
   // Only allow updates when not actively monitoring/logging
   if (isActiveSession) {
     request->send(423, "text/plain", "Device busy");
     return;
   }
   ```

## User Flow

1. **Upload Preparation**
   - User navigates to Settings page
   - Clicks file input to select firmware .bin file
   - File is validated (extension, size)
   - File info displayed (name, size)

2. **Upload Process**
   - User clicks "Upload Firmware" button
   - Warning prevents closing page
   - Progress bar updates in real-time
   - Upload typically takes 10-30 seconds for 1-2MB file

3. **Post-Upload**
   - Success message displayed
   - ESP32 reboots automatically (5-10 seconds)
   - User sees reconnection notification
   - Page attempts to reconnect to ESP32
   - Status polling resumes when ESP32 is back online

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid file type" | Wrong file extension | Ensure file is `.bin` or `.elf` |
| "File too large" | Exceeds 2MB | Check partition scheme, recompile with smaller firmware |
| "Network error" | Connection lost | Check WiFi, ensure stable connection |
| "Upload timeout" | Slow connection or large file | Increase timeout, improve WiFi signal |
| "Update failed" | Corrupt firmware or wrong board | Recompile firmware for correct board |

### ESP32 Error Codes

```cpp
// Update.h error codes
UPDATE_ERROR_OK = 0,
UPDATE_ERROR_WRITE,       // Flash write error
UPDATE_ERROR_ERASE,       // Flash erase error
UPDATE_ERROR_READ,        // Flash read error
UPDATE_ERROR_SPACE,       // Not enough space
UPDATE_ERROR_SIZE,        // Bad size
UPDATE_ERROR_STREAM,      // Stream error
UPDATE_ERROR_MD5,         // MD5 check failed
UPDATE_ERROR_MAGIC_BYTE,  // Wrong magic byte
UPDATE_ERROR_ACTIVATE,    // Activation failed
UPDATE_ERROR_NO_PARTITION,// Partition not found
UPDATE_ERROR_BAD_ARGUMENT,
UPDATE_ERROR_ABORT        // Aborted
```

Return appropriate HTTP status codes:
- **200:** Success
- **400:** Bad request (invalid file)
- **413:** Payload too large
- **500:** Internal error (flash error, etc.)

## Testing

### Development Testing

1. **Compile Test Firmware**
   ```bash
   pio run
   # Output: .pio/build/esp32dev/firmware.bin
   ```

2. **Test Upload**
   - Start ESP32 with current firmware
   - Open web interface
   - Navigate to Settings → Firmware Update
   - Select the compiled .bin file
   - Monitor serial output for upload progress

3. **Verify Reboot**
   - Watch for ESP32 reboot
   - Confirm new firmware version loads
   - Check web interface reconnects

### Production Testing

- Test with different firmware sizes (100KB, 500KB, 1MB, 2MB)
- Test with intentionally corrupted files
- Test with wrong board firmware
- Test connection loss during upload
- Test multiple consecutive updates
- Test rollback capability (if implemented)

## Rollback Strategy

### OTA Partition Rollback

ESP32 supports automatic rollback if new firmware fails to boot:

```cpp
#include <esp_ota_ops.h>

void setup() {
  // Mark current firmware as valid after successful boot
  const esp_partition_t* running = esp_ota_get_running_partition();
  esp_ota_img_states_t ota_state;
  
  if (esp_ota_get_state_partition(running, &ota_state) == ESP_OK) {
    if (ota_state == ESP_OTA_IMG_PENDING_VERIFY) {
      // First boot after OTA - mark as valid
      esp_ota_mark_app_valid_cancel_rollback();
    }
  }
}
```

## Web Interface Export

The firmware update functionality is included in both export options:

### Vanilla Export
- Complete HTML form in `settings.html`
- JavaScript handlers in `app.js`
- CSS styles in `style.css`
- File size: ~2KB additional (included in 20KB total)

### React Build Export
- Full `FirmwareUpdate.tsx` component
- Included in build output
- File size: Part of overall bundle

## API Reference

### Upload Request

```http
POST /update HTTP/1.1
Host: 192.168.4.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Content-Length: 1234567

------WebKitFormBoundary
Content-Disposition: form-data; name="firmware"; filename="firmware.bin"
Content-Type: application/octet-stream

[BINARY DATA]
------WebKitFormBoundary--
```

### Success Response

```http
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain
Content-Length: 2

OK
```

### Error Response

```http
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain
Content-Length: 23

Flash write error: 0x02
```

## Additional Resources

- [ESP32 OTA Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/ota.html)
- [AsyncWebServer OTA Examples](https://github.com/me-no-dev/ESPAsyncWebServer)
- [Arduino Update Library](https://github.com/espressif/arduino-esp32/tree/master/libraries/Update)

## Troubleshooting

### "Update failed to start"
- Check partition table configuration
- Ensure enough space for OTA partition
- Verify board_build.partitions setting

### "Upload succeeds but ESP32 doesn't reboot"
- Add explicit `ESP.restart()` in success handler
- Check serial output for crash logs
- Verify new firmware is valid for your board

### "ESP32 boots to old firmware after update"
- Enable OTA rollback protection
- Mark app as valid in setup()
- Check for boot loop in new firmware

### "Connection lost during upload"
- Improve WiFi signal strength
- Use wired connection if possible (ESP32-Ethernet)
- Increase timeout values
- Reduce upload chunk size
