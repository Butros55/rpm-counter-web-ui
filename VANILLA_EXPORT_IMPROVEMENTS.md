# Improving Vanilla Export to Match React UI

This guide explains how to enhance the vanilla HTML/CSS/JS export to more closely match the React application's appearance and functionality.

## Key Differences Between React and Vanilla Export

### 1. Component Styling

**React (shadcn + Tailwind):**

```tsx
<Button variant="outline" className="gap-2">
  <Download weight="bold" size={18} />
  Export for ESP32
</Button>
```

**Vanilla HTML:**

```html
<button class="btn btn-secondary">
  <span class="icon">⬇</span> Export for ESP32
</button>
```

**Improvements Needed:**

- Match exact button padding (0.625rem 1rem vs Tailwind's spacing)
- Match border radius (--radius: 0.5rem)
- Match shadow and hover effects
- Use proper icon sizing

### 2. Switch Component

**React (shadcn Switch):**

- Smooth transition animation (0.2s)
- Precise thumb positioning
- Focus ring with proper color
- Accessible markup

**Vanilla CSS:**
Current implementation is already good, but needs:

- Match exact dimensions (44px width, 24px height)
- Match thumb size (18px)
- Match transition timing
- Match focus states

### 3. Slider Component

**React (shadcn Slider):**

```tsx
<Slider
  value={[brightness]}
  onValueChange={([value]) => setBrightness(value)}
  min={0}
  max={255}
  step={1}
/>
```

**Vanilla:**

- Uses native `<input type="range">`
- Styling is browser-dependent

**Improvements:**

```css
/* Better cross-browser slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: transparent;
  outline: none;
}

/* Track */
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
    var(--primary) 0%,
    var(--primary) var(--slider-value, 50%),
    var(--muted) var(--slider-value, 50%),
    var(--muted) 100%
  );
  border-radius: 4px;
}

/* Thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid var(--primary);
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s, box-shadow 0.15s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

/* Firefox */
input[type="range"]::-moz-range-track {
  height: 8px;
  background: var(--muted);
  border-radius: 4px;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid var(--primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
```

And JavaScript to update slider value visualization:

```javascript
function updateSliderBackground(slider) {
  const value = slider.value;
  const min = slider.min || 0;
  const max = slider.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;
  slider.style.setProperty("--slider-value", `${percentage}%`);
}

document.querySelectorAll('input[type="range"]').forEach((slider) => {
  updateSliderBackground(slider);
  slider.addEventListener("input", () => updateSliderBackground(slider));
});
```

### 4. Card Component

**React (shadcn Card):**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Display Mode & Brightness</CardTitle>
    <CardDescription>Configure the shift light behavior</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

**CSS Improvements:**

```css
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
```

### 5. Badge Component

**Current:**

```css
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}
```

**Enhanced:**

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  transition: all 0.15s;
}

.badge-connected {
  background: var(--success);
  color: white;
  box-shadow: 0 0 12px var(--success);
}

.badge-disconnected {
  background: var(--muted);
  color: var(--muted-fg);
}
```

### 6. LED Preview

**Current:** Static div segments

**Enhanced with Animation:**

```javascript
function updateLEDPreview() {
  const preview = document.getElementById("led-preview");
  if (!preview) return;

  const config = getCurrentConfig();
  const segments = 50;

  // Clear and rebuild
  preview.innerHTML = "";

  for (let i = 0; i < segments; i++) {
    const pct = (i / segments) * 100;
    const segment = document.createElement("div");
    segment.className = "led-segment";

    // Determine color
    let color;
    if (pct < config.greenEndPct) {
      color = config.greenColor;
    } else if (pct < config.yellowEndPct) {
      color = config.yellowColor;
    } else {
      color = config.redColor;
      if (pct >= config.blinkStartPct) {
        // Add blink animation
        segment.style.animation = "blink 0.5s infinite";
      }
    }

    segment.style.background = color;
    segment.style.boxShadow = `0 0 8px ${color}`;
    preview.appendChild(segment);
  }
}

// Add blink animation
const style = document.createElement("style");
style.textContent = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  .led-segment {
    flex: 1;
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(style);
```

### 7. Toast Notifications

**Enhanced Toast:**

```css
.toast {
  background: var(--card-bg);
  color: var(--fg-color);
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  margin-bottom: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border: 1px solid var(--border);
  min-width: 300px;
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast.success {
  border-left: 3px solid var(--success);
}

.toast.error {
  border-left: 3px solid var(--error);
}

@keyframes slideIn {
  from {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
}
```

```javascript
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "✓" : "✗";
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span style="font-size: 1.25rem;">${icon}</span>
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);

  // Auto dismiss after 3s
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

### 8. Color Picker

**Enhanced with better UX:**

```html
<div class="color-input-group">
  <div class="color-picker-wrapper">
    <input type="color" id="greenColor" value="#00FF00" />
    <div class="color-preview" style="background: #00FF00"></div>
  </div>
  <input type="text" id="greenColor-text" value="#00FF00" />
</div>
```

```css
.color-picker-wrapper {
  position: relative;
  width: 4rem;
  height: 2.5rem;
  border-radius: calc(var(--radius) - 2px);
  overflow: hidden;
  border: 1px solid var(--border);
}

.color-picker-wrapper input[type="color"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  opacity: 0;
}

.color-preview {
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform 0.15s;
}

.color-picker-wrapper:hover .color-preview {
  transform: scale(1.05);
}

.color-picker-wrapper:active .color-preview {
  transform: scale(0.95);
}
```

### 9. Loading States

Add skeleton loaders for better UX:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--muted) 25%,
    var(--border) 50%,
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: calc(var(--radius) - 2px);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

```javascript
function showLoadingState(element) {
  const skeleton = document.createElement("div");
  skeleton.className = "skeleton";
  skeleton.style.width = "100%";
  skeleton.style.height = "1.5rem";
  element.innerHTML = "";
  element.appendChild(skeleton);
}
```

### 10. Responsive Design

Add better mobile styles:

```css
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
    justify-content: center;
  }

  .color-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    max-width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
```

## Complete Enhanced CSS

See the full enhanced CSS in the export generator. Key additions:

- CSS custom properties for all colors
- Smooth transitions on interactive elements
- Proper focus states for accessibility
- Better shadows and depth
- Responsive breakpoints
- Loading states
- Animation keyframes

## Testing Checklist

After implementing improvements, test:

- [ ] All buttons have proper hover/active states
- [ ] Sliders show visual feedback
- [ ] Switches animate smoothly
- [ ] Color pickers update in real-time
- [ ] LED preview updates correctly
- [ ] Toasts slide in/out smoothly
- [ ] Cards have proper shadows
- [ ] Mobile layout works well
- [ ] All colors match React app
- [ ] Typography sizes/weights match

## Performance Optimization

For ESP32, keep in mind:

- Minimize CSS file size (remove unused rules)
- Combine selectors where possible
- Use simple animations (avoid complex transforms)
- Debounce slider inputs to reduce API calls
- Lazy load non-critical features

## Final Result

After these enhancements, the vanilla export should:

- Look 95%+ identical to React app
- Feel smooth and responsive
- Maintain small file size (~25-30KB total)
- Work perfectly on ESP32
- Be easily maintainable
