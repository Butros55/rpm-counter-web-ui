export interface ExportFiles {
  'index.html': string
  'settings.html': string
  'style.css': string
  'app.js': string
}

export function generateVanillaExport(): ExportFiles {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RPM Counter - ShiftLight Setup</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>RPM Counter</h1>
            <p class="subtitle">ESP32 Shift Light Configuration</p>
        </header>

        <div class="tabs">
            <a href="index.html" class="tab active">ShiftLight Setup</a>
            <a href="settings.html" class="tab">Settings</a>
        </div>

        <div id="status-badge"></div>

        <div class="action-buttons">
            <button id="reset-btn" class="btn btn-secondary">
                <span class="icon">↻</span> Reset
            </button>
            <button id="test-btn" class="btn btn-secondary">
                <span class="icon">▶</span> Test
            </button>
            <button id="save-btn" class="btn btn-primary">
                <span class="icon">💾</span> Save
            </button>
        </div>

        <div id="vehicle-info" class="card">
            <div class="card-header">
                <h2>Vehicle Information</h2>
            </div>
            <div class="card-body">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Model:</span>
                        <span id="vehicle-model" class="value">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">VIN:</span>
                        <span id="vehicle-vin" class="value mono">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Diagnostic:</span>
                        <span id="vehicle-diag" class="value">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Data Age:</span>
                        <span id="vehicle-age" class="value">Loading...</span>
                    </div>
                </div>
                <div id="sync-status" class="sync-status"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>Display Mode & Brightness</h2>
                <p class="description">Configure the shift light behavior and LED brightness</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="mode">Mode</label>
                    <select id="mode" name="mode">
                        <option value="casual">Casual</option>
                        <option value="f1">F1-Style</option>
                        <option value="sensitive">Überempfindlich</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="brightness">
                        Brightness
                        <span id="brightness-value" class="value-display">128</span>
                    </label>
                    <input type="range" id="brightness" name="brightness" min="0" max="255" value="128">
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>RPM Range Configuration</h2>
                <p class="description">Set maximum RPM and threshold percentages</p>
            </div>
            <div class="card-body">
                <div class="form-group toggle-group">
                    <label for="autoscale">Auto-Scale Max RPM</label>
                    <label class="switch">
                        <input type="checkbox" id="autoscale" name="autoscale" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div id="fixed-rpm-group" class="form-group" style="display: none;">
                    <label for="fixedMaxRpm">Fixed Max RPM</label>
                    <input type="number" id="fixedMaxRpm" name="fixedMaxRpm" min="1000" max="15000" value="7000">
                </div>

                <div class="form-group">
                    <label for="greenEndPct">
                        Green End %
                        <span id="greenEndPct-value" class="value-display">40%</span>
                    </label>
                    <input type="range" id="greenEndPct" name="greenEndPct" min="0" max="100" value="40">
                </div>

                <div class="form-group">
                    <label for="yellowEndPct">
                        Yellow End %
                        <span id="yellowEndPct-value" class="value-display">75%</span>
                    </label>
                    <input type="range" id="yellowEndPct" name="yellowEndPct" min="0" max="100" value="75">
                </div>

                <div class="form-group">
                    <label for="blinkStartPct">
                        Blink Start %
                        <span id="blinkStartPct-value" class="value-display">90%</span>
                    </label>
                    <input type="range" id="blinkStartPct" name="blinkStartPct" min="0" max="100" value="90">
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>Zone Colors</h2>
                <p class="description">Configure colors for each RPM zone</p>
            </div>
            <div class="card-body">
                <div class="color-grid">
                    <div class="form-group">
                        <label for="greenColor">Low RPM Color</label>
                        <div class="color-input-group">
                            <input type="color" id="greenColor" name="greenColor" value="#00FF00">
                            <input type="text" id="greenColor-text" class="color-text mono" value="#00FF00">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="yellowColor">Mid RPM Color</label>
                        <div class="color-input-group">
                            <input type="color" id="yellowColor" name="yellowColor" value="#FFFF00">
                            <input type="text" id="yellowColor-text" class="color-text mono" value="#FFFF00">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="redColor">Shift Warning Color</label>
                        <div class="color-input-group">
                            <input type="color" id="redColor" name="redColor" value="#FF0000">
                            <input type="text" id="redColor-text" class="color-text mono" value="#FF0000">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>LED Preview</h2>
                <p class="description">Visual representation of your configuration</p>
            </div>
            <div class="card-body">
                <div id="led-preview" class="led-preview"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>Coming Home / Leaving Animations</h2>
                <p class="description">Enable logo animations for ignition events</p>
            </div>
            <div class="card-body">
                <div class="form-group toggle-group">
                    <label for="logoIgnOn">M-Logo bei Zündung an</label>
                    <label class="switch">
                        <input type="checkbox" id="logoIgnOn" name="logoIgnOn" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="form-group toggle-group">
                    <label for="logoEngStart">M-Logo bei Motorstart</label>
                    <label class="switch">
                        <input type="checkbox" id="logoEngStart" name="logoEngStart" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="form-group toggle-group">
                    <label for="logoIgnOff">Leaving-Animation bei Zündung aus</label>
                    <label class="switch">
                        <input type="checkbox" id="logoIgnOff" name="logoIgnOff" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <div id="dev-mode-panel" style="display: none;">
            <div class="card">
                <div class="card-header">
                    <h2>Developer Mode</h2>
                    <p class="description">Advanced debugging and testing features</p>
                </div>
                <div class="card-body">
                    <div class="form-group toggle-group">
                        <label for="autoReconnect">Auto-Reconnect BLE</label>
                        <label class="switch">
                            <input type="checkbox" id="autoReconnect" name="autoReconnect" checked>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="btn-group">
                        <button id="ble-connect-btn" class="btn btn-secondary">Connect OBD</button>
                        <button id="ble-disconnect-btn" class="btn btn-secondary">Disconnect OBD</button>
                    </div>

                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">Last TX:</span>
                            <span id="last-tx" class="value mono">-</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Last OBD:</span>
                            <span id="last-obd" class="value mono">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="toast-container"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>`

  const settingsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RPM Counter - Settings</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>RPM Counter</h1>
            <p class="subtitle">ESP32 Shift Light Configuration</p>
        </header>

        <div class="tabs">
            <a href="index.html" class="tab">ShiftLight Setup</a>
            <a href="settings.html" class="tab active">Settings</a>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>Mode</h2>
                <p class="description">Configure application behavior</p>
            </div>
            <div class="card-body">
                <div class="form-group toggle-group">
                    <div>
                        <label for="devMode">Developer Mode</label>
                        <p class="help-text">Enable advanced debugging features</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="devMode" name="devMode">
                        <span class="slider"></span>
                    </label>
                </div>
                <button id="save-mode-btn" class="btn btn-primary">Save Mode</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>WiFi Network</h2>
                <p class="description">Configure wireless connectivity</p>
            </div>
            <div class="card-body">
                <div id="wifi-status" class="status-info">
                    <div class="info-item">
                        <span class="label">Mode:</span>
                        <span id="wifi-mode" class="value">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Status:</span>
                        <span id="wifi-connection-status" class="value">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">SSID:</span>
                        <span id="wifi-ssid" class="value">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">IP Address:</span>
                        <span id="wifi-ip" class="value mono">Loading...</span>
                    </div>
                </div>

                <div class="btn-group">
                    <button id="wifi-scan-btn" class="btn btn-secondary">Scan Networks</button>
                    <button id="wifi-disconnect-btn" class="btn btn-secondary">Disconnect</button>
                </div>

                <div id="wifi-networks" class="network-list"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>Bluetooth Connection</h2>
                <p class="description">Manage OBD-II adapter pairing</p>
            </div>
            <div class="card-body">
                <div id="ble-status" class="status-info">
                    <div class="info-item">
                        <span class="label">Status:</span>
                        <span id="ble-connection-status" class="badge">Disconnected</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Device:</span>
                        <span id="ble-device-name" class="value">None</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Address:</span>
                        <span id="ble-device-address" class="value mono">-</span>
                    </div>
                </div>

                <button id="ble-scan-btn" class="btn btn-secondary">Scan Devices</button>

                <div id="ble-devices" class="device-list"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>My Vehicle</h2>
                <p class="description">Vehicle information from OBD-II</p>
            </div>
            <div class="card-body">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Model:</span>
                        <span id="settings-vehicle-model" class="value">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">VIN:</span>
                        <span id="settings-vehicle-vin" class="value mono">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Diagnostic:</span>
                        <span id="settings-vehicle-diag" class="value">Loading...</span>
                    </div>
                </div>

                <button id="vehicle-refresh-btn" class="btn btn-secondary">
                    Refresh Vehicle Data
                </button>

                <div id="vehicle-sync-status" class="sync-status"></div>
            </div>
        </div>

        <div id="obd-console-section" style="display: none;">
            <div class="card">
                <div class="card-header">
                    <h2>OBD Console</h2>
                    <p class="description">Send raw commands to OBD-II adapter</p>
                </div>
                <div class="card-body">
                    <div class="console-input-group">
                        <input type="text" id="obd-cmd-input" placeholder="Enter OBD command (e.g., 010C)" class="mono">
                        <button id="obd-send-btn" class="btn btn-primary">Send</button>
                    </div>

                    <div id="obd-console-output" class="console-output"></div>

                    <div class="form-group toggle-group">
                        <label for="auto-log">Auto-Log from Status</label>
                        <label class="switch">
                            <input type="checkbox" id="auto-log">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div id="toast-container"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>`

  const styleCss = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --bg-color: oklch(0.12 0 0);
    --fg-color: oklch(0.92 0 0);
    --card-bg: oklch(0.18 0.01 240);
    --primary: oklch(0.65 0.22 240);
    --primary-fg: oklch(1 0 0);
    --accent: oklch(0.75 0.15 200);
    --accent-fg: oklch(0.12 0 0);
    --muted: oklch(0.25 0.01 240);
    --muted-fg: oklch(0.65 0 0);
    --border: oklch(0.30 0.01 240);
    --success: oklch(0.65 0.20 140);
    --warning: oklch(0.75 0.18 85);
    --error: oklch(0.60 0.22 25);
    --radius: 8px;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    background-color: var(--bg-color);
    color: var(--fg-color);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 2rem 1.5rem;
    }
}

header {
    margin-bottom: 1.5rem;
}

h1 {
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: var(--muted-fg);
    font-size: 0.875rem;
}

.tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    max-width: 28rem;
    margin-bottom: 1.5rem;
    background: var(--muted);
    padding: 0.25rem;
    border-radius: var(--radius);
}

.tab {
    padding: 0.625rem 1rem;
    text-align: center;
    text-decoration: none;
    color: var(--fg-color);
    border-radius: calc(var(--radius) - 2px);
    transition: background-color 0.15s;
    font-weight: 500;
}

.tab:hover {
    background: var(--card-bg);
}

.tab.active {
    background: var(--card-bg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.card {
    background: var(--card-bg);
    border-radius: var(--radius);
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
}

.card-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.description,
.help-text {
    color: var(--muted-fg);
    font-size: 0.875rem;
}

.card-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;
}

.value-display {
    float: right;
    color: var(--muted-fg);
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

input[type="text"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 0.625rem 0.75rem;
    background: var(--bg-color);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) - 2px);
    color: var(--fg-color);
    font-size: 0.875rem;
    transition: border-color 0.15s;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--primary);
}

input[type="range"] {
    width: 100%;
    height: 6px;
    background: var(--muted);
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.15s;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.toggle-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--muted);
    transition: 0.2s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--primary);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.color-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 640px) {
    .color-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.color-input-group {
    display: flex;
    gap: 0.5rem;
}

input[type="color"] {
    width: 4rem;
    height: 2.5rem;
    padding: 0.25rem;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) - 2px);
    background: var(--bg-color);
    cursor: pointer;
}

.color-text {
    flex: 1;
}

.mono {
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

.btn {
    padding: 0.625rem 1rem;
    border: none;
    border-radius: calc(var(--radius) - 2px);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 40px;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background: var(--primary);
    color: var(--primary-fg);
}

.btn-primary:hover:not(:disabled) {
    background: oklch(0.70 0.22 240);
}

.btn-primary:active:not(:disabled) {
    transform: translateY(1px);
}

.btn-secondary {
    background: var(--muted);
    color: var(--fg-color);
}

.btn-secondary:hover:not(:disabled) {
    background: oklch(0.30 0.01 240);
}

.btn-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.badge-connected {
    background: var(--success);
    color: var(--bg-color);
}

.badge-disconnected {
    background: var(--muted);
    color: var(--muted-fg);
}

.info-grid {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.info-item .label {
    color: var(--muted-fg);
    font-size: 0.875rem;
}

.info-item .value {
    font-size: 0.875rem;
    text-align: right;
}

.led-preview {
    height: 60px;
    background: var(--bg-color);
    border-radius: calc(var(--radius) - 2px);
    overflow: hidden;
    display: flex;
}

.led-preview .led-segment {
    flex: 1;
    transition: background-color 0.2s;
}

.sync-status {
    padding: 0.75rem;
    background: var(--muted);
    border-radius: calc(var(--radius) - 2px);
    margin-top: 1rem;
    font-size: 0.875rem;
    display: none;
}

.sync-status.active {
    display: block;
}

.network-list,
.device-list {
    margin-top: 1rem;
}

.network-item,
.device-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--muted);
    border-radius: calc(var(--radius) - 2px);
    margin-bottom: 0.5rem;
}

.network-item:last-child,
.device-item:last-child {
    margin-bottom: 0;
}

.signal-bars {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 14px;
}

.signal-bar {
    width: 3px;
    background: var(--muted-fg);
    border-radius: 1px;
}

.signal-bar:nth-child(1) { height: 4px; }
.signal-bar:nth-child(2) { height: 7px; }
.signal-bar:nth-child(3) { height: 10px; }
.signal-bar:nth-child(4) { height: 14px; }

.signal-bars.strong .signal-bar {
    background: var(--success);
}

.signal-bars.medium .signal-bar:nth-child(-n+3) {
    background: var(--warning);
}

.signal-bars.weak .signal-bar:nth-child(-n+2) {
    background: var(--error);
}

.console-input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.console-input-group input {
    flex: 1;
}

.console-output {
    background: var(--bg-color);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) - 2px);
    padding: 1rem;
    max-height: 300px;
    overflow-y: auto;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 0.75rem;
    margin-bottom: 1rem;
}

.console-line {
    margin-bottom: 0.25rem;
    white-space: pre-wrap;
    word-break: break-all;
}

.console-tx {
    color: var(--accent);
}

.console-rx {
    color: var(--success);
}

.console-error {
    color: var(--error);
}

#toast-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
}

.toast {
    background: var(--card-bg);
    color: var(--fg-color);
    padding: 1rem 1.25rem;
    border-radius: var(--radius);
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 250px;
    animation: slideIn 0.2s ease-out;
}

.toast.success {
    border-left: 4px solid var(--success);
}

.toast.error {
    border-left: 4px solid var(--error);
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: var(--card-bg);
    border-radius: var(--radius);
    padding: 1.5rem;
    max-width: 400px;
    width: 100%;
}

.modal-header {
    margin-bottom: 1rem;
}

.modal-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
}

.modal-footer {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.status-info {
    background: var(--muted);
    padding: 1rem;
    border-radius: calc(var(--radius) - 2px);
    margin-bottom: 1rem;
}

#status-badge {
    margin-bottom: 1rem;
}
`

  const appJs = `(function() {
    'use strict';

    const API_BASE = '';
    let statusPollInterval = null;
    let lastTxValue = '';
    let lastObdValue = '';

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function formDataFromConfig() {
        const formData = new FormData();
        const elements = document.querySelectorAll('[name]');
        elements.forEach(el => {
            if (el.type === 'checkbox') {
                formData.append(el.name, el.checked);
            } else {
                formData.append(el.name, el.value);
            }
        });
        return formData;
    }

    async function fetchStatus() {
        try {
            const res = await fetch(\`\${API_BASE}/status\`);
            const data = await res.json();
            updateStatusUI(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch status:', error);
            return null;
        }
    }

    function updateStatusUI(status) {
        if (!status) return;

        const statusBadge = document.getElementById('status-badge');
        if (statusBadge) {
            statusBadge.innerHTML = \`
                <span class="badge \${status.connected ? 'badge-connected' : 'badge-disconnected'}">
                    \${status.connected ? '● Connected' : '○ Disconnected'}
                </span>
            \`;
        }

        const vehicleModel = document.getElementById('vehicle-model') || document.getElementById('settings-vehicle-model');
        const vehicleVin = document.getElementById('vehicle-vin') || document.getElementById('settings-vehicle-vin');
        const vehicleDiag = document.getElementById('vehicle-diag') || document.getElementById('settings-vehicle-diag');
        const vehicleAge = document.getElementById('vehicle-age');

        if (vehicleModel) vehicleModel.textContent = status.vehicleModel || 'Unknown';
        if (vehicleVin) vehicleVin.textContent = status.vehicleVin || 'Not available';
        if (vehicleDiag) vehicleDiag.textContent = status.vehicleDiag || 'OK';
        if (vehicleAge) {
            const age = status.vehicleInfoAge;
            vehicleAge.textContent = age > 0 ? \`\${age}s ago\` : 'Just now';
        }

        const syncStatus = document.getElementById('sync-status') || document.getElementById('vehicle-sync-status');
        if (syncStatus) {
            if (status.vehicleInfoRequestRunning) {
                syncStatus.textContent = '⟳ Synchronizing vehicle data...';
                syncStatus.className = 'sync-status active';
            } else if (status.vehicleInfoReady) {
                syncStatus.textContent = '✓ Vehicle data synced';
                syncStatus.className = 'sync-status active';
            } else {
                syncStatus.className = 'sync-status';
            }
        }

        if (status.devMode) {
            const devPanel = document.getElementById('dev-mode-panel');
            const obdConsole = document.getElementById('obd-console-section');
            if (devPanel) devPanel.style.display = 'block';
            if (obdConsole) obdConsole.style.display = 'block';

            const lastTx = document.getElementById('last-tx');
            const lastObd = document.getElementById('last-obd');
            if (lastTx) lastTx.textContent = status.lastTx || '-';
            if (lastObd) lastObd.textContent = status.lastObd || '-';

            const autoLog = document.getElementById('auto-log');
            if (autoLog && autoLog.checked) {
                if (status.lastTx && status.lastTx !== lastTxValue) {
                    appendConsoleLog(\`> \${status.lastTx}\`, 'tx');
                    lastTxValue = status.lastTx;
                }
                if (status.lastObd && status.lastObd !== lastObdValue) {
                    appendConsoleLog(\`< \${status.lastObd}\`, 'rx');
                    lastObdValue = status.lastObd;
                }
            }
        }

        const devModeToggle = document.getElementById('devMode');
        if (devModeToggle && status.devMode !== undefined) {
            devModeToggle.checked = status.devMode;
        }

        const autoReconnect = document.getElementById('autoReconnect');
        if (autoReconnect && status.autoReconnect !== undefined) {
            autoReconnect.checked = status.autoReconnect;
        }
    }

    function updateLEDPreview() {
        const preview = document.getElementById('led-preview');
        if (!preview) return;

        const greenEnd = parseInt(document.getElementById('greenEndPct').value);
        const yellowEnd = parseInt(document.getElementById('yellowEndPct').value);
        const blinkStart = parseInt(document.getElementById('blinkStartPct').value);
        const greenColor = document.getElementById('greenColor').value;
        const yellowColor = document.getElementById('yellowColor').value;
        const redColor = document.getElementById('redColor').value;

        preview.innerHTML = '';
        const segments = 50;
        for (let i = 0; i < segments; i++) {
            const pct = (i / segments) * 100;
            const segment = document.createElement('div');
            segment.className = 'led-segment';
            
            if (pct < greenEnd) {
                segment.style.background = greenColor;
            } else if (pct < yellowEnd) {
                segment.style.background = yellowColor;
            } else {
                segment.style.background = redColor;
                if (pct >= blinkStart) {
                    segment.style.opacity = '0.5';
                }
            }
            
            preview.appendChild(segment);
        }
    }

    function syncColorInputs(colorId, textId) {
        const colorInput = document.getElementById(colorId);
        const textInput = document.getElementById(textId);
        
        if (colorInput && textInput) {
            colorInput.addEventListener('input', () => {
                textInput.value = colorInput.value;
                updateLEDPreview();
            });
            
            textInput.addEventListener('input', () => {
                if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
                    colorInput.value = textInput.value;
                    updateLEDPreview();
                }
            });
        }
    }

    function setupSliderValueDisplay(sliderId) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(\`\${sliderId}-value\`);
        if (slider && display) {
            slider.addEventListener('input', () => {
                const suffix = sliderId.includes('Pct') ? '%' : '';
                display.textContent = slider.value + suffix;
                updateLEDPreview();
            });
        }
    }

    function setupAutoscaleToggle() {
        const autoscale = document.getElementById('autoscale');
        const fixedGroup = document.getElementById('fixed-rpm-group');
        if (autoscale && fixedGroup) {
            autoscale.addEventListener('change', () => {
                fixedGroup.style.display = autoscale.checked ? 'none' : 'block';
            });
        }
    }

    async function handleSave() {
        const btn = document.getElementById('save-btn');
        btn.disabled = true;
        try {
            await fetch(\`\${API_BASE}/save\`, {
                method: 'POST',
                body: formDataFromConfig()
            });
            showToast('Configuration saved to ESP32', 'success');
        } catch (error) {
            showToast('Failed to save configuration', 'error');
            console.error(error);
        } finally {
            btn.disabled = false;
        }
    }

    async function handleTest() {
        const btn = document.getElementById('test-btn');
        btn.disabled = true;
        try {
            await fetch(\`\${API_BASE}/test\`, {
                method: 'POST',
                body: formDataFromConfig()
            });
            showToast('Test pattern started', 'success');
        } catch (error) {
            showToast('Failed to start test', 'error');
            console.error(error);
        } finally {
            setTimeout(() => { btn.disabled = false; }, 3000);
        }
    }

    function handleReset() {
        window.location.reload();
    }

    async function handleBLEConnect() {
        try {
            await fetch(\`\${API_BASE}/connect\`, { method: 'POST' });
            showToast('Connecting to OBD...', 'success');
        } catch (error) {
            showToast('Failed to connect', 'error');
        }
    }

    async function handleBLEDisconnect() {
        try {
            await fetch(\`\${API_BASE}/disconnect\`, { method: 'POST' });
            showToast('Disconnected from OBD', 'success');
        } catch (error) {
            showToast('Failed to disconnect', 'error');
        }
    }

    async function handleSaveMode() {
        const btn = document.getElementById('save-mode-btn');
        btn.disabled = true;
        try {
            const formData = new FormData();
            formData.append('devMode', document.getElementById('devMode').checked);
            formData.append('wifiMode', 'STA_WITH_AP_FALLBACK');
            formData.append('staSsid', '');
            formData.append('staPassword', '');
            formData.append('apSsid', '');
            formData.append('apPassword', '');
            
            await fetch(\`\${API_BASE}/settings\`, {
                method: 'POST',
                body: formData
            });
            showToast('Developer mode saved', 'success');
        } catch (error) {
            showToast('Failed to save settings', 'error');
        } finally {
            btn.disabled = false;
        }
    }

    async function handleWiFiScan() {
        const btn = document.getElementById('wifi-scan-btn');
        btn.disabled = true;
        try {
            await fetch(\`\${API_BASE}/wifi/scan\`, { method: 'POST' });
            showToast('Scanning for networks...', 'success');
            setTimeout(updateWiFiStatus, 2000);
        } catch (error) {
            showToast('Scan failed', 'error');
        } finally {
            setTimeout(() => { btn.disabled = false; }, 3000);
        }
    }

    async function handleWiFiDisconnect() {
        try {
            await fetch(\`\${API_BASE}/wifi/disconnect\`, { method: 'POST' });
            showToast('Disconnected from WiFi', 'success');
        } catch (error) {
            showToast('Failed to disconnect', 'error');
        }
    }

    async function updateWiFiStatus() {
        try {
            const res = await fetch(\`\${API_BASE}/wifi/status\`);
            const data = await res.json();
            
            const mode = document.getElementById('wifi-mode');
            const status = document.getElementById('wifi-connection-status');
            const ssid = document.getElementById('wifi-ssid');
            const ip = document.getElementById('wifi-ip');
            const networks = document.getElementById('wifi-networks');
            
            if (mode) mode.textContent = data.mode || 'Unknown';
            if (status) {
                status.textContent = data.staConnected ? 'Connected' : 
                                   data.staConnecting ? 'Connecting...' : 
                                   'Disconnected';
            }
            if (ssid) ssid.textContent = data.currentSsid || 'None';
            if (ip) ip.textContent = data.staIp || data.apIp || 'N/A';
            
            if (networks && data.scanResults) {
                networks.innerHTML = data.scanResults.map(network => \`
                    <div class="network-item">
                        <div>
                            <strong>\${network.ssid}</strong>
                            <span class="signal-bars \${getSignalClass(network.rssi)}">
                                <span class="signal-bar"></span>
                                <span class="signal-bar"></span>
                                <span class="signal-bar"></span>
                                <span class="signal-bar"></span>
                            </span>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="connectToWiFi('\${network.ssid}')">
                            Connect
                        </button>
                    </div>
                \`).join('');
            }
        } catch (error) {
            console.error('Failed to update WiFi status:', error);
        }
    }

    function getSignalClass(rssi) {
        if (rssi > -60) return 'strong';
        if (rssi > -75) return 'medium';
        return 'weak';
    }

    window.connectToWiFi = function(ssid) {
        const password = prompt(\`Enter password for \${ssid}:\`);
        if (password !== null) {
            const formData = new FormData();
            formData.append('ssid', ssid);
            formData.append('password', password);
            formData.append('mode', 'STA_WITH_AP_FALLBACK');
            
            fetch(\`\${API_BASE}/wifi/connect\`, {
                method: 'POST',
                body: formData
            }).then(() => {
                showToast('Connecting to ' + ssid, 'success');
                setTimeout(updateWiFiStatus, 3000);
            }).catch(() => {
                showToast('Connection failed', 'error');
            });
        }
    };

    async function handleBLEScan() {
        const btn = document.getElementById('ble-scan-btn');
        btn.disabled = true;
        try {
            await fetch(\`\${API_BASE}/ble/scan\`, { method: 'POST' });
            showToast('Scanning for devices...', 'success');
            setTimeout(updateBLEStatus, 2000);
        } catch (error) {
            showToast('Scan failed', 'error');
        } finally {
            setTimeout(() => { btn.disabled = false; }, 5000);
        }
    }

    async function updateBLEStatus() {
        try {
            const res = await fetch(\`\${API_BASE}/ble/status\`);
            const data = await res.json();
            
            const status = document.getElementById('ble-connection-status');
            const deviceName = document.getElementById('ble-device-name');
            const deviceAddress = document.getElementById('ble-device-address');
            const devices = document.getElementById('ble-devices');
            
            if (status) {
                status.textContent = data.connected ? 'Connected' : 
                                   data.scanning ? 'Scanning...' : 
                                   'Disconnected';
                status.className = \`badge badge-\${data.connected ? 'connected' : 'disconnected'}\`;
            }
            
            if (deviceName && data.currentDevice) {
                deviceName.textContent = data.currentDevice.name || 'Unknown';
                if (deviceAddress) deviceAddress.textContent = data.currentDevice.address || '-';
            }
            
            if (devices && data.devices) {
                devices.innerHTML = data.devices.map(device => \`
                    <div class="device-item">
                        <div>
                            <strong>\${device.name || 'Unknown'}</strong><br>
                            <small class="mono">\${device.address}</small>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="connectToBLE('\${device.address}', '\${device.name}')">
                            Connect
                        </button>
                    </div>
                \`).join('');
            }
        } catch (error) {
            console.error('Failed to update BLE status:', error);
        }
    }

    window.connectToBLE = function(address, name) {
        const formData = new FormData();
        formData.append('address', address);
        formData.append('name', name);
        formData.append('attempts', '3');
        
        fetch(\`\${API_BASE}/ble/connect-device\`, {
            method: 'POST',
            body: formData
        }).then(() => {
            showToast('Connecting to ' + name, 'success');
            setTimeout(updateBLEStatus, 3000);
        }).catch(() => {
            showToast('Connection failed', 'error');
        });
    };

    async function handleVehicleRefresh() {
        const btn = document.getElementById('vehicle-refresh-btn');
        btn.disabled = true;
        try {
            await fetch(\`\${API_BASE}/settings/vehicle-refresh\`, { method: 'POST' });
            showToast('Refreshing vehicle data...', 'success');
        } catch (error) {
            showToast('Refresh failed', 'error');
        } finally {
            setTimeout(() => { btn.disabled = false; }, 5000);
        }
    }

    function appendConsoleLog(text, type) {
        const output = document.getElementById('obd-console-output');
        if (!output) return;
        
        const line = document.createElement('div');
        line.className = \`console-line console-\${type}\`;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    async function handleOBDSend() {
        const input = document.getElementById('obd-cmd-input');
        const cmd = input.value.trim();
        if (!cmd) return;
        
        appendConsoleLog(\`> \${cmd}\`, 'tx');
        
        try {
            const formData = new FormData();
            formData.append('cmd', cmd);
            const res = await fetch(\`\${API_BASE}/dev/obd-send\`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            if (data.lastObd) {
                appendConsoleLog(\`< \${data.lastObd}\`, 'rx');
            }
            input.value = '';
        } catch (error) {
            appendConsoleLog('✗ Error sending command', 'error');
        }
    }

    function initIndexPage() {
        const saveBtn = document.getElementById('save-btn');
        const testBtn = document.getElementById('test-btn');
        const resetBtn = document.getElementById('reset-btn');
        const bleConnectBtn = document.getElementById('ble-connect-btn');
        const bleDisconnectBtn = document.getElementById('ble-disconnect-btn');
        
        if (saveBtn) saveBtn.addEventListener('click', handleSave);
        if (testBtn) testBtn.addEventListener('click', handleTest);
        if (resetBtn) resetBtn.addEventListener('click', handleReset);
        if (bleConnectBtn) bleConnectBtn.addEventListener('click', handleBLEConnect);
        if (bleDisconnectBtn) bleDisconnectBtn.addEventListener('click', handleBLEDisconnect);
        
        setupSliderValueDisplay('brightness');
        setupSliderValueDisplay('greenEndPct');
        setupSliderValueDisplay('yellowEndPct');
        setupSliderValueDisplay('blinkStartPct');
        setupAutoscaleToggle();
        
        syncColorInputs('greenColor', 'greenColor-text');
        syncColorInputs('yellowColor', 'yellowColor-text');
        syncColorInputs('redColor', 'redColor-text');
        
        updateLEDPreview();
        
        const sliders = ['greenEndPct', 'yellowEndPct', 'blinkStartPct'];
        sliders.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', updateLEDPreview);
        });
    }

    function initSettingsPage() {
        const saveModeBtn = document.getElementById('save-mode-btn');
        const wifiScanBtn = document.getElementById('wifi-scan-btn');
        const wifiDisconnectBtn = document.getElementById('wifi-disconnect-btn');
        const bleScanBtn = document.getElementById('ble-scan-btn');
        const vehicleRefreshBtn = document.getElementById('vehicle-refresh-btn');
        const obdSendBtn = document.getElementById('obd-send-btn');
        const obdInput = document.getElementById('obd-cmd-input');
        
        if (saveModeBtn) saveModeBtn.addEventListener('click', handleSaveMode);
        if (wifiScanBtn) wifiScanBtn.addEventListener('click', handleWiFiScan);
        if (wifiDisconnectBtn) wifiDisconnectBtn.addEventListener('click', handleWiFiDisconnect);
        if (bleScanBtn) bleScanBtn.addEventListener('click', handleBLEScan);
        if (vehicleRefreshBtn) vehicleRefreshBtn.addEventListener('click', handleVehicleRefresh);
        if (obdSendBtn) obdSendBtn.addEventListener('click', handleOBDSend);
        if (obdInput) {
            obdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleOBDSend();
            });
        }
        
        updateWiFiStatus();
        updateBLEStatus();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const isSettingsPage = window.location.pathname.includes('settings.html');
        
        if (isSettingsPage) {
            initSettingsPage();
        } else {
            initIndexPage();
        }
        
        fetchStatus();
        statusPollInterval = setInterval(fetchStatus, 2500);
    });

})();
`

  return {
    'index.html': indexHtml,
    'settings.html': settingsHtml,
    'style.css': styleCss,
    'app.js': appJs,
  }
}

export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadAllFiles(files: ExportFiles) {
  Object.entries(files).forEach(([filename, content], index) => {
    setTimeout(() => {
      downloadFile(filename, content)
    }, index * 200)
  })
}

export async function saveFilesToDirectory(files: ExportFiles): Promise<string> {
  if (!('showDirectoryPicker' in window)) {
    throw new Error('File System Access API not supported')
  }

  try {
    const dirHandle = await (window as any).showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'downloads'
    })

    for (const [filename, content] of Object.entries(files)) {
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()
    }

    return dirHandle.name
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Folder selection cancelled')
    }
    throw error
  }
}
