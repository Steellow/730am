# 730am - Wake Up Tracker

A terminal-style dashboard for tracking your wake-up times. 
Retro hacker vibes with scanlines, ASCII art, and command-line aesthetics.

## Goal

Wake up at **07:30** every morning. Streak counts days ≤ 08:00.

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

## Self-Host

### Option 1: GitHub Pages
1. Fork this repo
2. Edit `js/data.js` with your wake-up times
3. Push to master
4. Enable GitHub Pages: Settings → Pages → Deploy from master

### Option 2: Local
Open `index.html` in your browser, or serve locally:
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

## Customization

```js
// js/data.js - Change goal
const GOAL_TIME = "06:00";
```

```css
/* css/style.css - Colors */
--primary: #ff6600;  /* Orange/sunrise */
--text: #00ff00;     /* Terminal green */
```

## Tech

- Plain HTML/CSS/JS (no build)
- [Chart.js](https://www.chartjs.org/) via CDN
- [VT323](https://fonts.google.com/specimen/VT323) font