# APOLLO WAKE - Mission Control

A retro terminal-style dashboard for tracking your wake-up times. 
CGA/EGA era aesthetics with scanlines and CRT phosphor green feel.

## Mission

**Wake up at 07:30 LCT** every morning. Track your progress through mission stats.

## Quick Start

1. Open `index.html` in your browser
2. Add your wake-up times to `js/data.js`

## Data Format

Edit `js/data.js`:

```js
const GOAL_TIME = "07:30";

const wakeUpData = [
  { date: "2026-04-07", time: "07:25" },
  { date: "2026-04-08", time: "07:32" },
  // Add new entries (newest last)
];
```

- `date`: YYYY-MM-DD
- `time`: HH:MM (24-hour)

## Modules

| ID | Function |
|----|----------|
| MOD-01 | Total entries |
| MOD-02 | Streak sequence |
| MOD-03 | Average time |
| MOD-04 | Median time |
| MOD-05 | Earliest (min) |
| MOD-06 | Latest (max) |
| MOD-07 | 30-day timeline |
| LOG | Recent entries |

## Deploy

### GitHub Pages
Push to repo → Settings → Pages → Deploy from main

### Raspberry Pi
```bash
python3 -m http.server 8000
```

## Files

```
index.html     - Dashboard
css/style.css  - Terminal theme (VT323 font)
js/data.js     - Your data (edit manually)
js/app.js      - Stats & chart logic
README.md
```

## Customize

```js
// js/data.js - Change goal
const GOAL_TIME = "06:00";
```

```css
/* css/style.css - Change colors */
--primary: #ff6600;  /* Orange/sunrise */
--accent: #ff9933;
--text: #00ff00;     /* Phosphor green */
```

## Tech

- Plain HTML/CSS/JS (no build)
- [Chart.js](https://www.chartjs.org/) via CDN
- [VT323](https://fonts.google.com/specimen/VT323) font